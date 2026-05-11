<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomepageContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'hero',
        'support_cards',
        'flash_sale',
        'category_discovery',
        'new_arrivals',
        'editorial',
        'featured_products',
    ];

    protected $casts = [
        'hero' => 'array',
        'support_cards' => 'array',
        'flash_sale' => 'array',
        'category_discovery' => 'array',
        'new_arrivals' => 'array',
        'editorial' => 'array',
        'featured_products' => 'array',
    ];

    public static function current(): self
    {
        return self::query()->firstOrCreate(
            ['key' => 'home'],
            self::defaults(),
        );
    }

    public static function defaults(): array
    {
        return [
            'key' => 'home',
            'hero' => [
                'primary_cta_label' => 'Shop Now',
                'primary_cta_href' => '/shop',
                'secondary_cta_label' => 'Explore All',
                'secondary_cta_href' => '/collections/new-arrivals',
            ],
            'support_cards' => [
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
            ],
            'flash_sale' => [
                'badge_label' => 'Flash Sale',
                'hours_label' => 'Hours',
                'minutes_label' => 'Mins',
                'seconds_label' => 'Secs',
                'highlight_label' => 'Limited-time pricing',
            ],
            'category_discovery' => [
                'kicker' => 'Shop by Category',
                'title' => 'Asymmetric discovery',
                'link_label' => 'View all products',
                'tile_primary_prefix' => 'The New Uniform:',
                'tile_cta_label' => 'Lihat Koleksi',
            ],
            'new_arrivals' => [
                'title' => 'Fresh silhouettes for this week',
                'link_label' => 'Open collection',
            ],
            'editorial' => [
                'kicker' => 'Editorial / Community',
                'title' => 'Follow the COLORBOX feed.',
                'description' => 'The social block becomes a real brand moment, not just a leftover gallery at the bottom of the page.',
                'cta_label' => '@colorbox',
                'cta_href' => 'https://instagram.com',
            ],
            'featured_products' => [
                'kicker' => 'Trending',
                'title' => 'Storefront bestsellers',
                'link_label' => 'View all products',
            ],
        ];
    }
}
