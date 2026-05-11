<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\StorefrontContent;
use App\Models\WishlistItem;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $cart = ['count' => 0, 'subtotal' => 0.0];
        $wishlist = ['count' => 0];

        if (Schema::hasTable('carts') && Schema::hasTable('cart_items')) {
            $cart = app(CartService::class)->summary($request);
        }

        if ($request->user() && Schema::hasTable('wishlist_items')) {
            $wishlist['count'] = WishlistItem::query()
                ->where('user_id', $request->user()->id)
                ->count();
        }

        $navigationCategories = [];
        $storefrontShellContent = [];

        if (Schema::hasTable('categories')) {
            $navigationCategories = Category::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'slug']);
        }

        if (Schema::hasTable('storefront_contents')) {
            $storefrontShellContent = StorefrontContent::content(StorefrontContent::SHELL);
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'appName' => config('app.name'),
            'cart' => $cart,
            'wishlist' => $wishlist,
            'navigationCategories' => $navigationCategories,
            'storefrontShellContent' => $storefrontShellContent,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
