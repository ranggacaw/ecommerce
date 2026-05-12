<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Collection;
use App\Models\HeroBanner;
use App\Models\HomepageContent;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Promotion;
use App\Models\StorefrontContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'q' => trim((string) $request->query('q', '')),
            'category' => (string) $request->query('category', 'all'),
            'status' => (string) $request->query('status', 'all'),
        ];

        $products = Product::query()
            ->with(['category', 'promotion', 'variants', 'images', 'collections'])
            ->when($filters['q'] !== '', function ($query) use ($filters) {
                $query->where(function ($innerQuery) use ($filters) {
                    $innerQuery
                        ->where('name', 'like', '%'.$filters['q'].'%')
                        ->orWhere('brand', 'like', '%'.$filters['q'].'%')
                        ->orWhereHas('category', fn ($categoryQuery) => $categoryQuery->where('name', 'like', '%'.$filters['q'].'%'))
                        ->orWhereHas('variants', fn ($variantQuery) => $variantQuery->where('sku', 'like', '%'.$filters['q'].'%'));
                });
            })
            ->when($filters['category'] !== 'all', fn ($query) => $query->where('category_id', $filters['category']))
            ->when($filters['status'] === 'active', function ($query) {
                $query->where('is_active', true)->whereHas('variants', fn ($variantQuery) => $variantQuery->where('stock_on_hand', '>', 0));
            })
            ->when($filters['status'] === 'draft', fn ($query) => $query->where('is_active', false))
            ->when($filters['status'] === 'out_of_stock', function ($query) {
                $query->where('is_active', true)->whereHas('variants', fn ($variantQuery) => $variantQuery->where('stock_on_hand', '<=', 0));
            })
            ->latest()
            ->get();

        return Inertia::render('Admin/Catalog', [
            'products' => $products,
            'categories' => Category::query()->withCount('products')->latest()->get(),
            'collections' => Collection::query()->withCount('products')->latest()->get(),
            'promotions' => Promotion::query()->latest()->get(),
            'filters' => $filters,
        ]);
    }

    public function merchandising(Request $request): Response
    {
        $filters = [
            'q' => trim((string) $request->query('q', '')),
        ];

        return Inertia::render('Admin/Merchandising', [
            'banners' => HeroBanner::query()
                ->when($filters['q'] !== '', function ($query) use ($filters) {
                    $query->where(function ($innerQuery) use ($filters) {
                        $innerQuery
                            ->where('title', 'like', '%'.$filters['q'].'%')
                            ->orWhere('subtitle', 'like', '%'.$filters['q'].'%')
                            ->orWhere('cta_label', 'like', '%'.$filters['q'].'%');
                    });
                })
                ->orderBy('sort_order')
                ->get(),
            'homepageContent' => HomepageContent::current(),
            'promotions' => Promotion::query()
                ->when($filters['q'] !== '', function ($query) use ($filters) {
                    $query->where(function ($innerQuery) use ($filters) {
                        $innerQuery
                            ->where('name', 'like', '%'.$filters['q'].'%')
                            ->orWhere('code', 'like', '%'.$filters['q'].'%')
                            ->orWhere('description', 'like', '%'.$filters['q'].'%');
                    });
                })
                ->latest()
                ->get(),
            'storefrontContent' => StorefrontContent::currentMap(),
            'filters' => $filters,
        ]);
    }

    public function updateHomepageContent(Request $request): RedirectResponse
    {
        $homepageContent = HomepageContent::current();
        $section = $request->string('section')->value();

        if (! in_array($section, ['hero', 'support_cards', 'flash_sale', 'category_discovery', 'new_arrivals', 'editorial', 'featured_products'], true)) {
            abort(404);
        }

        $validated = match ($section) {
            'hero' => $request->validate([
                'section' => ['required', 'in:hero'],
                'hero.primary_cta_label' => ['required', 'string', 'max:100'],
                'hero.primary_cta_href' => ['required', 'string', 'max:255'],
                'hero.secondary_cta_label' => ['required', 'string', 'max:100'],
                'hero.secondary_cta_href' => ['required', 'string', 'max:255'],
            ]),
            'support_cards' => $request->validate([
                'section' => ['required', 'in:support_cards'],
                'support_cards' => ['required', 'array', 'size:3'],
                'support_cards.*.title' => ['required', 'string', 'max:100'],
                'support_cards.*.description' => ['required', 'string'],
            ]),
            'flash_sale' => $request->validate([
                'section' => ['required', 'in:flash_sale'],
                'flash_sale.badge_label' => ['required', 'string', 'max:100'],
                'flash_sale.hours_label' => ['required', 'string', 'max:30'],
                'flash_sale.minutes_label' => ['required', 'string', 'max:30'],
                'flash_sale.seconds_label' => ['required', 'string', 'max:30'],
                'flash_sale.highlight_label' => ['required', 'string', 'max:100'],
            ]),
            'category_discovery' => $request->validate([
                'section' => ['required', 'in:category_discovery'],
                'category_discovery.kicker' => ['required', 'string', 'max:100'],
                'category_discovery.title' => ['required', 'string', 'max:255'],
                'category_discovery.link_label' => ['required', 'string', 'max:100'],
                'category_discovery.tile_primary_prefix' => ['required', 'string', 'max:100'],
                'category_discovery.tile_cta_label' => ['required', 'string', 'max:100'],
            ]),
            'new_arrivals' => $request->validate([
                'section' => ['required', 'in:new_arrivals'],
                'new_arrivals.title' => ['required', 'string', 'max:255'],
                'new_arrivals.link_label' => ['required', 'string', 'max:100'],
            ]),
            'editorial' => $request->validate([
                'section' => ['required', 'in:editorial'],
                'editorial.kicker' => ['required', 'string', 'max:100'],
                'editorial.title' => ['required', 'string', 'max:255'],
                'editorial.description' => ['required', 'string'],
                'editorial.cta_label' => ['required', 'string', 'max:100'],
                'editorial.cta_href' => ['required', 'string', 'max:255'],
            ]),
            'featured_products' => $request->validate([
                'section' => ['required', 'in:featured_products'],
                'featured_products.kicker' => ['required', 'string', 'max:100'],
                'featured_products.title' => ['required', 'string', 'max:255'],
                'featured_products.link_label' => ['required', 'string', 'max:100'],
            ]),
        };

        $homepageContent->update([
            $section => $validated[$section],
        ]);

        return back()->with('success', 'Homepage content updated.');
    }

    public function updateStorefrontContent(Request $request): RedirectResponse
    {
        $key = $request->string('key')->value();

        if (! in_array($key, [
            StorefrontContent::SHELL,
            StorefrontContent::ABOUT,
            StorefrontContent::CONTACT,
            StorefrontContent::TERMS,
            StorefrontContent::PRIVACY,
        ], true)) {
            abort(404);
        }

        $validated = match ($key) {
            StorefrontContent::SHELL => $request->validate([
                'key' => ['required', 'in:shell'],
                'content.utility_labels' => ['required', 'array', 'size:3'],
                'content.utility_labels.*' => ['required', 'string', 'max:60'],
                'content.order_tracking.kicker' => ['required', 'string', 'max:100'],
                'content.order_tracking.title' => ['required', 'string', 'max:255'],
                'content.order_tracking.description' => ['required', 'string'],
                'content.order_tracking.input_placeholder' => ['required', 'string', 'max:100'],
                'content.order_tracking.button_label' => ['required', 'string', 'max:50'],
                'content.account_cta.kicker' => ['required', 'string', 'max:100'],
                'content.account_cta.title' => ['required', 'string', 'max:255'],
                'content.account_cta.description' => ['required', 'string'],
                'content.account_cta.guest_primary_label' => ['required', 'string', 'max:100'],
                'content.account_cta.guest_secondary_label' => ['required', 'string', 'max:100'],
                'content.account_cta.member_primary_label' => ['required', 'string', 'max:100'],
                'content.footer.brand_description' => ['required', 'string'],
                'content.footer.information_title' => ['required', 'string', 'max:100'],
                'content.footer.shop_all_label' => ['required', 'string', 'max:100'],
                'content.footer.new_arrivals_label' => ['required', 'string', 'max:100'],
                'content.footer.create_account_label' => ['required', 'string', 'max:100'],
                'content.footer.company_title' => ['required', 'string', 'max:100'],
                'content.footer.about_label' => ['required', 'string', 'max:100'],
                'content.footer.location_label' => ['required', 'string', 'max:100'],
                'content.footer.contact_label' => ['required', 'string', 'max:100'],
                'content.footer.terms_label' => ['required', 'string', 'max:100'],
                'content.footer.customer_care_title' => ['required', 'string', 'max:100'],
                'content.footer.shopping_bag_label' => ['required', 'string', 'max:100'],
                'content.footer.customer_access_label' => ['required', 'string', 'max:100'],
                'content.footer.back_to_top_label' => ['required', 'string', 'max:100'],
                'content.footer.multi_brand_title' => ['required', 'string', 'max:100'],
                'content.footer.multi_brand_labels' => ['required', 'array', 'size:3'],
                'content.footer.multi_brand_labels.*' => ['required', 'string', 'max:60'],
            ]),
            StorefrontContent::ABOUT => $request->validate([
                'key' => ['required', 'in:about'],
                'content.hero.kicker' => ['required', 'string', 'max:100'],
                'content.hero.title' => ['required', 'string', 'max:255'],
                'content.hero.highlight' => ['required', 'string', 'max:100'],
                'content.hero.description' => ['required', 'string'],
                'content.hero.image_url' => ['required', 'url'],
                'content.hero.image_alt' => ['required', 'string', 'max:255'],
                'content.mission.title' => ['required', 'string', 'max:255'],
                'content.mission.description' => ['required', 'string'],
                'content.mission.quote' => ['required', 'string'],
                'content.mission.image_url' => ['required', 'url'],
                'content.mission.image_alt' => ['required', 'string', 'max:255'],
                'content.timeline.title' => ['required', 'string', 'max:255'],
                'content.timeline.kicker' => ['required', 'string', 'max:100'],
                'content.timeline.items' => ['required', 'array', 'size:3'],
                'content.timeline.items.*.year' => ['required', 'string', 'max:20'],
                'content.timeline.items.*.title' => ['required', 'string', 'max:255'],
                'content.timeline.items.*.description' => ['required', 'string'],
                'content.timeline.items.*.featured' => ['required', 'boolean'],
                'content.values.title' => ['required', 'string', 'max:255'],
                'content.values.items' => ['required', 'array', 'size:4'],
                'content.values.items.*.icon' => ['required', 'string', 'max:50'],
                'content.values.items.*.label' => ['required', 'string', 'max:100'],
                'content.values.items.*.description' => ['required', 'string'],
                'content.values.items.*.color' => ['required', 'string', 'max:100'],
                'content.cta.title' => ['required', 'string', 'max:255'],
                'content.cta.button_label' => ['required', 'string', 'max:100'],
                'content.cta.button_href' => ['required', 'string', 'max:255'],
                'content.cta.image_url' => ['required', 'url'],
                'content.cta.image_alt' => ['required', 'string', 'max:255'],
            ]),
            StorefrontContent::CONTACT => $request->validate([
                'key' => ['required', 'in:contact'],
                'content.intro.kicker' => ['required', 'string', 'max:100'],
                'content.intro.title' => ['required', 'string', 'max:255'],
                'content.intro.description' => ['required', 'string'],
                'content.form.kicker' => ['required', 'string', 'max:100'],
                'content.form.title' => ['required', 'string', 'max:255'],
                'content.form.description' => ['required', 'string'],
                'content.form.name_label' => ['required', 'string', 'max:100'],
                'content.form.email_label' => ['required', 'string', 'max:100'],
                'content.form.topic_label' => ['required', 'string', 'max:100'],
                'content.form.topic_placeholder' => ['required', 'string', 'max:100'],
                'content.form.order_number_label' => ['required', 'string', 'max:100'],
                'content.form.message_label' => ['required', 'string', 'max:100'],
                'content.form.message_placeholder' => ['required', 'string', 'max:255'],
                'content.form.submit_note' => ['required', 'string'],
                'content.form.submit_button_label' => ['required', 'string', 'max:100'],
                'content.form.email_recipient' => ['required', 'email', 'max:255'],
                'content.form.topics' => ['required', 'array', 'size:6'],
                'content.form.topics.*.value' => ['required', 'string', 'max:50'],
                'content.form.topics.*.label' => ['required', 'string', 'max:100'],
                'content.support.kicker' => ['required', 'string', 'max:100'],
                'content.support.title' => ['required', 'string', 'max:255'],
                'content.support.channels' => ['required', 'array', 'size:3'],
                'content.support.channels.*.icon' => ['required', 'string', 'max:50'],
                'content.support.channels.*.title' => ['required', 'string', 'max:100'],
                'content.support.channels.*.value' => ['required', 'string', 'max:255'],
                'content.support.channels.*.detail' => ['required', 'string'],
                'content.support.channels.*.href' => ['required', 'string', 'max:255'],
                'content.faq.kicker' => ['required', 'string', 'max:100'],
                'content.faq.title' => ['required', 'string', 'max:255'],
                'content.faq.description' => ['required', 'string'],
                'content.faq.button_label' => ['required', 'string', 'max:100'],
                'content.visit.kicker' => ['required', 'string', 'max:100'],
                'content.visit.title' => ['required', 'string', 'max:255'],
                'content.visit.description' => ['required', 'string'],
                'content.visit.button_label' => ['required', 'string', 'max:100'],
            ]),
            StorefrontContent::TERMS => $request->validate([
                'key' => ['required', 'in:terms'],
                'content.page_intro.kicker' => ['required', 'string', 'max:100'],
                'content.page_intro.title' => ['required', 'string', 'max:255'],
                'content.page_intro.description' => ['required', 'string'],
                'content.last_updated' => ['required', 'string', 'max:100'],
                'content.last_updated_label' => ['required', 'string', 'max:100'],
                'content.page_summary' => ['required', 'string'],
                'content.tab_labels.terms' => ['required', 'string', 'max:100'],
                'content.tab_labels.privacy' => ['required', 'string', 'max:100'],
                'content.section_kicker' => ['required', 'string', 'max:100'],
                'content.section_title' => ['required', 'string', 'max:255'],
                'content.sections' => ['required', 'array', 'size:3'],
                'content.sections.*.title' => ['required', 'string', 'max:255'],
                'content.sections.*.content' => ['required', 'string'],
                'content.sections.*.points' => ['required', 'array'],
                'content.sections.*.points.*' => ['required', 'string'],
            ]),
            StorefrontContent::PRIVACY => $request->validate([
                'key' => ['required', 'in:privacy'],
                'content.section_kicker' => ['required', 'string', 'max:100'],
                'content.section_title' => ['required', 'string', 'max:255'],
                'content.sections' => ['required', 'array', 'size:2'],
                'content.sections.*.title' => ['required', 'string', 'max:255'],
                'content.sections.*.content' => ['required', 'string'],
                'content.security_title' => ['required', 'string', 'max:255'],
                'content.security_standards' => ['required', 'array', 'size:3'],
                'content.security_standards.*.icon' => ['required', 'string', 'max:50'],
                'content.security_standards.*.title' => ['required', 'string', 'max:255'],
                'content.security_standards.*.content' => ['required', 'string'],
                'content.usage_title' => ['required', 'string', 'max:255'],
                'content.usage_description' => ['required', 'string'],
                'content.usage_highlights' => ['required', 'array', 'size:3'],
                'content.usage_highlights.*.title' => ['required', 'string', 'max:100'],
                'content.usage_highlights.*.content' => ['required', 'string'],
                'content.usage_highlights.*.accent_class' => ['required', 'string', 'max:100'],
            ]),
        };

        StorefrontContent::current($key)->update([
            'content' => $validated['content'],
        ]);

        return back()->with('success', 'Storefront content updated.');
    }

    public function storeCategory(Request $request): RedirectResponse
    {
        $validated = $this->validateCategory($request);

        Category::create([
            ...$validated,
            'slug' => $this->uniqueSlug(Category::class, $validated['name']),
        ]);

        return back()->with('success', 'Category saved.');
    }

    public function updateCategory(Request $request, Category $category): RedirectResponse
    {
        $validated = $this->validateCategory($request);

        $category->update([
            ...$validated,
            'slug' => $this->uniqueSlug(Category::class, $validated['name'], $category->id),
        ]);

        return back()->with('success', 'Category updated.');
    }

    public function destroyCategory(Category $category): RedirectResponse
    {
        $category->delete();

        return back()->with('success', 'Category deleted.');
    }

    public function storeCollection(Request $request): RedirectResponse
    {
        $validated = $this->validateCollection($request);

        Collection::create([
            ...$validated,
            'slug' => $this->uniqueSlug(Collection::class, $validated['name']),
        ]);

        return back()->with('success', 'Collection saved.');
    }

    public function updateCollection(Request $request, Collection $collection): RedirectResponse
    {
        $validated = $this->validateCollection($request);

        $collection->update([
            ...$validated,
            'slug' => $this->uniqueSlug(Collection::class, $validated['name'], $collection->id),
        ]);

        return back()->with('success', 'Collection updated.');
    }

    public function destroyCollection(Collection $collection): RedirectResponse
    {
        $collection->products()->detach();
        $collection->delete();

        return back()->with('success', 'Collection deleted.');
    }

    public function storeBanner(Request $request): RedirectResponse
    {
        $validated = $this->validateBanner($request);

        HeroBanner::create($validated);

        return back()->with('success', 'Banner saved.');
    }

    public function updateBanner(Request $request, HeroBanner $heroBanner): RedirectResponse
    {
        $heroBanner->update($this->validateBanner($request));

        return back()->with('success', 'Banner updated.');
    }

    public function destroyBanner(HeroBanner $heroBanner): RedirectResponse
    {
        $heroBanner->delete();

        return back()->with('success', 'Banner deleted.');
    }

    public function storePromotion(Request $request): RedirectResponse
    {
        $validated = $this->validatePromotion($request);

        Promotion::create([
            ...$validated,
            'starts_at' => now(),
        ]);

        return back()->with('success', 'Promotion saved.');
    }

    public function updatePromotion(Request $request, Promotion $promotion): RedirectResponse
    {
        $promotion->update($this->validatePromotion($request, $promotion));

        return back()->with('success', 'Promotion updated.');
    }

    public function destroyPromotion(Promotion $promotion): RedirectResponse
    {
        $promotion->delete();

        return back()->with('success', 'Promotion deleted.');
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

    public function destroyProduct(Product $product): RedirectResponse
    {
        $product->delete();

        return back()->with('success', 'Product deleted.');
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

    private function validateCategory(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['nullable', 'string', 'max:40'],
        ]);
    }

    private function validateCollection(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'kind' => ['required', 'string', 'max:40'],
            'description' => ['nullable', 'string'],
        ]);
    }

    private function validateBanner(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string'],
            'image_url' => ['required', 'url'],
            'cta_label' => ['nullable', 'string', 'max:100'],
            'cta_href' => ['nullable', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);
    }

    private function validatePromotion(Request $request, ?Promotion $promotion = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:50', Rule::unique('promotions', 'code')->ignore($promotion?->id)],
            'description' => ['nullable', 'string'],
            'discount_type' => ['required', 'string', 'max:20'],
            'discount_value' => ['required', 'numeric', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ]);
    }

    private function uniqueSlug(string $modelClass, string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name) ?: Str::lower(Str::random(6));
        $slug = $baseSlug;
        $counter = 2;

        while ($modelClass::query()
            ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
            ->where('slug', $slug)
            ->exists()) {
            $slug = $baseSlug.'-'.$counter;
            $counter++;
        }

        return $slug;
    }
}
