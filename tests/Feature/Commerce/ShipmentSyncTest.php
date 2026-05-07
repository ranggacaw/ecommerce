<?php

use App\Models\Order;
use App\Models\Shipment;
use App\Models\User;

it('synchronizes delivered shipment updates into the order state', function () {
    $user = User::factory()->create();

    $order = Order::create([
        'number' => 'CBX-SYNC-001',
        'user_id' => $user->id,
        'email' => $user->email,
        'phone' => '081234567890',
        'status' => 'processing',
        'payment_status' => 'paid',
        'fulfillment_status' => 'shipped',
        'subtotal' => 100000,
        'discount_total' => 0,
        'shipping_total' => 20000,
        'grand_total' => 120000,
        'address_snapshot' => [
            'recipient_name' => $user->name,
            'phone' => '081234567890',
            'line1' => 'Jl. Testing',
            'city' => 'Jakarta',
            'province' => 'DKI Jakarta',
            'postal_code' => '10000',
            'country' => 'Indonesia',
        ],
        'placed_at' => now(),
    ]);

    $shipment = Shipment::create([
        'order_id' => $order->id,
        'provider' => 'sandbox-logistics',
        'service_name' => 'Regular',
        'tracking_number' => 'CBX-TRACK-001',
        'weight_grams' => 300,
        'destination_summary' => 'Jakarta, Indonesia',
        'cost' => 20000,
        'status' => 'in_transit',
    ]);

    $this->postJson(route('integrations.shipments.sync'), [
        'tracking_number' => $shipment->tracking_number,
        'status' => 'delivered',
    ], [
        'X-Webhook-Token' => 'sandbox-webhook-token',
    ])->assertOk();

    $this->assertDatabaseHas('shipments', [
        'id' => $shipment->id,
        'status' => 'delivered',
    ]);

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'completed',
        'fulfillment_status' => 'delivered',
    ]);
});
