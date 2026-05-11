<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\Admin\CatalogController as AdminCatalogController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\InventoryController as AdminInventoryController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\StoreLocationController as AdminStoreLocationController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderStatusController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StorefrontController;
use App\Http\Controllers\StorefrontPageController;
use App\Http\Controllers\Webhook\ShipmentStatusController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

Route::get('/', StorefrontController::class)->name('home');
Route::get('/about', [StorefrontPageController::class, 'about'])->name('storefront.about');
Route::get('/location', [StorefrontPageController::class, 'location'])->name('storefront.location');
Route::get('/contact-us', [StorefrontPageController::class, 'contact'])->name('storefront.contact');
Route::get('/terms-and-policy', [StorefrontPageController::class, 'terms'])->name('storefront.terms');
Route::get('/shop', [CatalogController::class, 'index'])->name('shop.index');
Route::get('/categories/{category}', [CatalogController::class, 'category'])->name('categories.show');
Route::get('/collections/{collection}', [CatalogController::class, 'collection'])->name('collections.show');
Route::get('/products/{product}', [CatalogController::class, 'show'])->name('products.show');

Route::get('/bag', [CartController::class, 'index'])->name('cart.index');
Route::post('/bag/items', [CartController::class, 'store'])->name('cart.store');
Route::patch('/bag/items/{cartItem}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/bag/items/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');

Route::get('/orders/{number}', [OrderStatusController::class, 'show'])->name('orders.show-public');

Route::post('/integrations/shipments/status-sync', [ShipmentStatusController::class, 'store'])->name('integrations.shipments.sync');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [AccountController::class, 'dashboard'])->name('dashboard');
    Route::get('/account/addresses', [AccountController::class, 'addresses'])->name('account.addresses');
    Route::get('/account/wishlist', [AccountController::class, 'wishlist'])->name('account.wishlist');

    Route::post('/account/addresses', [AddressController::class, 'store'])->name('account.addresses.store');
    Route::patch('/account/addresses/{address}', [AddressController::class, 'update'])->name('account.addresses.update');
    Route::delete('/account/addresses/{address}', [AddressController::class, 'destroy'])->name('account.addresses.destroy');

    Route::post('/account/wishlist', [WishlistController::class, 'store'])->name('account.wishlist.store');
    Route::delete('/account/wishlist/{wishlistItem}', [WishlistController::class, 'destroy'])->name('account.wishlist.destroy');

    Route::get('/checkout', [CheckoutController::class, 'create'])->name('checkout.create');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::prefix('/admin')
    ->name('admin.')
    ->middleware(['auth', 'role:staff,admin'])
    ->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

        Route::get('/catalog', [AdminCatalogController::class, 'index'])->name('catalog');
        Route::get('/merchandising', [AdminCatalogController::class, 'merchandising'])->name('merchandising');
        Route::patch('/catalog/homepage-content', [AdminCatalogController::class, 'updateHomepageContent'])->name('homepage-content.update');
        Route::post('/catalog/categories', [AdminCatalogController::class, 'storeCategory'])->name('categories.store');
        Route::post('/catalog/collections', [AdminCatalogController::class, 'storeCollection'])->name('collections.store');
        Route::post('/catalog/banners', [AdminCatalogController::class, 'storeBanner'])->name('banners.store');
        Route::post('/catalog/promotions', [AdminCatalogController::class, 'storePromotion'])->name('promotions.store');
        Route::post('/catalog/products', [AdminCatalogController::class, 'storeProduct'])->name('products.store');
        Route::patch('/catalog/products/{product}', [AdminCatalogController::class, 'updateProduct'])->name('products.update');

        Route::get('/store-locations', [AdminStoreLocationController::class, 'index'])->name('locations');
        Route::post('/store-locations', [AdminStoreLocationController::class, 'store'])->name('locations.store');
        Route::patch('/store-locations/{storeLocation}', [AdminStoreLocationController::class, 'update'])->name('locations.update');

        Route::get('/inventory', [AdminInventoryController::class, 'index'])->name('inventory');
        Route::post('/inventory/adjustments', [AdminInventoryController::class, 'store'])->name('inventory.adjustments.store');

        Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
        Route::patch('/orders/{order}', [AdminOrderController::class, 'update'])->name('orders.update');
        Route::get('/orders/{order}/label', [AdminOrderController::class, 'label'])->name('orders.label');
    });

require __DIR__.'/auth.php';
