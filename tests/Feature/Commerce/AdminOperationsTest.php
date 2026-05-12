<?php

use App\Models\Category;
use App\Models\Collection;
use App\Models\HeroBanner;
use App\Models\HomepageContent;
use App\Models\InventoryAdjustment;
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

it('allows staff to create, update, and delete products', function () {
    $staff = User::factory()->create(['role' => 'staff']);
    $category = Category::create([
        'name' => 'Outerwear',
        'slug' => 'outerwear',
    ]);
    $collection = Collection::create([
        'name' => 'Rain Edit',
        'slug' => 'rain-edit',
        'kind' => 'seasonal',
    ]);
    $promotion = Promotion::create([
        'name' => 'Rain Offer',
        'code' => 'RAIN15',
        'discount_type' => 'percentage',
        'discount_value' => 15,
        'is_active' => true,
    ]);

    $payload = [
        'category_id' => $category->id,
        'promotion_id' => $promotion->id,
        'brand' => 'Colorbox',
        'name' => 'Storm Jacket',
        'short_description' => 'Weather-ready outerwear',
        'description' => 'A full rain shell.',
        'material' => 'Nylon',
        'size_chart' => 'S-XL',
        'price' => 399000,
        'compare_price' => 459000,
        'sku' => 'JACKET-STORM-001',
        'color' => 'Navy',
        'size' => 'M',
        'stock_on_hand' => 7,
        'weight_grams' => 500,
        'primary_image_url' => 'https://example.com/jacket-primary.jpg',
        'secondary_image_url' => 'https://example.com/jacket-secondary.jpg',
        'collection_ids' => [$collection->id],
        'is_active' => true,
    ];

    $this->actingAs($staff)
        ->post(route('admin.products.store'), $payload)
        ->assertRedirect();

    $product = Product::query()->firstOrFail();

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'name' => 'Storm Jacket',
        'category_id' => $category->id,
        'promotion_id' => $promotion->id,
    ]);

    $variant = $product->variants()->firstOrFail();

    $this->actingAs($staff)
        ->patch(route('admin.products.update', $product->slug), [
            ...$payload,
            'name' => 'Storm Jacket Updated',
            'price' => 429000,
            'stock_on_hand' => 9,
            'variant_id' => $variant->id,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'name' => 'Storm Jacket Updated',
        'base_price' => 429000,
    ]);

    $this->actingAs($staff)
        ->delete(route('admin.products.destroy', $product->slug))
        ->assertRedirect();

    $this->assertDatabaseMissing('products', [
        'id' => $product->id,
    ]);
});

it('allows staff to update and delete category and collection records safely', function () {
    $staff = User::factory()->create(['role' => 'staff']);
    $category = Category::create([
        'name' => 'Original Category',
        'slug' => 'original-category',
    ]);
    $collection = Collection::create([
        'name' => 'Original Collection',
        'slug' => 'original-collection',
        'kind' => 'editorial',
    ]);
    $product = Product::create([
        'category_id' => $category->id,
        'name' => 'Assigned Product',
        'slug' => 'assigned-product',
        'base_price' => 129000,
        'is_active' => true,
    ]);
    $product->collections()->attach($collection->id);

    $this->actingAs($staff)
        ->patch(route('admin.categories.update', $category->slug), [
            'name' => 'Updated Category',
            'description' => 'Updated category description',
            'type' => 'featured',
        ])
        ->assertRedirect();

    $category->refresh();

    $this->assertDatabaseHas('categories', [
        'id' => $category->id,
        'name' => 'Updated Category',
        'slug' => 'updated-category',
    ]);

    $this->actingAs($staff)
        ->patch(route('admin.collections.update', $collection->slug), [
            'name' => 'Updated Collection',
            'kind' => 'seasonal',
            'description' => 'Updated collection description',
        ])
        ->assertRedirect();

    $collection->refresh();

    $this->assertDatabaseHas('collections', [
        'id' => $collection->id,
        'name' => 'Updated Collection',
        'slug' => 'updated-collection',
    ]);

    $this->actingAs($staff)
        ->delete(route('admin.categories.destroy', $category->slug))
        ->assertRedirect();

    $this->actingAs($staff)
        ->delete(route('admin.collections.destroy', $collection->slug))
        ->assertRedirect();

    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    $this->assertDatabaseMissing('collections', ['id' => $collection->id]);
    expect($product->fresh()->category_id)->toBeNull();
});

it('rejects invalid catalog taxonomy and location submissions', function () {
    $staff = User::factory()->create(['role' => 'staff']);

    $this->actingAs($staff)
        ->post(route('admin.categories.store'), [
            'name' => '',
            'description' => 'Missing category name',
            'type' => 'test',
        ])
        ->assertSessionHasErrors(['name']);

    $this->actingAs($staff)
        ->post(route('admin.locations.store'), [
            'name' => '',
            'address' => '',
            'city' => '',
            'latitude' => '',
            'longitude' => '',
            'distance' => -1,
            'hours' => '',
            'phone' => '',
            'services' => '',
            'sort_order' => -1,
        ])
        ->assertSessionHasErrors(['name', 'address', 'city', 'latitude', 'longitude', 'distance', 'hours', 'phone', 'sort_order']);
});

it('allows staff to delete store locations', function () {
    $staff = User::factory()->create(['role' => 'staff']);
    $location = StoreLocation::create([
        'name' => 'Delete Me',
        'address' => 'Jl. Example 1',
        'city' => 'Bandung',
        'latitude' => -6.9,
        'longitude' => 107.6,
        'distance' => 5.1,
        'hours' => '10:00-22:00',
        'phone' => '081111111111',
        'services' => ['Pickup'],
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $this->actingAs($staff)
        ->delete(route('admin.locations.destroy', $location->id))
        ->assertRedirect();

    $this->assertDatabaseMissing('store_locations', [
        'id' => $location->id,
    ]);
});

it('supports inventory adjustment edit and void workflows without losing stock integrity', function () {
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

    $adjustment = InventoryAdjustment::query()->firstOrFail();

    $this->actingAs($staff)
        ->patch(route('admin.inventory.adjustments.update', $adjustment->id), [
            'product_variant_id' => $variant->id,
            'type' => 'adjustment',
            'source' => 'correction',
            'quantity' => 2,
            'notes' => 'Corrected count',
        ])
        ->assertRedirect();

    $replacement = InventoryAdjustment::query()->where('status', 'active')->firstOrFail();

    $this->assertDatabaseHas('inventory_adjustments', [
        'id' => $adjustment->id,
        'status' => 'replaced',
    ]);

    $this->assertDatabaseHas('inventory_adjustments', [
        'id' => $replacement->id,
        'status' => 'active',
        'replaces_adjustment_id' => $adjustment->id,
        'quantity' => 2,
    ]);

    expect($variant->fresh()->stock_on_hand)->toBe(5);

    $this->actingAs($staff)
        ->patch(route('admin.inventory.adjustments.void', $replacement->id), [
            'void_reason' => 'Incorrect count after recount',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('inventory_adjustments', [
        'id' => $replacement->id,
        'status' => 'voided',
        'void_reason' => 'Incorrect count after recount',
    ]);

    expect($variant->fresh()->stock_on_hand)->toBe(3);
});

it('rejects inventory adjustments that would move stock below zero', function () {
    $staff = User::factory()->create(['role' => 'staff']);
    $variant = createInventoryVariant();

    $this->actingAs($staff)
        ->post(route('admin.inventory.adjustments.store'), [
            'product_variant_id' => $variant->id,
            'type' => 'adjustment',
            'source' => 'manual',
            'quantity' => -10,
            'notes' => 'Invalid negative adjustment',
        ])
        ->assertSessionHasErrors(['quantity']);
});

it('supports manual order creation, filtering, status updates, cancellation, and archival', function () {
    $staff = User::factory()->create(['role' => 'staff']);
    $variant = createInventoryVariant();

    $this->actingAs($staff)
        ->post(route('admin.orders.store'), [
            'email' => 'manual@colorbox.test',
            'phone' => '081234567890',
            'recipient_name' => 'Manual Customer',
            'line1' => 'Jl. Manual 1',
            'city' => 'Jakarta',
            'province' => 'DKI Jakarta',
            'postal_code' => '10000',
            'country' => 'Indonesia',
            'product_variant_id' => $variant->id,
            'quantity' => 2,
            'payment_method' => 'manual_transfer',
            'payment_status' => 'paid',
            'shipping_service_name' => 'Manual dispatch',
            'shipping_total' => 20000,
            'tracking_number' => 'ADM-TRACK-001',
            'notes' => 'Created by admin',
        ])
        ->assertRedirect();

    $order = Order::query()->latest()->firstOrFail();

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'email' => 'manual@colorbox.test',
        'status' => 'processing',
        'payment_status' => 'paid',
    ]);

    expect($variant->fresh()->stock_reserved)->toBe(2);

    $this->actingAs($staff)
        ->get(route('admin.orders.index', [
            'q' => 'manual@colorbox.test',
            'status' => 'processing',
            'payment_status' => 'paid',
            'fulfillment_status' => 'all',
            'archived' => 'active',
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Orders')
            ->has('orders', 1)
            ->where('orders.0.id', $order->id)
        );

    $this->actingAs($staff)
        ->patch(route('admin.orders.update', $order->id), [
            'status' => 'processing',
            'payment_status' => 'paid',
            'fulfillment_status' => 'shipped',
        ])
        ->assertRedirect();

    expect($variant->fresh()->stock_on_hand)->toBe(1)
        ->and($variant->fresh()->stock_reserved)->toBe(0)
        ->and($order->fresh()->inventory_committed_at)->not->toBeNull();

    $this->actingAs($staff)
        ->patch(route('admin.orders.archive', $order->id))
        ->assertRedirect();

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
    ]);

    expect($order->fresh()->archived_at)->not->toBeNull();

    $cancelVariant = createInventoryVariant();

    $this->actingAs($staff)
        ->post(route('admin.orders.store'), [
            'email' => 'cancel@colorbox.test',
            'phone' => '081298765432',
            'recipient_name' => 'Cancel Customer',
            'line1' => 'Jl. Cancel 2',
            'city' => 'Bandung',
            'province' => 'West Java',
            'postal_code' => '40111',
            'country' => 'Indonesia',
            'product_variant_id' => $cancelVariant->id,
            'quantity' => 1,
            'payment_method' => 'manual_transfer',
            'payment_status' => 'pending',
            'shipping_service_name' => 'Manual dispatch',
            'shipping_total' => 18000,
            'tracking_number' => '',
            'notes' => 'Pending order',
        ])
        ->assertRedirect();

    $pendingOrder = Order::query()->where('email', 'cancel@colorbox.test')->firstOrFail();

    expect($cancelVariant->fresh()->stock_reserved)->toBe(1);

    $this->actingAs($staff)
        ->patch(route('admin.orders.cancel', $pendingOrder->id), [
            'reason' => 'Customer changed mind',
        ])
        ->assertRedirect();

    expect($pendingOrder->fresh()->status)->toBe('cancelled')
        ->and($cancelVariant->fresh()->stock_reserved)->toBe(0);
});

it('rejects invalid manual order submissions', function () {
    $staff = User::factory()->create(['role' => 'staff']);

    $this->actingAs($staff)
        ->post(route('admin.orders.store'), [
            'email' => 'not-an-email',
            'phone' => '',
            'recipient_name' => '',
            'line1' => '',
            'city' => '',
            'province' => '',
            'postal_code' => '',
            'country' => '',
            'product_variant_id' => '',
            'quantity' => 0,
            'payment_method' => '',
            'payment_status' => 'failed',
            'shipping_service_name' => '',
            'shipping_total' => -1,
        ])
        ->assertSessionHasErrors([
            'email',
            'phone',
            'recipient_name',
            'line1',
            'city',
            'province',
            'postal_code',
            'country',
            'product_variant_id',
            'quantity',
            'payment_method',
            'payment_status',
            'shipping_service_name',
            'shipping_total',
        ]);
});

it('applies search and filter workflows across admin sections', function () {
    $staff = User::factory()->create(['role' => 'staff']);
    $variant = createInventoryVariant();
    $banner = HeroBanner::create([
        'title' => 'Merch Search Banner',
        'subtitle' => 'Searchable banner',
        'image_url' => 'https://example.com/banner.jpg',
        'is_active' => true,
        'sort_order' => 1,
    ]);
    Promotion::create([
        'name' => 'Merch Search Promo',
        'code' => 'SEARCH10',
        'discount_type' => 'percentage',
        'discount_value' => 10,
        'is_active' => true,
    ]);
    $location = StoreLocation::create([
        'name' => 'Search Flagship',
        'address' => 'Jl. Search 1',
        'city' => 'Jakarta',
        'latitude' => -6.2,
        'longitude' => 106.8,
        'distance' => 2.2,
        'hours' => '10:00-22:00',
        'phone' => '081111111111',
        'services' => ['Pickup'],
        'is_active' => true,
        'sort_order' => 1,
    ]);
    InventoryAdjustment::create([
        'product_variant_id' => $variant->id,
        'user_id' => $staff->id,
        'type' => 'receipt',
        'source' => 'warehouse',
        'quantity' => 1,
        'notes' => 'Search stock note',
        'status' => 'active',
    ]);
    $order = createAdminOrder();

    $this->actingAs($staff)
        ->get(route('admin.dashboard', ['q' => $order->number]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Dashboard')
            ->has('recentOrders', 1)
            ->where('recentOrders.0.number', $order->number)
        );

    $this->actingAs($staff)
        ->get(route('admin.catalog', ['q' => 'Cargo', 'category' => 'all', 'status' => 'all']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Catalog')
            ->has('products', 1)
            ->where('products.0.name', 'Cargo Tote')
        );

    $this->actingAs($staff)
        ->get(route('admin.merchandising', ['q' => $banner->title]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Merchandising')
            ->has('banners', 1)
            ->where('banners.0.title', $banner->title)
        );

    $this->actingAs($staff)
        ->get(route('admin.locations', ['q' => $location->name, 'status' => 'active']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Locations')
            ->has('locations', 1)
            ->where('locations.0.name', $location->name)
        );

    $this->actingAs($staff)
        ->get(route('admin.inventory', ['q' => 'Search stock note', 'type' => 'receipt', 'status' => 'active']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Inventory')
            ->has('inventoryAdjustments', 1)
            ->where('inventoryAdjustments.0.notes', 'Search stock note')
        );

    $this->actingAs($staff)
        ->get(route('admin.orders.index', ['q' => $order->number, 'status' => 'processing', 'payment_status' => 'paid', 'fulfillment_status' => 'all', 'archived' => 'active']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Orders')
            ->has('orders', 1)
            ->where('orders.0.number', $order->number)
        );
});
