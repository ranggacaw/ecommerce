<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
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

it('blocks standard customers from the admin dashboard', function () {
    $customer = User::factory()->create(['role' => 'customer']);

    $this->actingAs($customer)->get(route('admin.dashboard'))->assertForbidden();
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
