<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(Request $request, CartService $cartService): Response
    {
        return Inertia::render('Cart/Index', [
            'cart' => $cartService->resolve($request),
        ]);
    }

    public function store(Request $request, CartService $cartService): RedirectResponse
    {
        $validated = $request->validate([
            'variant_id' => ['required', 'exists:product_variants,id'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:10'],
        ]);

        $variant = ProductVariant::query()->findOrFail($validated['variant_id']);

        $cartService->addItem($request, $variant, (int) ($validated['quantity'] ?? 1));

        return back()
            ->with('success', 'Item added to your bag.')
            ->withCookie($cartService->cookie($request));
    }

    public function update(Request $request, CartItem $cartItem, CartService $cartService): RedirectResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0', 'max:20'],
        ]);

        abort_unless($cartItem->cart_id === $cartService->resolve($request)->id, 403);

        $cartService->updateItem($cartItem, $validated['quantity']);

        return back()->withCookie($cartService->cookie($request));
    }

    public function destroy(Request $request, CartItem $cartItem, CartService $cartService): RedirectResponse
    {
        abort_unless($cartItem->cart_id === $cartService->resolve($request)->id, 403);

        $cartItem->delete();

        return back()->withCookie($cartService->cookie($request));
    }
}
