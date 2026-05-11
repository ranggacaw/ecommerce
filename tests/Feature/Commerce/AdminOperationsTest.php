<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Shipment;
use App\Models\StoreLocation;
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
