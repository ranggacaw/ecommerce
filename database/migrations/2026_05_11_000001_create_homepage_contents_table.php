<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('homepage_contents', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('hero');
            $table->json('support_cards');
            $table->json('flash_sale');
            $table->json('category_discovery');
            $table->json('new_arrivals');
            $table->json('editorial');
            $table->json('featured_products');
            $table->timestamps();
        });

        DB::table('homepage_contents')->insert([
            'key' => 'home',
            'hero' => json_encode([
                'primary_cta_label' => 'Shop Now',
                'primary_cta_href' => '/shop',
                'secondary_cta_label' => 'Explore All',
                'secondary_cta_href' => '/collections/new-arrivals',
            ], JSON_THROW_ON_ERROR),
            'support_cards' => json_encode([
                [
                    'title' => 'New In Weekly',
                    'description' => 'Rotating drops and curated edits get their own lane beneath the hero instead of competing above the fold.',
                ],
                [
                    'title' => 'Delivery & Pickup',
                    'description' => 'Short, useful reassurance replaces scattered utility content throughout the homepage.',
                ],
                [
                    'title' => 'Member Perks',
                    'description' => 'Wishlist, account, and campaign hooks still surface without overcrowding the hero.',
                ],
            ], JSON_THROW_ON_ERROR),
            'flash_sale' => json_encode([
                'badge_label' => 'Flash Sale',
                'hours_label' => 'Hours',
                'minutes_label' => 'Mins',
                'seconds_label' => 'Secs',
                'highlight_label' => 'Limited-time pricing',
            ], JSON_THROW_ON_ERROR),
            'category_discovery' => json_encode([
                'kicker' => 'Shop by Category',
                'title' => 'Asymmetric discovery',
                'link_label' => 'View all products',
                'tile_primary_prefix' => 'The New Uniform:',
                'tile_cta_label' => 'Lihat Koleksi',
            ], JSON_THROW_ON_ERROR),
            'new_arrivals' => json_encode([
                'title' => 'Fresh silhouettes for this week',
                'link_label' => 'Open collection',
            ], JSON_THROW_ON_ERROR),
            'editorial' => json_encode([
                'kicker' => 'Editorial / Community',
                'title' => 'Follow the COLORBOX feed.',
                'description' => 'The social block becomes a real brand moment, not just a leftover gallery at the bottom of the page.',
                'cta_label' => '@colorbox',
                'cta_href' => 'https://instagram.com',
            ], JSON_THROW_ON_ERROR),
            'featured_products' => json_encode([
                'kicker' => 'Trending',
                'title' => 'Storefront bestsellers',
                'link_label' => 'View all products',
            ], JSON_THROW_ON_ERROR),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('homepage_contents');
    }
};
