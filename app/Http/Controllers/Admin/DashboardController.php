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
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'q' => trim((string) $request->query('q', '')),
        ];

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
            'recentOrders' => Order::query()
                ->when($filters['q'] !== '', function ($query) use ($filters) {
                    $query->where(function ($innerQuery) use ($filters) {
                        $innerQuery
                            ->where('number', 'like', '%'.$filters['q'].'%')
                            ->orWhere('email', 'like', '%'.$filters['q'].'%')
                            ->orWhere('address_snapshot->recipient_name', 'like', '%'.$filters['q'].'%')
                            ->orWhere('address_snapshot->city', 'like', '%'.$filters['q'].'%');
                    });
                })
                ->latest()
                ->take(5)
                ->get(),
            'lowStockVariants' => ProductVariant::query()
                ->with('product')
                ->when($filters['q'] !== '', function ($query) use ($filters) {
                    $query->where(function ($innerQuery) use ($filters) {
                        $innerQuery
                            ->where('sku', 'like', '%'.$filters['q'].'%')
                            ->orWhereHas('product', fn ($productQuery) => $productQuery->where('name', 'like', '%'.$filters['q'].'%'));
                    });
                })
                ->whereRaw('stock_on_hand - stock_reserved <= 3')
                ->orderByRaw('stock_on_hand - stock_reserved asc')
                ->take(5)
                ->get(),
            'recentAdjustments' => InventoryAdjustment::query()
                ->with(['variant.product', 'user'])
                ->when($filters['q'] !== '', function ($query) use ($filters) {
                    $query->where(function ($innerQuery) use ($filters) {
                        $innerQuery
                            ->where('notes', 'like', '%'.$filters['q'].'%')
                            ->orWhere('type', 'like', '%'.$filters['q'].'%')
                            ->orWhereHas('variant', function ($variantQuery) use ($filters) {
                                $variantQuery
                                    ->where('sku', 'like', '%'.$filters['q'].'%')
                                    ->orWhereHas('product', fn ($productQuery) => $productQuery->where('name', 'like', '%'.$filters['q'].'%'));
                            });
                    });
                })
                ->latest()
                ->take(5)
                ->get(),
            'filters' => $filters,
        ]);
    }
}
