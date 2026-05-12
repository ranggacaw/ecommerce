<?php

namespace App\Services;

use App\Contracts\PaymentGateway;
use App\Contracts\ShippingGateway;
use App\Models\Address;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\ProductVariant;
use App\Models\Shipment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CheckoutService
{
    public function __construct(
        protected PaymentGateway $paymentGateway,
        protected ShippingGateway $shippingGateway,
    ) {
    }

    public function paymentMethods(): array
    {
        return $this->paymentGateway->methods();
    }

    public function shippingOptions(Address $address, Cart $cart): array
    {
        return $this->shippingGateway->quote($address->toShipmentArray(), $this->totalWeight($cart));
    }

    public function placeOrder(Cart $cart, Address $address, string $paymentMethod, string $shippingCode): Order
    {
        $cart->loadMissing('items.variant.product');

        if ($cart->items->isEmpty()) {
            throw ValidationException::withMessages([
                'cart' => 'Your shopping bag is empty.',
            ]);
        }

        $shippingRate = collect($this->shippingOptions($address, $cart))
            ->firstWhere('code', $shippingCode);

        if (! $shippingRate) {
            throw ValidationException::withMessages([
                'shipping_code' => 'Please choose a valid shipping option.',
            ]);
        }

        return DB::transaction(function () use ($address, $cart, $paymentMethod, $shippingRate): Order {
            $variants = ProductVariant::query()
                ->whereIn('id', $cart->items->pluck('product_variant_id'))
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $subtotal = 0;

            foreach ($cart->items as $item) {
                $variant = $variants->get($item->product_variant_id);

                if (! $variant || $variant->available_stock < $item->quantity) {
                    throw ValidationException::withMessages([
                        'cart' => 'One or more items no longer have enough stock.',
                    ]);
                }

                $subtotal += $item->unit_price * $item->quantity;
                $variant->increment('stock_reserved', $item->quantity);
            }

            $order = Order::create([
                'number' => 'CBX-'.Str::upper(Str::random(10)),
                'user_id' => $cart->user_id,
                'email' => $cart->user?->email ?? 'guest@example.com',
                'phone' => $address->phone,
                'status' => 'pending',
                'payment_status' => 'pending',
                'fulfillment_status' => 'awaiting_fulfillment',
                'subtotal' => $subtotal,
                'discount_total' => 0,
                'shipping_total' => $shippingRate['cost'],
                'grand_total' => $subtotal + $shippingRate['cost'],
                'address_snapshot' => $address->toShipmentArray(),
                'placed_at' => now(),
            ]);

            foreach ($cart->items as $item) {
                $variant = $variants->get($item->product_variant_id);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_variant_id' => $variant->id,
                    'product_name' => $variant->product->name,
                    'variant_name' => $variant->display_name,
                    'sku' => $variant->sku,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total_price' => $item->unit_price * $item->quantity,
                    'metadata' => [
                        'material' => $variant->product->material,
                    ],
                ]);
            }

            $paymentData = $this->paymentGateway->createCharge($order, $paymentMethod);

            Payment::create([
                'order_id' => $order->id,
                'provider' => $paymentData['provider'],
                'method' => $paymentMethod,
                'external_reference' => $paymentData['external_reference'],
                'amount' => $order->grand_total,
                'status' => $paymentData['status'],
                'payload' => $paymentData['payload'],
                'paid_at' => $paymentData['paid_at'],
            ]);

            $shipmentData = $this->shippingGateway->createShipment($order, $shippingRate);

            Shipment::create([
                'order_id' => $order->id,
                'provider' => $shipmentData['provider'],
                'service_name' => $shipmentData['service_name'],
                'tracking_number' => $shipmentData['tracking_number'],
                'weight_grams' => $this->totalWeight($cart),
                'destination_summary' => implode(', ', array_filter([$address->city, $address->province, $address->country])),
                'cost' => $shippingRate['cost'],
                'status' => $shipmentData['status'],
                'label_url' => $shipmentData['label_url'],
                'payload' => $shipmentData['payload'],
            ]);

            if ($paymentData['status'] === 'paid') {
                $order->update([
                    'payment_status' => 'paid',
                    'status' => 'processing',
                ]);
            }

            $cart->items()->delete();

            return $order->fresh(['items', 'payments', 'shipments']);
        });
    }

    public function commitInventory(Order $order): void
    {
        if ($order->inventory_committed_at) {
            return;
        }

        DB::transaction(function () use ($order): void {
            $order->loadMissing('items.variant');

            foreach ($order->items as $item) {
                if (! $item->variant) {
                    continue;
                }

                $variant = ProductVariant::query()->lockForUpdate()->find($item->product_variant_id);

                if (! $variant) {
                    continue;
                }

                $variant->update([
                    'stock_on_hand' => max(0, $variant->stock_on_hand - $item->quantity),
                    'stock_reserved' => max(0, $variant->stock_reserved - $item->quantity),
                ]);
            }

            $order->update(['inventory_committed_at' => now()]);
        });
    }

    public function releaseInventory(Order $order): void
    {
        if ($order->inventory_committed_at) {
            return;
        }

        DB::transaction(function () use ($order): void {
            $order->loadMissing('items.variant');

            foreach ($order->items as $item) {
                if (! $item->variant) {
                    continue;
                }

                $variant = ProductVariant::query()->lockForUpdate()->find($item->product_variant_id);

                if (! $variant) {
                    continue;
                }

                $variant->update([
                    'stock_reserved' => max(0, $variant->stock_reserved - $item->quantity),
                ]);
            }
        });
    }

    public function createAdminOrder(array $validated): Order
    {
        return DB::transaction(function () use ($validated): Order {
            $variant = ProductVariant::query()
                ->with('product')
                ->lockForUpdate()
                ->findOrFail($validated['product_variant_id']);

            if ($variant->available_stock < $validated['quantity']) {
                throw ValidationException::withMessages([
                    'quantity' => 'The selected variant does not have enough available stock.',
                ]);
            }

            $variant->increment('stock_reserved', $validated['quantity']);

            $subtotal = $variant->price * $validated['quantity'];
            $shippingTotal = $validated['shipping_total'];
            $paymentStatus = $validated['payment_status'];
            $userId = User::query()->where('email', $validated['email'])->value('id');

            $order = Order::create([
                'number' => 'CBX-'.Str::upper(Str::random(10)),
                'user_id' => $userId,
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'status' => $paymentStatus === 'paid' ? 'processing' : 'pending',
                'payment_status' => $paymentStatus,
                'fulfillment_status' => 'awaiting_fulfillment',
                'subtotal' => $subtotal,
                'discount_total' => 0,
                'shipping_total' => $shippingTotal,
                'grand_total' => $subtotal + $shippingTotal,
                'address_snapshot' => [
                    'recipient_name' => $validated['recipient_name'],
                    'phone' => $validated['phone'],
                    'line1' => $validated['line1'],
                    'city' => $validated['city'],
                    'province' => $validated['province'],
                    'postal_code' => $validated['postal_code'],
                    'country' => $validated['country'],
                ],
                'notes' => $validated['notes'] ?? null,
                'placed_at' => now(),
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_variant_id' => $variant->id,
                'product_name' => $variant->product->name,
                'variant_name' => $variant->display_name,
                'sku' => $variant->sku,
                'quantity' => $validated['quantity'],
                'unit_price' => $variant->price,
                'total_price' => $subtotal,
                'metadata' => [
                    'material' => $variant->product->material,
                ],
            ]);

            Payment::create([
                'order_id' => $order->id,
                'provider' => 'admin-manual',
                'method' => $validated['payment_method'],
                'external_reference' => 'ADMIN-'.Str::upper(Str::random(8)),
                'amount' => $subtotal + $shippingTotal,
                'status' => $paymentStatus,
                'payload' => ['created_via' => 'admin'],
                'paid_at' => $paymentStatus === 'paid' ? now() : null,
            ]);

            Shipment::create([
                'order_id' => $order->id,
                'provider' => 'admin-manual',
                'service_name' => $validated['shipping_service_name'],
                'tracking_number' => $validated['tracking_number'] ?: 'ADM-'.Str::upper(Str::random(10)),
                'weight_grams' => $validated['quantity'] * ($variant->weight_grams ?? 0),
                'destination_summary' => implode(', ', array_filter([$validated['city'], $validated['province'], $validated['country']])),
                'cost' => $shippingTotal,
                'status' => 'ready_to_ship',
                'label_url' => route('admin.orders.label', $order, false),
                'payload' => ['created_via' => 'admin'],
            ]);

            return $order->fresh(['items', 'payments', 'shipments']);
        });
    }

    protected function totalWeight(Cart $cart): int
    {
        return (int) $cart->items->sum(fn ($item) => $item->quantity * ($item->variant?->weight_grams ?? 0));
    }
}
