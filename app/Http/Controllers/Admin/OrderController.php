<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\CheckoutService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class OrderController extends Controller
{
    public function index(): InertiaResponse
    {
        return Inertia::render('Admin/Orders', [
            'stats' => [
                'open' => Order::query()->whereIn('status', ['pending', 'processing'])->count(),
                'awaitingFulfillment' => Order::query()->whereIn('fulfillment_status', ['awaiting_fulfillment', 'packed'])->count(),
                'paid' => Order::query()->where('payment_status', 'paid')->count(),
            ],
            'orders' => Order::query()->with(['items', 'payments', 'shipments'])->latest()->take(20)->get(),
        ]);
    }

    public function show(Order $order): InertiaResponse
    {
        return Inertia::render('Admin/OrderShow', [
            'order' => $order->load(['items', 'payments', 'shipments']),
        ]);
    }

    public function update(Request $request, Order $order, CheckoutService $checkoutService): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'max:30'],
            'payment_status' => ['required', 'string', 'max:30'],
            'fulfillment_status' => ['required', 'string', 'max:30'],
        ]);

        if ($validated['status'] === 'cancelled') {
            $checkoutService->releaseInventory($order);
        }

        if (in_array($validated['fulfillment_status'], ['shipped', 'delivered'], true)) {
            $checkoutService->commitInventory($order);
        }

        $order->update($validated);

        $order->shipments()->update([
            'status' => $validated['fulfillment_status'] === 'delivered' ? 'delivered' : ($validated['fulfillment_status'] === 'shipped' ? 'in_transit' : 'ready_to_ship'),
            'shipped_at' => $validated['fulfillment_status'] === 'shipped' ? now() : $order->shipments()->first()?->shipped_at,
            'delivered_at' => $validated['fulfillment_status'] === 'delivered' ? now() : null,
        ]);

        return back()->with('success', 'Order updated.');
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
}
