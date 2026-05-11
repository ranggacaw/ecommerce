<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Collection;
use App\Models\HeroBanner;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Promotion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Catalog', [
            'products' => Product::query()->with(['category', 'promotion', 'variants', 'images', 'collections'])->latest()->get(),
            'categories' => Category::query()->latest()->get(),
            'collections' => Collection::query()->withCount('products')->latest()->get(),
            'promotions' => Promotion::query()->latest()->get(),
        ]);
    }

    public function merchandising(): Response
    {
        return Inertia::render('Admin/Merchandising', [
            'banners' => HeroBanner::query()->orderBy('sort_order')->get(),
            'promotions' => Promotion::query()->latest()->get(),
        ]);
    }

    public function storeCategory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['nullable', 'string', 'max:40'],
        ]);

        Category::create([
            ...$validated,
            'slug' => Str::slug($validated['name']),
        ]);

        return back()->with('success', 'Category saved.');
    }

    public function storeCollection(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'kind' => ['required', 'string', 'max:40'],
            'description' => ['nullable', 'string'],
        ]);

        Collection::create([
            ...$validated,
            'slug' => Str::slug($validated['name']),
        ]);

        return back()->with('success', 'Collection saved.');
    }

    public function storeBanner(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string'],
            'image_url' => ['required', 'url'],
            'cta_label' => ['nullable', 'string', 'max:100'],
            'cta_href' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        HeroBanner::create($validated);

        return back()->with('success', 'Banner saved.');
    }

    public function storePromotion(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'discount_type' => ['required', 'string', 'max:20'],
            'discount_value' => ['required', 'numeric', 'min:0'],
        ]);

        Promotion::create([
            ...$validated,
            'is_active' => true,
            'starts_at' => now(),
        ]);

        return back()->with('success', 'Promotion saved.');
    }

    public function storeProduct(Request $request): RedirectResponse
    {
        $validated = $this->validateProduct($request);

        $product = Product::create([
            'category_id' => $validated['category_id'],
            'promotion_id' => $validated['promotion_id'] ?? null,
            'brand' => $validated['brand'] ?? null,
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']).'-'.Str::lower(Str::random(4)),
            'short_description' => $validated['short_description'] ?? null,
            'description' => $validated['description'] ?? null,
            'material' => $validated['material'] ?? null,
            'size_chart' => $validated['size_chart'] ?? null,
            'base_price' => $validated['price'],
            'compare_price' => $validated['compare_price'] ?? null,
            'is_active' => $request->boolean('is_active', true),
            'is_featured' => $request->boolean('is_featured'),
            'is_new_arrival' => $request->boolean('is_new_arrival'),
            'is_promoted' => $request->boolean('is_promoted'),
        ]);

        $this->syncVariant($product, $validated);
        $this->syncImages($product, $validated);
        $product->collections()->sync($validated['collection_ids'] ?? []);

        return back()->with('success', 'Product created.');
    }

    public function updateProduct(Request $request, Product $product): RedirectResponse
    {
        $validated = $this->validateProduct($request, $product->id);

        $product->update([
            'category_id' => $validated['category_id'],
            'promotion_id' => $validated['promotion_id'] ?? null,
            'brand' => $validated['brand'] ?? null,
            'name' => $validated['name'],
            'short_description' => $validated['short_description'] ?? null,
            'description' => $validated['description'] ?? null,
            'material' => $validated['material'] ?? null,
            'size_chart' => $validated['size_chart'] ?? null,
            'base_price' => $validated['price'],
            'compare_price' => $validated['compare_price'] ?? null,
            'is_active' => $request->boolean('is_active', true),
            'is_featured' => $request->boolean('is_featured'),
            'is_new_arrival' => $request->boolean('is_new_arrival'),
            'is_promoted' => $request->boolean('is_promoted'),
        ]);

        $this->syncVariant($product, $validated, $validated['variant_id'] ?? null);
        $this->syncImages($product, $validated);
        $product->collections()->sync($validated['collection_ids'] ?? []);

        return back()->with('success', 'Product updated.');
    }

    private function syncVariant(Product $product, array $validated, ?int $variantId = null): void
    {
        $variant = $variantId
            ? $product->variants()->findOrFail($variantId)
            : $product->variants()->firstOrNew(['sku' => $validated['sku']]);

        $variant->fill([
            'sku' => $validated['sku'],
            'color' => $validated['color'] ?? null,
            'size' => $validated['size'] ?? null,
            'price' => $validated['price'],
            'stock_on_hand' => $validated['stock_on_hand'],
            'weight_grams' => $validated['weight_grams'],
            'is_active' => true,
        ]);
        $variant->save();
    }

    private function syncImages(Product $product, array $validated): void
    {
        $product->images()->delete();

        ProductImage::create([
            'product_id' => $product->id,
            'url' => $validated['primary_image_url'],
            'alt' => $product->name.' primary image',
            'position' => 1,
            'is_primary' => true,
        ]);

        if (! empty($validated['secondary_image_url'])) {
            ProductImage::create([
                'product_id' => $product->id,
                'url' => $validated['secondary_image_url'],
                'alt' => $product->name.' detail image',
                'position' => 2,
            ]);
        }
    }

    private function validateProduct(Request $request, ?int $productId = null): array
    {
        return $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'promotion_id' => ['nullable', 'exists:promotions,id'],
            'brand' => ['nullable', 'string', 'max:120'],
            'name' => ['required', 'string', 'max:255'],
            'short_description' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'material' => ['nullable', 'string', 'max:255'],
            'size_chart' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'compare_price' => ['nullable', 'numeric', 'min:0'],
            'sku' => ['required', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'max:60'],
            'size' => ['nullable', 'string', 'max:40'],
            'stock_on_hand' => ['required', 'integer', 'min:0'],
            'weight_grams' => ['required', 'integer', 'min:0'],
            'primary_image_url' => ['required', 'url'],
            'secondary_image_url' => ['nullable', 'url'],
            'collection_ids' => ['nullable', 'array'],
            'collection_ids.*' => ['integer', 'exists:collections,id'],
            'variant_id' => ['nullable', 'integer'],
        ]);
    }
}
