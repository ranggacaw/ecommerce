<?php

namespace App\Http\Controllers;

use App\Models\WishlistItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $user = $request->user()->load([
            'addresses' => fn ($query) => $query->orderByDesc('is_default'),
            'orders.items',
            'orders.payments',
            'orders.shipments',
        ]);

        return Inertia::render('Account/Dashboard', [
            'user' => $user,
            'orders' => $user->orders()->with(['items', 'payments', 'shipments'])->latest()->get(),
            'addresses' => $user->addresses,
            'wishlistCount' => WishlistItem::query()->where('user_id', $user->id)->count(),
        ]);
    }

    public function addresses(Request $request): Response
    {
        return Inertia::render('Account/Addresses', [
            'addresses' => $request->user()->addresses()->orderByDesc('is_default')->get(),
        ]);
    }

    public function wishlist(Request $request): Response
    {
        return Inertia::render('Account/Wishlist', [
            'items' => $request->user()
                ->wishlistItems()
                ->with(['product.images', 'product.variants', 'product.category', 'product.promotion'])
                ->latest()
                ->get(),
        ]);
    }
}
