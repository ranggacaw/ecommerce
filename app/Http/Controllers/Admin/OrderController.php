<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Services\CheckoutService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class OrderController extends Controller
{
    private const STATUS_OPTIONS = ['all', 'pending', 'processing', 'completed', 'cancelled'];

    private const PAYMENT_STATUS_OPTIONS = ['all', 'pending', 'paid', 'failed'];

    private const FULFILLMENT_STATUS_OPTIONS = ['all', 'awaiting_fulfillment', 'packed', 'shipped', 'delivered'];

    private const ARCHIVE_FILTER_OPTIONS = ['active', 'all', 'archived'];

    public function index(Request $request): InertiaResponse
    {
        $filters = [
            'q' => trim((string) $request->query('q', '')),
            'status' => (string) $request->query('status', 'all'),
            'payment_status' => (string) $request->query('payment_status', 'all'),
            'fulfillment_status' => (string) $request->query('fulfillment_status', 'all'),
            'archived' => (string) $request->query('archived', 'active'),
        ];

        $orders = Order::query()
            ->with(['items', 'payments', 'shipments'])
            ->when($filters['archived'] === 'active', fn ($query) => $query->whereNull('archived_at'))
            ->when($filters['archived'] === 'archived', fn ($query) => $query->whereNotNull('archived_at'))
            ->when($filters['q'] !== '', function ($query) use ($filters) {
                $query->where(function ($innerQuery) use ($filters) {
                    $innerQuery
                        ->where('number', 'like', '%'.$filters['q'].'%')
                        ->orWhere('email', 'like', '%'.$filters['q'].'%')
                        ->orWhere('phone', 'like', '%'.$filters['q'].'%')
                        ->orWhere('address_snapshot->recipient_name', 'like', '%'.$filters['q'].'%')
                        ->orWhere('address_snapshot->city', 'like', '%'.$filters['q'].'%');
                });
            })
            ->when($filters['status'] !== 'all', fn ($query) => $query->where('status', $filters['status']))
            ->when($filters['payment_status'] !== 'all', fn ($query) => $query->where('payment_status', $filters['payment_status']))
            ->when($filters['fulfillment_status'] !== 'all', fn ($query) => $query->where('fulfillment_status', $filters['fulfillment_status']))
            ->latest()
            ->take(50)
            ->get();

        $activeOrders = Order::query()->whereNull('archived_at');

        return Inertia::render('Admin/Orders', [
            'stats' => [
                'open' => (clone $activeOrders)->whereIn('status', ['pending', 'processing'])->count(),
                'awaitingFulfillment' => (clone $activeOrders)->whereIn('fulfillment_status', ['awaiting_fulfillment', 'packed'])->count(),
                'paid' => (clone $activeOrders)->where('payment_status', 'paid')->count(),
            ],
            'orders' => $orders,
            'variants' => ProductVariant::query()->with('product')->where('is_active', true)->orderBy('sku')->get(),
            'filters' => $filters,
            'options' => [
                'statuses' => self::STATUS_OPTIONS,
                'paymentStatuses' => self::PAYMENT_STATUS_OPTIONS,
                'fulfillmentStatuses' => self::FULFILLMENT_STATUS_OPTIONS,
                'archiveFilters' => self::ARCHIVE_FILTER_OPTIONS,
            ],
        ]);
    }

    public function show(Order $order): InertiaResponse
    {
        return Inertia::render('Admin/OrderShow', [
            'order' => $order->load(['items.variant.product', 'payments', 'shipments']),
        ]);
    }

    public function store(Request $request, CheckoutService $checkoutService): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'recipient_name' => ['required', 'string', 'max:255'],
            'line1' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:120'],
            'province' => ['required', 'string', 'max:120'],
            'postal_code' => ['required', 'string', 'max:30'],
            'country' => ['required', 'string', 'max:120'],
            'product_variant_id' => ['required', 'exists:product_variants,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'payment_method' => ['required', 'string', 'max:30'],
            'payment_status' => ['required', Rule::in(['pending', 'paid'])],
            'shipping_service_name' => ['required', 'string', 'max:100'],
            'shipping_total' => ['required', 'numeric', 'min:0'],
            'tracking_number' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string'],
        ]);

        $checkoutService->createAdminOrder($validated);

        return back()->with('success', 'Order created.');
    }

    public function update(Request $request, Order $order, CheckoutService $checkoutService): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'processing', 'completed'])],
            'payment_status' => ['required', Rule::in(['pending', 'paid', 'failed'])],
            'fulfillment_status' => ['required', Rule::in(['awaiting_fulfillment', 'packed', 'shipped', 'delivered'])],
        ]);

        if (
            ! in_array($order->fulfillment_status, ['shipped', 'delivered'], true)
            && in_array($validated['fulfillment_status'], ['shipped', 'delivered'], true)
        ) {
            $checkoutService->commitInventory($order);
        }

        $order->update($validated);

        $order->shipments()->update([
            'status' => $validated['fulfillment_status'] === 'delivered' ? 'delivered' : ($validated['fulfillment_status'] === 'shipped' ? 'in_transit' : 'ready_to_ship'),
            'shipped_at' => in_array($validated['fulfillment_status'], ['shipped', 'delivered'], true) ? ($order->shipments()->first()?->shipped_at ?? now()) : $order->shipments()->first()?->shipped_at,
            'delivered_at' => $validated['fulfillment_status'] === 'delivered' ? now() : null,
        ]);

        return back()->with('success', 'Order updated.');
    }

    public function cancel(Request $request, Order $order, CheckoutService $checkoutService): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => ['nullable', 'string'],
        ]);

        if ($order->status !== 'cancelled') {
            $checkoutService->releaseInventory($order);
        }

        $order->update([
            'status' => 'cancelled',
            'notes' => $this->appendOrderNote($order->notes, $validated['reason'] ?? 'Cancelled by admin.'),
        ]);

        $order->shipments()->update([
            'status' => 'cancelled',
        ]);

        return back()->with('success', 'Order cancelled.');
    }

    public function archive(Request $request, Order $order): RedirectResponse
    {
        $order->update([
            'archived_at' => $order->archived_at ?? now(),
            'archived_by' => $order->archived_by ?? $request->user()->id,
        ]);

        return back()->with('success', 'Order archived.');
    }

    public function label(Order $order): Response
    {
        $shipment = $order->shipments()->first();
        $address = $order->address_snapshot;

        return response(<<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Shipping Label {$order->number}</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 24px; }
        .label { border: 2px solid #111; padding: 24px; max-width: 520px; }
        .mono { font-family: monospace; font-size: 18px; }
    </style>
</head>
<body>
    <div class="label">
        <h1>Colorbox Fulfillment</h1>
        <p><strong>Order:</strong> {$order->number}</p>
        <p><strong>Tracking:</strong> {$shipment?->tracking_number}</p>
        <p><strong>Recipient:</strong> {$address['recipient_name']}</p>
        <p><strong>Phone:</strong> {$address['phone']}</p>
        <p>{$address['line1']}</p>
        <p>{$address['city']}, {$address['province']} {$address['postal_code']}</p>
        <p>{$address['country']}</p>
        <p class="mono">{$shipment?->service_name}</p>
    </div>
</body>
</html>
HTML)->header('Content-Type', 'text/html');
    }

    private function appendOrderNote(?string $existingNotes, string $note): string
    {
        $notes = array_filter([
            trim((string) $existingNotes),
            trim($note),
        ]);

        return implode(PHP_EOL, $notes);
    }
}
