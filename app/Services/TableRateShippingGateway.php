<?php

namespace App\Services;

use App\Contracts\ShippingGateway;
use App\Models\Order;
use App\Models\Shipment;
use Illuminate\Support\Str;

class TableRateShippingGateway implements ShippingGateway
{
    public function quote(array $destination, int $weightGrams): array
    {
        $baseWeight = max(1, (int) ceil($weightGrams / 500));
        $province = Str::lower((string) ($destination['province'] ?? ''));
        $surcharge = str_contains($province, 'jakarta') ? 0 : 12000;

        return [
            [
                'code' => 'economy',
                'label' => 'Economy',
                'eta' => '3-5 hari',
                'cost' => 18000 + ($baseWeight * 4000) + $surcharge,
            ],
            [
                'code' => 'regular',
                'label' => 'Regular',
                'eta' => '2-3 hari',
                'cost' => 26000 + ($baseWeight * 5000) + $surcharge,
            ],
            [
                'code' => 'express',
                'label' => 'Express',
                'eta' => '1 hari',
                'cost' => 42000 + ($baseWeight * 7000) + $surcharge,
            ],
        ];
    }

    public function createShipment(Order $order, array $selectedRate): array
    {
        return [
            'provider' => 'sandbox-logistics',
            'service_name' => $selectedRate['label'],
            'tracking_number' => 'CBX-'.Str::upper(Str::random(12)),
            'status' => 'ready_to_ship',
            'label_url' => route('admin.orders.label', $order, false),
            'payload' => $selectedRate,
        ];
    }

    public function syncStatus(Shipment $shipment, string $externalStatus): array
    {
        $map = [
            'picked_up' => 'in_transit',
            'in_transit' => 'in_transit',
            'delivered' => 'delivered',
            'returned' => 'returned',
        ];

        $status = $map[$externalStatus] ?? 'in_transit';

        return [
            'status' => $status,
            'delivered_at' => $status === 'delivered' ? now() : null,
            'shipped_at' => in_array($status, ['in_transit', 'delivered'], true) ? ($shipment->shipped_at ?? now()) : $shipment->shipped_at,
        ];
    }
}
