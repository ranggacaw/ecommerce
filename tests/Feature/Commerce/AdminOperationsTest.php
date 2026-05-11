<?php

use App\Models\Category;
use App\Models\HeroBanner;
use App\Models\HomepageContent;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Promotion;
use App\Models\Shipment;
use App\Models\StoreLocation;
use App\Models\StorefrontContent;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Illuminate\Support\Str;

function createInventoryVariant(): ProductVariant
{
    $category = Category::create([
        'name' => 'Accessories',
        'slug' => 'accessories',
    ]);

    $product = Product::create([
        'category_id' => $category->id,
        'name' => 'Cargo Tote',
        'slug' => 'cargo-tote',
        'base_price' => 249000,
        'is_active' => true,
    ]);

    return ProductVariant::create([
        'product_id' => $product->id,
        'sku' => 'TOTE-'.Str::upper(Str::random(6)),
        'color' => 'Sand',
        'size' => 'One Size',
        'price' => 249000,
        'stock_on_hand' => 3,
        'stock_reserved' => 0,
        'weight_grams' => 250,
        'is_active' => true,
    ]);
}

function createAdminOrder(): Order
{
    $user = User::factory()->create();

    $order = Order::create([
        'number' => 'CBX-ADMIN-'.Str::upper(Str::random(6)),
        'user_id' => $user->id,
        'email' => $user->email,
        'phone' => '081234567890',
        'status' => 'processing',
        'payment_status' => 'paid',
        'fulfillment_status' => 'awaiting_fulfillment',
        'subtotal' => 100000,
        'discount_total' => 0,
        'shipping_total' => 20000,
        'grand_total' => 120000,
        'address_snapshot' => [
            'recipient_name' => $user->name,
            'phone' => '081234567890',
            'line1' => 'Jl. Testing',
            'city' => 'Jakarta',
            'province' => 'DKI Jakarta',
            'postal_code' => '10000',
            'country' => 'Indonesia',
        ],
        'placed_at' => now(),
    ]);

    Shipment::create([
        'order_id' => $order->id,
        'provider' => 'sandbox-logistics',
        'service_name' => 'Regular',
        'tracking_number' => 'CBX-TRACK-'.Str::upper(Str::random(6)),
        'weight_grams' => 300,
        'destination_summary' => 'Jakarta, Indonesia',
        'cost' => 20000,
        'status' => 'ready_to_ship',
    ]);

    return $order;
}

it('blocks standard customers from admin sections', function (string $routeName) {
    $customer = User::factory()->create(['role' => 'customer']);

    $this->actingAs($customer)->get(route($routeName))->assertForbidden();
})->with([
    'dashboard' => 'admin.dashboard',
    'catalog' => 'admin.catalog',
    'merchandising' => 'admin.merchandising',
    'locations' => 'admin.locations',
    'inventory' => 'admin.inventory',
    'orders' => 'admin.orders.index',
]);

it('allows staff to access admin sections', function (string $routeName, string $component) {
    $staff = User::factory()->create(['role' => 'staff']);

    if ($routeName === 'admin.orders.index') {
        createAdminOrder();
    }

    $this->actingAs($staff)
        ->get(route($routeName))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component($component));
})->with([
    'dashboard' => ['admin.dashboard', 'Admin/Dashboard'],
    'catalog' => ['admin.catalog', 'Admin/Catalog'],
    'merchandising' => ['admin.merchandising', 'Admin/Merchandising'],
    'locations' => ['admin.locations', 'Admin/Locations'],
    'inventory' => ['admin.inventory', 'Admin/Inventory'],
    'orders' => ['admin.orders.index', 'Admin/Orders'],
]);

it('allows staff to create catalog taxonomy content', function () {
    $staff = User::factory()->create(['role' => 'staff']);

    $this->actingAs($staff)
        ->post(route('admin.categories.store'), [
            'name' => 'Outerwear',
            'description' => 'Layering pieces',
            'type' => 'jackets',
        ])
        ->assertRedirect();

    $this->actingAs($staff)
        ->post(route('admin.collections.store'), [
            'name' => 'Monsoon Edit',
            'kind' => 'editorial',
            'description' => 'Rain-ready looks',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('categories', [
        'name' => 'Outerwear',
        'slug' => 'outerwear',
    ]);

    $this->assertDatabaseHas('collections', [
        'name' => 'Monsoon Edit',
        'slug' => 'monsoon-edit',
    ]);
});

it('allows staff to create merchandising content', function () {
    $staff = User::factory()->create(['role' => 'staff']);

    $this->actingAs($staff)
        ->post(route('admin.banners.store'), [
            'title' => 'Holiday Launch',
            'subtitle' => 'Fresh visuals for the storefront',
            'image_url' => 'https://example.com/banner.jpg',
            'cta_label' => 'Shop now',
            'cta_href' => '/shop',
            'is_active' => true,
            'sort_order' => 1,
        ])
        ->assertRedirect();

    $this->actingAs($staff)
        ->post(route('admin.promotions.store'), [
            'name' => 'Holiday Savings',
            'code' => 'HOLIDAY10',
            'description' => 'Seasonal markdown',
            'discount_type' => 'percentage',
            'discount_value' => 10,
            'is_active' => true,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('hero_banners', [
        'title' => 'Holiday Launch',
        'image_url' => 'https://example.com/banner.jpg',
    ]);

    $this->assertDatabaseHas('promotions', [
        'name' => 'Holiday Savings',
        'code' => 'HOLIDAY10',
    ]);
});

it('allows staff to update and delete merchandising records', function () {
    $staff = User::factory()->create(['role' => 'staff']);

    $banner = HeroBanner::create([
        'title' => 'Launch Banner',
        'subtitle' => 'Initial subtitle',
        'image_url' => 'https://example.com/launch-banner.jpg',
        'cta_label' => 'Explore',
        'cta_href' => '/shop',
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $promotion = Promotion::create([
        'name' => 'Launch Offer',
        'code' => 'LAUNCH15',
        'description' => 'Initial offer copy',
        'discount_type' => 'percentage',
        'discount_value' => 15,
        'is_active' => true,
        'starts_at' => now(),
    ]);

    $this->actingAs($staff)
        ->patch(route('admin.banners.update', $banner->id), [
            'title' => 'Updated Launch Banner',
            'subtitle' => 'Updated subtitle',
            'image_url' => 'https://example.com/updated-banner.jpg',
            'cta_label' => 'Browse now',
            'cta_href' => '/collections/launch',
            'is_active' => false,
            'sort_order' => 3,
        ])
        ->assertRedirect();

    $this->actingAs($staff)
        ->patch(route('admin.promotions.update', $promotion->id), [
            'name' => 'Updated Launch Offer',
            'code' => 'LAUNCH20',
            'description' => 'Updated offer copy',
            'discount_type' => 'fixed',
            'discount_value' => 20000,
            'is_active' => false,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('hero_banners', [
        'id' => $banner->id,
        'title' => 'Updated Launch Banner',
        'is_active' => false,
        'sort_order' => 3,
    ]);

    $this->assertDatabaseHas('promotions', [
        'id' => $promotion->id,
        'name' => 'Updated Launch Offer',
        'code' => 'LAUNCH20',
        'discount_type' => 'fixed',
        'is_active' => false,
    ]);

    $this->actingAs($staff)
        ->delete(route('admin.banners.destroy', $banner->id))
        ->assertRedirect();

    $this->actingAs($staff)
        ->delete(route('admin.promotions.destroy', $promotion->id))
        ->assertRedirect();

    $this->assertDatabaseMissing('hero_banners', [
        'id' => $banner->id,
    ]);

    $this->assertDatabaseMissing('promotions', [
        'id' => $promotion->id,
    ]);
});

it('allows staff to update homepage content sections', function () {
    $staff = User::factory()->create(['role' => 'staff']);

    $this->actingAs($staff)
        ->patch(route('admin.homepage-content.update'), [
            'section' => 'hero',
            'hero' => [
                'primary_cta_label' => 'Discover Now',
                'primary_cta_href' => '/shop?campaign=launch',
                'secondary_cta_label' => 'Browse Drops',
                'secondary_cta_href' => '/collections/new-arrivals',
            ],
        ])
        ->assertRedirect();

    expect(HomepageContent::current()->hero)->toBe([
        'primary_cta_label' => 'Discover Now',
        'primary_cta_href' => '/shop?campaign=launch',
        'secondary_cta_label' => 'Browse Drops',
        'secondary_cta_href' => '/collections/new-arrivals',
    ]);
});

it('allows staff to update shared storefront shell content', function () {
    $staff = User::factory()->create(['role' => 'staff']);

    $shell = StorefrontContent::content(StorefrontContent::SHELL);
    $shell['order_tracking']['title'] = 'Track every shipment';
    $shell['footer']['brand_description'] = 'Updated footer copy from the merchandising CMS.';

    $this->actingAs($staff)
        ->patch(route('admin.storefront-content.update'), [
            'key' => 'shell',
            'content' => $shell,
        ])
        ->assertRedirect();

    expect(StorefrontContent::content(StorefrontContent::SHELL)['order_tracking']['title'])->toBe('Track every shipment')
        ->and(StorefrontContent::content(StorefrontContent::SHELL)['footer']['brand_description'])->toBe('Updated footer copy from the merchandising CMS.');
});

it('allows staff to update storefront about, contact, and legal content', function () {
    $staff = User::factory()->create(['role' => 'staff']);

    $about = StorefrontContent::content(StorefrontContent::ABOUT);
    $about['hero']['description'] = 'Updated brand story copy.';

    $contact = StorefrontContent::content(StorefrontContent::CONTACT);
    $contact['intro']['title'] = 'Contact the team';
    $contact['form']['email_recipient'] = 'support@colorbox.local';

    $terms = StorefrontContent::content(StorefrontContent::TERMS);
    $terms['last_updated'] = 'May 11, 2026';

    $privacy = StorefrontContent::content(StorefrontContent::PRIVACY);
    $privacy['usage_title'] = 'How customer information supports service';

    $this->actingAs($staff)
        ->patch(route('admin.storefront-content.update'), [
            'key' => 'about',
            'content' => $about,
        ])
        ->assertRedirect();

    $this->actingAs($staff)
        ->patch(route('admin.storefront-content.update'), [
            'key' => 'contact',
            'content' => $contact,
        ])
        ->assertRedirect();

    $this->actingAs($staff)
        ->patch(route('admin.storefront-content.update'), [
            'key' => 'terms',
            'content' => $terms,
        ])
        ->assertRedirect();

    $this->actingAs($staff)
        ->patch(route('admin.storefront-content.update'), [
            'key' => 'privacy',
            'content' => $privacy,
        ])
        ->assertRedirect();

    expect(StorefrontContent::content(StorefrontContent::ABOUT)['hero']['description'])->toBe('Updated brand story copy.')
        ->and(StorefrontContent::content(StorefrontContent::CONTACT)['intro']['title'])->toBe('Contact the team')
        ->and(StorefrontContent::content(StorefrontContent::CONTACT)['form']['email_recipient'])->toBe('support@colorbox.local')
        ->and(StorefrontContent::content(StorefrontContent::TERMS)['last_updated'])->toBe('May 11, 2026')
        ->and(StorefrontContent::content(StorefrontContent::PRIVACY)['usage_title'])->toBe('How customer information supports service');
});

it('allows staff to create and update store locations', function () {
    $staff = User::factory()->create(['role' => 'staff']);

    $this->actingAs($staff)
        ->post(route('admin.locations.store'), [
            'name' => 'Central Flagship',
            'address' => 'Jl. Sudirman 1',
            'city' => 'Jakarta',
            'latitude' => -6.2000000,
            'longitude' => 106.8166667,
            'distance' => 2.5,
            'hours' => '10:00-22:00',
            'phone' => '081111111111',
            'services' => 'Pickup, Tailoring',
            'is_active' => true,
            'sort_order' => 1,
        ])
        ->assertRedirect();

    $location = StoreLocation::query()->firstOrFail();

    $this->actingAs($staff)
        ->patch(route('admin.locations.update', $location->id), [
            'name' => 'Central Flagship Updated',
            'address' => 'Jl. Sudirman 99',
            'city' => 'Jakarta',
            'latitude' => -6.2100000,
            'longitude' => 106.8200000,
            'distance' => 4.0,
            'hours' => '09:00-21:00',
            'phone' => '082222222222',
            'services' => 'Pickup, Alterations',
            'is_active' => false,
            'sort_order' => 3,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('store_locations', [
        'id' => $location->id,
        'name' => 'Central Flagship Updated',
        'address' => 'Jl. Sudirman 99',
        'is_active' => false,
        'sort_order' => 3,
    ]);

    expect($location->fresh()->services)->toBe(['Pickup', 'Alterations']);
});

it('allows staff to create inventory adjustments', function () {
    $staff = User::factory()->create(['role' => 'staff']);
    $variant = createInventoryVariant();

    $this->actingAs($staff)
        ->post(route('admin.inventory.adjustments.store'), [
            'product_variant_id' => $variant->id,
            'type' => 'receipt',
            'source' => 'warehouse',
            'quantity' => 5,
            'notes' => 'Weekly replenishment',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('inventory_adjustments', [
        'product_variant_id' => $variant->id,
        'type' => 'receipt',
        'quantity' => 5,
    ]);

    expect($variant->fresh()->stock_on_hand)->toBe(8);
});
