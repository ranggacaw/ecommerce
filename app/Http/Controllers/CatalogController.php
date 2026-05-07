<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function index(Request $request): Response
    {
        return $this->catalogPage($request);
    }

    public function category(Request $request, Category $category): Response
    {
        return $this->catalogPage($request, fn (Builder $query) => $query->where('category_id', $category->id), $category, null);
    }

    public function collection(Request $request, Collection $collection): Response
    {
        return $this->catalogPage($request, fn (Builder $query) => $query->whereHas('collections', fn (Builder $inner) => $inner->where('collections.id', $collection->id)), null, $collection);
    }

    public function show(Product $product): Response
    {
        $product->load(['category', 'promotion', 'images', 'variants', 'collections']);

        $related = Product::query()
            ->with(['images', 'variants', 'category', 'promotion'])
            ->where('is_active', true)
            ->where('category_id', $product->category_id)
            ->whereKeyNot($product->id)
            ->take(4)
            ->get();

        return Inertia::render('Storefront/ProductShow', [
            'product' => $product,
            'relatedProducts' => $related,
        ]);
    }

    private function catalogPage(Request $request, ?callable $scope = null, ?Category $category = null, ?Collection $collection = null): Response
    {
        $query = Product::query()
            ->with(['images', 'variants', 'category', 'promotion'])
            ->where('is_active', true);

        if ($scope) {
            $scope($query);
        }

        if ($search = trim((string) $request->string('q'))) {
            $query->where(function (Builder $builder) use ($search): void {
                $builder
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('material', 'like', "%{$search}%");
            });
        }

        if ($size = $request->string('size')->toString()) {
            $query->whereHas('variants', fn (Builder $builder) => $builder->where('size', $size));
        }

        if ($color = $request->string('color')->toString()) {
            $query->whereHas('variants', fn (Builder $builder) => $builder->where('color', $color));
        }

        if ($request->boolean('in_stock')) {
            $query->whereHas('variants', fn (Builder $builder) => $builder->whereRaw('stock_on_hand - stock_reserved > 0'));
        }

        if ($minPrice = $request->integer('min_price')) {
            $query->where('base_price', '>=', $minPrice);
        }

        if ($maxPrice = $request->integer('max_price')) {
            $query->where('base_price', '<=', $maxPrice);
        }

        match ($request->string('sort')->toString()) {
            'price_asc' => $query->orderBy('base_price'),
            'price_desc' => $query->orderByDesc('base_price'),
            'latest' => $query->latest(),
            default => $query->orderByDesc('is_featured')->latest(),
        };

        $products = $query->paginate(12)->withQueryString();

        return Inertia::render('Storefront/Catalog', [
            'products' => $products,
            'categories' => Category::query()->where('is_active', true)->orderBy('name')->get(),
            'filters' => $request->only(['q', 'size', 'color', 'in_stock', 'min_price', 'max_price', 'sort']),
            'activeCategory' => $category,
            'activeCollection' => $collection,
        ]);
    }
}
