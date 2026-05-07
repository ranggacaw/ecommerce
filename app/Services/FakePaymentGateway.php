<?php

namespace App\Services;

use App\Contracts\PaymentGateway;
use App\Models\Order;
use Illuminate\Support\Str;

class FakePaymentGateway implements PaymentGateway
{
    public function methods(): array
    {
        return [
            ['code' => 'e_wallet', 'label' => 'E-Wallet', 'description' => 'Instant payment through a wallet handoff.'],
            ['code' => 'bank_transfer', 'label' => 'Transfer Bank', 'description' => 'Virtual account payment with manual confirmation window.'],
            ['code' => 'card', 'label' => 'Kartu Kredit', 'description' => 'Immediate card authorization in checkout.'],
        ];
    }

    public function createCharge(Order $order, string $method): array
    {
        $status = $method === 'card' ? 'paid' : 'pending';

        return [
            'provider' => 'sandbox-pay',
            'external_reference' => 'PAY-'.Str::upper(Str::random(10)),
            'status' => $status,
            'payload' => [
                'checkout_url' => route('orders.show-public', $order->number, false),
                'method' => $method,
                'instructions' => $status === 'paid' ? 'Authorized instantly.' : 'Awaiting settlement confirmation.',
            ],
            'paid_at' => $status === 'paid' ? now() : null,
        ];
    }
}
