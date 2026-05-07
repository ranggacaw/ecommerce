<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Services\CartService;
use App\Services\CheckoutService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function create(Request $request, CartService $cartService, CheckoutService $checkoutService): RedirectResponse|Response
    {
        $cart = $cartService->resolve($request);
        $addresses = $request->user()->addresses()->orderByDesc('is_default')->get();

        if ($addresses->isEmpty()) {
            return redirect()
                ->route('account.addresses')
                ->with('error', 'Add a shipping address before checking out.');
        }

        $selectedAddress = $addresses->firstWhere('id', (int) $request->query('address_id')) ?? $addresses->first();

        return Inertia::render('Checkout/Index', [
            'cart' => $cart,
            'addresses' => $addresses,
            'selectedAddressId' => $selectedAddress->id,
            'shippingOptions' => $checkoutService->shippingOptions($selectedAddress, $cart),
            'paymentMethods' => $checkoutService->paymentMethods(),
        ]);
    }

    public function store(Request $request, CartService $cartService, CheckoutService $checkoutService): RedirectResponse
    {
        $validated = $request->validate([
            'address_id' => ['required', 'exists:addresses,id'],
            'shipping_code' => ['required', 'string'],
            'payment_method' => ['required', 'string'],
        ]);

        $address = Address::query()
            ->where('user_id', $request->user()->id)
            ->findOrFail($validated['address_id']);

        $order = $checkoutService->placeOrder(
            $cartService->resolve($request),
            $address,
            $validated['payment_method'],
            $validated['shipping_code'],
        );

        return redirect()
            ->route('orders.show-public', $order->number)
            ->with('success', 'Order placed successfully.');
    }
}
