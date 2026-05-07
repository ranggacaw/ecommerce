<?php

use App\Models\Address;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Support\Str;

function createCheckoutVariant(int $stockOnHand = 4): ProductVariant
{
    $category = Category::create([
        'name' => 'Bottoms',
        'slug' => 'bottoms',
    ]);

    $product = Product::create([
        'category_id' => $category->id,
        'name' => 'Tailored Pant',
        'slug' => 'tailored-pant',
        'short_description' => 'Structured and minimal.',
        'description' => 'A checkout-ready product fixture.',
        'material' => 'Wool blend',
        'size_chart' => 'MVP size chart',
        'base_price' => 399000,
        'is_active' => true,
    ]);

    ProductImage::create([
        'product_id' => $product->id,
        'url' => 'https://example.com/pant.jpg',
        'alt' => $product->name,
        'position' => 1,
        'is_primary' => true,
    ]);

    return ProductVariant::create([
        'product_id' => $product->id,
        'sku' => 'PANT-'.Str::upper(Str::random(6)),
        'color' => 'Black',
        'size' => 'M',
        'price' => 399000,
        'stock_on_hand' => $stockOnHand,
        'stock_reserved' => 0,
        'weight_grams' => 450,
        'is_active' => true,
    ]);
}

function createCustomerAddress(User $user): Address
{
    return $user->addresses()->create([
        'label' => 'Home',
        'recipient_name' => $user->name,
        'phone' => '081234567890',
        'line1' => 'Jl. Melati No. 10',
        'city' => 'Jakarta Selatan',
        'province' => 'DKI Jakarta',
        'postal_code' => '12190',
        'country' => 'Indonesia',
        'is_default' => true,
    ]);
}

it('creates an order, payment, and shipment from checkout', function () {
    $user = User::factory()->create();
    $address = createCustomerAddress($user);
    $variant = createCheckoutVariant(5);

    $this->actingAs($user)
        ->post(route('cart.store'), ['variant_id' => $variant->id, 'quantity' => 2])
        ->assertRedirect();

    $this->actingAs($user)
        ->post(route('checkout.store'), [
            'address_id' => $address->id,
            'shipping_code' => 'regular',
            'payment_method' => 'card',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'payment_status' => 'paid',
    ]);

    $this->assertDatabaseHas('payments', [
        'method' => 'card',
        'status' => 'paid',
    ]);

    $this->assertDatabaseHas('shipments', [
        'service_name' => 'Regular',
    ]);

    expect($variant->fresh()->stock_reserved)->toBe(2);
});

it('rejects checkout when requested quantity exceeds available stock', function () {
    $user = User::factory()->create();
    $address = createCustomerAddress($user);
    $variant = createCheckoutVariant(1);

    $this->actingAs($user)->post(route('cart.store'), [
        'variant_id' => $variant->id,
        'quantity' => 2,
    ]);

    $this->actingAs($user)
        ->from(route('checkout.create'))
        ->post(route('checkout.store'), [
            'address_id' => $address->id,
            'shipping_code' => 'regular',
            'payment_method' => 'card',
        ])
        ->assertRedirect(route('checkout.create'))
        ->assertSessionHasErrors('cart');
});
