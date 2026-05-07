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
            ->with(['items', 'payments', 'shipments'])
            ->firstOrFail();

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }
}
