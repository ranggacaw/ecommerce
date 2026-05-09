<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class OrderStatusController extends Controller
{
    public function show(string $number): Response
    {
        $order = Order::query()
            ->where('number', $number)
            ->with(['items.variant.product.images', 'payments', 'shipments'])
            ->firstOrFail();

        $payment = $order->payments->first();
        $shipment = $order->shipments->first();

        return Inertia::render('Orders/Show', [
            'order' => [
                'id' => $order->id,
                'number' => $order->number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'fulfillment_status' => $order->fulfillment_status,
                'subtotal' => $order->subtotal,
                'discount_total' => $order->discount_total,
                'shipping_total' => $order->shipping_total,
                'grand_total' => $order->grand_total,
                'placed_at' => $order->placed_at,
                'email' => $order->email,
                'address' => $order->address_snapshot,
                'payment' => $payment ? [
                    'provider' => $payment->provider,
                    'method' => $payment->method,
                    'external_reference' => $payment->external_reference,
                    'amount' => $payment->amount,
                    'status' => $payment->status,
                    'paid_at' => $payment->paid_at,
                ] : null,
                'shipment' => $shipment ? [
                    'provider' => $shipment->provider,
                    'service_name' => $shipment->service_name,
                    'tracking_number' => $shipment->tracking_number,
                    'destination_summary' => $shipment->destination_summary,
                    'cost' => $shipment->cost,
                    'status' => $shipment->status,
                    'label_url' => $shipment->label_url,
                    'shipped_at' => $shipment->shipped_at,
                    'delivered_at' => $shipment->delivered_at,
                ] : null,
                'items' => $order->items->map(function ($item) {
                    $product = $item->variant?->product;
                    $primaryImage = $product?->images->firstWhere('is_primary', true) ?? $product?->images->first();

                    return [
                        'id' => $item->id,
                        'product_name' => $item->product_name,
                        'variant_name' => $item->variant_name,
                        'sku' => $item->sku,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'total_price' => $item->total_price,
                        'product_variant_id' => $item->product_variant_id,
                        'product_slug' => $product?->slug,
                        'image_url' => $primaryImage?->url,
                        'brand' => $item->metadata['brand'] ?? $product?->brand,
                    ];
                })->values(),
            ],
        ]);
    }
}
