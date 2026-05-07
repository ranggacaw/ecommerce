<?php

namespace App\Contracts;

use App\Models\Order;
use App\Models\Shipment;

interface ShippingGateway
{
    public function quote(array $destination, int $weightGrams): array;

    public function createShipment(Order $order, array $selectedRate): array;

    public function syncStatus(Shipment $shipment, string $externalStatus): array;
}
