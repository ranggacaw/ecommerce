<?php

namespace App\Providers;

use App\Contracts\PaymentGateway;
use App\Contracts\ShippingGateway;
use App\Services\FakePaymentGateway;
use App\Services\TableRateShippingGateway;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(PaymentGateway::class, FakePaymentGateway::class);
        $this->app->singleton(ShippingGateway::class, TableRateShippingGateway::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
