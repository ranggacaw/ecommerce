<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Collection;
use App\Models\HeroBanner;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class StorefrontController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Storefront/Home', [
            'banners' => HeroBanner::query()->where('is_active', true)->orderBy('sort_order')->get(),
            'categories' => Category::query()->where('is_active', true)->orderBy('name')->get(),
            'newArrivals' => Collection::query()
                ->where('slug', 'new-arrivals')
                ->with(['products.images', 'products.variants', 'products.category', 'products.promotion'])
                ->first(),
            'promoCollection' => Collection::query()
                ->where('kind', 'promo')
                ->with(['products.images', 'products.variants', 'products.category', 'products.promotion'])
                ->latest()
                ->first(),
            'featuredProducts' => Product::query()
                ->with(['images', 'variants', 'category', 'promotion'])
                ->where('is_active', true)
                ->where('is_featured', true)
                ->latest()
                ->take(8)
                ->get(),
        ]);
    }
}
