<?php

use App\Models\Category;
use App\Models\Collection;
use App\Models\HeroBanner;
use App\Models\HomepageContent;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\StoreLocation;
use App\Models\StorefrontContent;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Illuminate\Support\Str;

function createCatalogProduct(string $name, Category $category, array $variant = []): Product
{
    $product = Product::create([
        'category_id' => $category->id,
        'name' => $name,
        'slug' => Str::slug($name),
        'short_description' => 'Sample description for '.$name,
        'description' => 'Detailed description for '.$name,
        'material' => 'Cotton',
        'size_chart' => 'MVP size chart',
        'base_price' => 199000,
        'is_active' => true,
        'is_featured' => true,
        'is_new_arrival' => true,
    ]);

    ProductVariant::create([
        'product_id' => $product->id,
        'sku' => strtoupper(Str::slug($name.'-sku')),
        'color' => $variant['color'] ?? 'White',
        'size' => $variant['size'] ?? 'M',
        'price' => $variant['price'] ?? 199000,
        'stock_on_hand' => $variant['stock_on_hand'] ?? 6,
        'stock_reserved' => $variant['stock_reserved'] ?? 0,
        'weight_grams' => 300,
        'is_active' => true,
    ]);

    ProductImage::create([
        'product_id' => $product->id,
        'url' => 'https://example.com/'.$product->slug.'.jpg',
        'alt' => $name,
        'position' => 1,
        'is_primary' => true,
    ]);

    return $product->fresh(['images', 'variants']);
}

it('renders the storefront home experience with merchandising data', function () {
    $category = Category::create([
        'name' => 'Atasan',
        'slug' => 'atasan',
        'type' => 'tops',
    ]);

    $collection = Collection::create([
        'name' => 'New Arrivals',
        'slug' => 'new-arrivals',
        'kind' => 'new-arrivals',
    ]);

    $product = createCatalogProduct('Studio Shirt', $category);
    $collection->products()->attach($product->id, ['sort_order' => 1]);

    HeroBanner::create([
        'title' => 'Launch Story',
        'subtitle' => 'A sharp first impression for the storefront.',
        'image_url' => 'https://example.com/banner.jpg',
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/Home')
            ->has('banners', 1)
            ->has('categories', 1)
            ->has('featuredProducts', 1)
            ->has('homepageContent')
            ->where('banners.0.title', 'Launch Story'));
});

it('filters the catalog by color and stock availability', function () {
    $category = Category::create([
        'name' => 'Accessories',
        'slug' => 'accessories',
    ]);

    createCatalogProduct('Red Scarf', $category, ['color' => 'Red', 'stock_on_hand' => 5]);
    createCatalogProduct('Blue Scarf', $category, ['color' => 'Blue', 'stock_on_hand' => 0]);

    $this->get(route('shop.index', ['color' => 'Red', 'in_stock' => 1]))
        ->assertOk()
        ->assertSee('Red Scarf')
        ->assertDontSee('Blue Scarf');
});

it('renders storefront information pages', function (string $routeName, string $component) {
    $this->get(route($routeName))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component($component));
})->with([
    ['storefront.about', 'Storefront/About'],
    ['storefront.location', 'Storefront/Location'],
    ['storefront.contact', 'Storefront/ContactUs'],
    ['storefront.terms', 'Storefront/TermsPolicy'],
]);

it('reads admin-created banner content on the storefront home page', function () {
    $staff = User::factory()->create(['role' => 'staff']);

    $this->actingAs($staff)
        ->post(route('admin.banners.store'), [
            'title' => 'CMS Banner',
            'subtitle' => 'Managed from admin',
            'image_url' => 'https://example.com/cms-banner.jpg',
            'cta_label' => 'Explore',
            'cta_href' => '/shop',
            'is_active' => true,
            'sort_order' => 0,
        ])
        ->assertRedirect();

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/Home')
            ->has('banners', 1)
            ->where('banners.0.title', 'CMS Banner'));
});

it('renders saved homepage content on the storefront home page', function () {
    HomepageContent::current()->update([
        'hero' => [
            'primary_cta_label' => 'Discover Now',
            'primary_cta_href' => '/shop?campaign=launch',
            'secondary_cta_label' => 'Browse Drops',
            'secondary_cta_href' => '/collections/new-arrivals',
        ],
        'support_cards' => [
            [
                'title' => 'Always On',
                'description' => 'Weekly edits stay prominent on the homepage.',
            ],
            [
                'title' => 'Pickup Ready',
                'description' => 'Customers can choose delivery or in-store pickup.',
            ],
            [
                'title' => 'Member Access',
                'description' => 'Campaign hooks and account benefits stay visible.',
            ],
        ],
        'editorial' => [
            'kicker' => 'Community Notes',
            'title' => 'Follow the latest COLORBOX stories.',
            'description' => 'Homepage editorial content should reflect the saved CMS record.',
            'cta_label' => '@colorboxstories',
            'cta_href' => 'https://instagram.com/colorboxstories',
        ],
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/Home')
            ->where('homepageContent.hero.primary_cta_label', 'Discover Now')
            ->where('homepageContent.support_cards.0.title', 'Always On')
            ->where('homepageContent.editorial.cta_label', '@colorboxstories'));
});

it('shares seeded storefront shell content with storefront layout pages', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/Home')
            ->where('storefrontShellContent.order_tracking.title', 'Quick order utility')
            ->where('storefrontShellContent.footer.multi_brand_labels.1', 'Lee'));
});

it('renders saved storefront page content from the cms', function () {
    $about = StorefrontContent::content(StorefrontContent::ABOUT);
    $about['hero']['description'] = 'CMS-managed about page copy.';
    StorefrontContent::current(StorefrontContent::ABOUT)->update(['content' => $about]);

    $contact = StorefrontContent::content(StorefrontContent::CONTACT);
    $contact['support']['channels'][0]['value'] = '+62 800-0000-1111';
    StorefrontContent::current(StorefrontContent::CONTACT)->update(['content' => $contact]);

    $terms = StorefrontContent::content(StorefrontContent::TERMS);
    $terms['sections'][0]['title'] = 'CMS terms heading';
    StorefrontContent::current(StorefrontContent::TERMS)->update(['content' => $terms]);

    $privacy = StorefrontContent::content(StorefrontContent::PRIVACY);
    $privacy['usage_highlights'][0]['title'] = 'Customize';
    StorefrontContent::current(StorefrontContent::PRIVACY)->update(['content' => $privacy]);

    $this->get(route('storefront.about'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/About')
            ->where('aboutContent.hero.description', 'CMS-managed about page copy.'));

    $this->get(route('storefront.contact'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/ContactUs')
            ->where('contactContent.support.channels.0.value', '+62 800-0000-1111'));

    $this->get(route('storefront.terms'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/TermsPolicy')
            ->where('termsContent.sections.0.title', 'CMS terms heading')
            ->where('privacyContent.usage_highlights.0.title', 'Customize'));
});

it('reads active admin-managed store locations on the storefront location page', function () {
    $staff = User::factory()->create(['role' => 'staff']);

    $this->actingAs($staff)
        ->post(route('admin.locations.store'), [
            'name' => 'South Jakarta',
            'address' => 'Jl. Metro 1',
            'city' => 'Jakarta',
            'latitude' => -6.2500000,
            'longitude' => 106.8000000,
            'distance' => 7.5,
            'hours' => '10:00-22:00',
            'phone' => '081234567890',
            'services' => 'Pickup, Returns',
            'is_active' => true,
            'sort_order' => 1,
        ])
        ->assertRedirect();

    StoreLocation::create([
        'name' => 'Inactive Location',
        'address' => 'Jl. Hidden 9',
        'city' => 'Bandung',
        'latitude' => -6.9000000,
        'longitude' => 107.6000000,
        'distance' => 15,
        'hours' => '10:00-18:00',
        'phone' => '080000000000',
        'services' => ['Pickup'],
        'is_active' => false,
        'sort_order' => 2,
    ]);

    $this->get(route('storefront.location'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/Location')
            ->has('stores', 1)
            ->where('stores.0.name', 'South Jakarta'));
});
