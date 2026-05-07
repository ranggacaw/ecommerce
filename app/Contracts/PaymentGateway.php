<?php

namespace App\Contracts;

use App\Models\Order;

interface PaymentGateway
{
    public function methods(): array;

    public function createCharge(Order $order, string $method): array;
}
