<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Collection;
use App\Models\HeroBanner;
use App\Models\InventoryAdjustment;
use App\Models\Order;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\ProductVariant;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'products' => Product::count(),
                'variants' => ProductVariant::count(),
                'orders' => Order::count(),
                'lowStock' => ProductVariant::query()->whereRaw('stock_on_hand - stock_reserved <= 3')->count(),
            ],
            'products' => Product::query()->with(['category', 'promotion', 'variants', 'images'])->latest()->get(),
            'categories' => Category::query()->latest()->get(),
            'collections' => Collection::query()->with('products')->latest()->get(),
            'banners' => HeroBanner::query()->orderBy('sort_order')->get(),
            'promotions' => Promotion::query()->latest()->get(),
            'orders' => Order::query()->with(['items', 'payments', 'shipments'])->latest()->take(12)->get(),
            'inventoryAdjustments' => InventoryAdjustment::query()->with(['variant.product', 'user'])->latest()->take(20)->get(),
        ]);
    }
}
