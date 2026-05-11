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
use App\Models\StoreLocation;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'products' => Product::count(),
                'categories' => Category::count(),
                'collections' => Collection::count(),
                'banners' => HeroBanner::count(),
                'promotions' => Promotion::count(),
                'locations' => StoreLocation::count(),
                'orders' => Order::count(),
                'lowStock' => ProductVariant::query()->whereRaw('stock_on_hand - stock_reserved <= 3')->count(),
            ],
            'recentOrders' => Order::query()->latest()->take(5)->get(),
            'lowStockVariants' => ProductVariant::query()
                ->with('product')
                ->whereRaw('stock_on_hand - stock_reserved <= 3')
                ->orderByRaw('stock_on_hand - stock_reserved asc')
                ->take(5)
                ->get(),
            'recentAdjustments' => InventoryAdjustment::query()->with(['variant.product', 'user'])->latest()->take(5)->get(),
        ]);
    }
}
