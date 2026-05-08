<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Cookie;

class CartService
{
    public function resolve(Request $request): Cart
    {
        $token = $this->token($request);

        if ($request->user()) {
            $this->mergeGuestIntoUser($request, $request->user());

            return Cart::query()
                ->with(['items.variant.product.images'])
                ->firstOrCreate(
                    ['user_id' => $request->user()->id, 'status' => 'active'],
                    ['cart_token' => $this->newToken()],
                )
                ->load(['items.variant.product.images']);
        }

        return Cart::query()
            ->with(['items.variant.product.images'])
            ->firstOrCreate(
                ['cart_token' => $token, 'status' => 'active'],
                ['expires_at' => now()->addDays(30)],
            )
            ->load(['items.variant.product.images']);
    }

    public function find(Request $request): ?Cart
    {
        if ($request->user()) {
            return Cart::query()
                ->with(['items.variant.product.images'])
                ->where('user_id', $request->user()->id)
                ->where('status', 'active')
                ->first();
        }

        $token = $request->cookie('cart_token');

        if (! $token) {
            return null;
        }

        return Cart::query()
            ->with(['items.variant.product.images'])
            ->where('cart_token', $token)
            ->where('status', 'active')
            ->first();
    }

    public function addItem(Request $request, ProductVariant $variant, int $quantity): Cart
    {
        $cart = $this->resolve($request);

        $item = $cart->items()->firstOrNew([
            'product_variant_id' => $variant->id,
        ]);

        $item->quantity = max(1, ($item->quantity ?? 0) + $quantity);
        $item->unit_price = $variant->price;
        $item->save();

        return $cart->fresh(['items.variant.product.images']);
    }

    public function updateItem(CartItem $item, int $quantity): void
    {
        if ($quantity <= 0) {
            $item->delete();

            return;
        }

        $item->update(['quantity' => $quantity]);
    }

    public function summary(Request $request): array
    {
        $cart = $this->find($request);

        if (! $cart) {
            return ['count' => 0, 'subtotal' => 0.0];
        }

        return [
            'count' => $cart->itemCount(),
            'subtotal' => $cart->subtotal(),
        ];
    }

    public function mergeGuestIntoUser(Request $request, ?User $user): void
    {
        if (! $user) {
            return;
        }

        $token = $request->cookie('cart_token');

        if (! $token) {
            return;
        }

        $guestCart = Cart::query()
            ->with('items')
            ->where('cart_token', $token)
            ->whereNull('user_id')
            ->where('status', 'active')
            ->first();

        if (! $guestCart) {
            return;
        }

        DB::transaction(function () use ($guestCart, $user): void {
            $userCart = Cart::query()
                ->where('user_id', $user->id)
                ->where('status', 'active')
                ->first();

            if (! $userCart) {
                $guestCart->forceFill([
                    'user_id' => $user->id,
                    'expires_at' => null,
                ])->save();

                return;
            }

            foreach ($guestCart->items as $guestItem) {
                $existing = $userCart->items()->firstOrNew([
                    'product_variant_id' => $guestItem->product_variant_id,
                ]);

                $existing->quantity = ($existing->quantity ?? 0) + $guestItem->quantity;
                $existing->unit_price = $guestItem->unit_price;
                $existing->save();
            }

            $guestCart->items()->delete();
            $guestCart->delete();
        });
    }

    public function cookie(Request $request): Cookie
    {
        return cookie('cart_token', $this->token($request), 60 * 24 * 30);
    }

    protected function token(Request $request): string
    {
        return (string) ($request->cookie('cart_token') ?: $this->newToken());
    }

    protected function newToken(): string
    {
        do {
            $token = (string) Str::uuid();
        } while (Cart::query()->where('cart_token', $token)->exists());

        return $token;
    }
}
