<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Collection;
use App\Models\HeroBanner;
use App\Models\InventoryAdjustment;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Promotion;
use App\Models\Shipment;
use App\Models\StoreLocation;
use App\Models\User;
use App\Models\WishlistItem;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        fake()->seed(20260509);

        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@colorbox.test',
            'phone' => '+62 811 1000 0001',
            'role' => 'admin',
        ]);

        $staff = User::factory()->create([
            'name' => 'Staff User',
            'email' => 'staff@colorbox.test',
            'phone' => '+62 811 1000 0002',
            'role' => 'staff',
        ]);

        $customer = User::factory()->create([
            'name' => 'Test Customer',
            'email' => 'test@example.test',
            'phone' => '+62 812 3456 7890',
            'role' => 'customer',
        ]);

        $demoCustomers = User::factory(8)->create();

        $categories = $this->seedCategories();
        $collections = $this->seedCollections();
        $promotions = $this->seedPromotions();

        $this->seedHeroBanners();
        $this->seedStoreLocations();

        $products = $this->seedProducts($categories, $collections, $promotions);

        $this->seedTeamAddresses($admin, $staff);
        $this->seedCustomerAddresses($customer);
        $this->seedDemoCustomerAddresses($demoCustomers);

        $this->seedWishlistsAndActiveCart($customer, $products);
        $this->seedOrders($customer, $demoCustomers, $products);
        $this->seedInventoryAdjustments($products, [$admin, $staff]);
    }

    protected function seedCategories(): array
    {
        return collect([
            [
                'name' => 'Tops',
                'slug' => 'tops',
                'description' => 'Shirts, blouses, knits, and everyday elevated layers.',
                'type' => 'tops',
            ],
            [
                'name' => 'Bottoms',
                'slug' => 'bottoms',
                'description' => 'Trousers, denim, skirts, and polished separates.',
                'type' => 'bottoms',
            ],
            [
                'name' => 'Dresses',
                'slug' => 'dresses',
                'description' => 'Occasion-ready silhouettes and versatile day dresses.',
                'type' => 'dresses',
            ],
            [
                'name' => 'Outerwear',
                'slug' => 'outerwear',
                'description' => 'Light jackets, blazers, and smart layering pieces.',
                'type' => 'outerwear',
            ],
            [
                'name' => 'Accessories',
                'slug' => 'accessories',
                'description' => 'Bags, scarves, belts, and finishing details.',
                'type' => 'accessories',
            ],
            [
                'name' => 'Footwear',
                'slug' => 'footwear',
                'description' => 'Loafers, sandals, sneakers, and event shoes.',
                'type' => 'footwear',
            ],
        ])->mapWithKeys(function (array $attributes): array {
            $category = Category::create($attributes + ['is_active' => true]);

            return [$attributes['type'] => $category];
        })->all();
    }

    protected function seedCollections(): array
    {
        return collect([
            [
                'name' => 'New Arrivals',
                'slug' => 'new-arrivals',
                'kind' => 'new-arrivals',
                'description' => 'Fresh drops curated for the season ahead.',
            ],
            [
                'name' => 'Promo Picks',
                'slug' => 'promo-picks',
                'kind' => 'promo',
                'description' => 'High-appeal styles with active promotional pricing.',
            ],
            [
                'name' => 'Workday Layers',
                'slug' => 'workday-layers',
                'kind' => 'editorial',
                'description' => 'Structured wardrobe pieces that move between commute and office.',
            ],
            [
                'name' => 'Weekend Transit',
                'slug' => 'weekend-transit',
                'kind' => 'editorial',
                'description' => 'Relaxed silhouettes designed for movement and downtime.',
            ],
            [
                'name' => 'Occasion Edit',
                'slug' => 'occasion-edit',
                'kind' => 'editorial',
                'description' => 'Event-ready dresses, heels, and statement layers.',
            ],
            [
                'name' => 'Gift Ready',
                'slug' => 'gift-ready',
                'kind' => 'editorial',
                'description' => 'Accessories and easy-size items that make strong gifting options.',
            ],
        ])->mapWithKeys(function (array $attributes): array {
            $collection = Collection::create($attributes + ['is_active' => true]);

            return [$attributes['slug'] => $collection];
        })->all();
    }

    protected function seedPromotions(): array
    {
        return collect([
            [
                'key' => 'launch',
                'name' => 'Season Launch',
                'code' => 'LAUNCH10',
                'description' => 'Ten percent off selected seasonal arrivals.',
                'discount_type' => 'percentage',
                'discount_value' => 10,
            ],
            [
                'key' => 'workday',
                'name' => 'Workday Edit',
                'code' => 'WORKDAY15',
                'description' => 'Fifteen percent off office-ready tailoring and layers.',
                'discount_type' => 'percentage',
                'discount_value' => 15,
            ],
            [
                'key' => 'bundle',
                'name' => 'Accessory Bundle',
                'code' => 'BUNDLE120',
                'description' => 'Fixed-value savings on selected accessories and footwear.',
                'discount_type' => 'fixed',
                'discount_value' => 120000,
            ],
        ])->mapWithKeys(function (array $attributes): array {
            $promotion = Promotion::create([
                'name' => $attributes['name'],
                'code' => $attributes['code'],
                'description' => $attributes['description'],
                'discount_type' => $attributes['discount_type'],
                'discount_value' => $attributes['discount_value'],
                'is_active' => true,
                'starts_at' => now()->subDays(10),
                'ends_at' => now()->addDays(45),
            ]);

            return [$attributes['key'] => $promotion];
        })->all();
    }

    protected function seedHeroBanners(): void
    {
        $banners = [
            [
                'title' => 'The Soft Structure Edit',
                'subtitle' => 'Tailored layers, fluid bottoms, and grounded neutrals for client-ready daily dressing.',
                'image_url' => 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=80',
                'cta_label' => 'Shop new arrivals',
                'cta_href' => '/collections/new-arrivals',
            ],
            [
                'title' => 'Weekend Transit',
                'subtitle' => 'Travel-light outfits, textured accessories, and easy layers for all-day movement.',
                'image_url' => 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80',
                'cta_label' => 'Browse accessories',
                'cta_href' => '/categories/accessories',
            ],
            [
                'title' => 'Workday Layers',
                'subtitle' => 'Blazers, shirting, and loafers built for presentations, meetings, and post-office plans.',
                'image_url' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80',
                'cta_label' => 'Open the edit',
                'cta_href' => '/collections/workday-layers',
            ],
        ];

        foreach ($banners as $index => $banner) {
            HeroBanner::create($banner + ['sort_order' => $index + 1, 'is_active' => true]);
        }
    }

    protected function seedStoreLocations(): void
    {
        $stores = [
            [
                'name' => 'Grand Indonesia Flagship',
                'address' => 'West Mall, 2nd Floor, Jl. M.H. Thamrin No.1, Jakarta Pusat',
                'city' => 'Jakarta',
                'latitude' => -6.1955000,
                'longitude' => 106.8221000,
                'distance' => 2.4,
                'hours' => '10:00 AM - 10:00 PM',
                'phone' => '+62 21 2358 0001',
                'services' => ['Styling', 'Pickup', 'Gifting'],
            ],
            [
                'name' => 'Senayan City',
                'address' => '3rd Floor, Unit 3-05, Jl. Asia Afrika Lot 19, Jakarta Selatan',
                'city' => 'Jakarta',
                'latitude' => -6.2267000,
                'longitude' => 106.7999000,
                'distance' => 4.1,
                'hours' => '10:00 AM - 10:00 PM',
                'phone' => '+62 21 7278 1000',
                'services' => ['Styling', 'Pickup'],
            ],
            [
                'name' => 'Kota Kasablanka',
                'address' => 'Ground Floor, Unit 88, Jl. Casablanca Raya, Jakarta Selatan',
                'city' => 'Jakarta',
                'latitude' => -6.2269000,
                'longitude' => 106.8406000,
                'distance' => 5.8,
                'hours' => '10:00 AM - 10:00 PM',
                'phone' => '+62 21 2946 5000',
                'services' => ['Pickup', 'Gifting'],
            ],
            [
                'name' => 'Pondok Indah Mall 2',
                'address' => 'Level 1, South Skywalk, Jl. Metro Pondok Indah, Jakarta Selatan',
                'city' => 'Jakarta',
                'latitude' => -6.1912000,
                'longitude' => 106.7837000,
                'distance' => 8.2,
                'hours' => '10:00 AM - 10:00 PM',
                'phone' => '+62 21 7592 0800',
                'services' => ['Styling', 'Pickup', 'Gifting'],
            ],
            [
                'name' => 'Tunjungan Plaza',
                'address' => 'Level 3, Tunjungan Plaza 5, Jl. Embong Malang No.21-31, Surabaya',
                'city' => 'Surabaya',
                'latitude' => -7.2621000,
                'longitude' => 112.7387000,
                'distance' => 11.6,
                'hours' => '10:00 AM - 10:00 PM',
                'phone' => '+62 31 546 2300',
                'services' => ['Styling', 'Pickup'],
            ],
            [
                'name' => 'Paris Van Java',
                'address' => 'Ground Floor, Jl. Sukajadi No.131-139, Bandung',
                'city' => 'Bandung',
                'latitude' => -6.8897000,
                'longitude' => 107.5966000,
                'distance' => 14.7,
                'hours' => '10:00 AM - 10:00 PM',
                'phone' => '+62 22 8200 6300',
                'services' => ['Pickup', 'Alteration'],
            ],
            [
                'name' => 'Beachwalk Bali',
                'address' => 'Level 1, Jl. Pantai Kuta, Kuta, Badung',
                'city' => 'Bali',
                'latitude' => -8.7177000,
                'longitude' => 115.1682000,
                'distance' => 18.2,
                'hours' => '10:00 AM - 11:00 PM',
                'phone' => '+62 361 846 4888',
                'services' => ['Styling', 'Pickup', 'Gifting'],
            ],
            [
                'name' => 'Pakuwon Mall',
                'address' => 'Ground Floor, Jl. Puncak Indah Lontar No.2, Surabaya',
                'city' => 'Surabaya',
                'latitude' => -7.2892000,
                'longitude' => 112.6735000,
                'distance' => 21.5,
                'hours' => '10:00 AM - 10:00 PM',
                'phone' => '+62 31 7393 888',
                'services' => ['Pickup'],
            ],
        ];

        foreach ($stores as $index => $store) {
            StoreLocation::create($store + ['sort_order' => $index + 1, 'is_active' => true]);
        }
    }

    protected function seedProducts(array $categories, array $collections, array $promotions)
    {
        $brands = [
            'Colorbox Studio',
            'Northline',
            'Mora Atelier',
            'Aster Label',
            'Sorelle',
            'Linea',
        ];

        $images = [
            'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
        ];

        $catalog = [
            'tops' => [
                ['name' => 'Oversized Poplin Shirt', 'short' => 'Relaxed tailoring for polished daily wear.', 'material' => 'Crisp cotton poplin', 'price' => 329000, 'colors' => ['White', 'Sky Blue', 'Ink'], 'sizes' => ['S', 'M', 'L'], 'weight' => 320],
                ['name' => 'Ribbed Essential Tank', 'short' => 'A fitted layer that works under blazers and knits.', 'material' => 'Stretch rib jersey', 'price' => 189000, 'colors' => ['Ivory', 'Sand', 'Black'], 'sizes' => ['S', 'M', 'L'], 'weight' => 180],
                ['name' => 'Satin Tie-Neck Blouse', 'short' => 'Soft drape with a refined neckline detail.', 'material' => 'Fluid satin twill', 'price' => 379000, 'colors' => ['Champagne', 'Blush', 'Noir'], 'sizes' => ['S', 'M', 'L'], 'weight' => 250],
                ['name' => 'Knit Polo Cardigan', 'short' => 'An easy bridge between smart and casual dressing.', 'material' => 'Viscose knit blend', 'price' => 359000, 'colors' => ['Oat', 'Terracotta', 'Charcoal'], 'sizes' => ['S', 'M', 'L'], 'weight' => 360],
            ],
            'bottoms' => [
                ['name' => 'Pleated Tailored Trousers', 'short' => 'High-waist tailoring with a clean front drape.', 'material' => 'Poly-viscose suiting', 'price' => 489000, 'colors' => ['Stone', 'Black', 'Moss'], 'sizes' => ['S', 'M', 'L', 'XL'], 'weight' => 420],
                ['name' => 'Relaxed Straight Denim', 'short' => 'Soft structure denim with a modern full-length leg.', 'material' => 'Washed cotton denim', 'price' => 429000, 'colors' => ['Indigo', 'Vintage Blue'], 'sizes' => ['27', '28', '29', '30', '31'], 'weight' => 560],
                ['name' => 'Column Midi Skirt', 'short' => 'Minimal shape with an easy back vent for movement.', 'material' => 'Textured stretch weave', 'price' => 339000, 'colors' => ['Taupe', 'Espresso', 'Black'], 'sizes' => ['S', 'M', 'L'], 'weight' => 310],
                ['name' => 'Linen Blend Shorts', 'short' => 'Warm-weather tailoring with a relaxed waistband fit.', 'material' => 'Linen rayon blend', 'price' => 279000, 'colors' => ['Flax', 'Olive', 'Navy'], 'sizes' => ['S', 'M', 'L'], 'weight' => 240],
            ],
            'dresses' => [
                ['name' => 'Bias Midi Dress', 'short' => 'Clean lines with fluid movement through the hem.', 'material' => 'Silky matte satin', 'price' => 569000, 'colors' => ['Mulberry', 'Champagne', 'Black'], 'sizes' => ['S', 'M', 'L'], 'weight' => 340],
                ['name' => 'Belted Shirt Dress', 'short' => 'Structured enough for meetings, soft enough for weekends.', 'material' => 'Cotton twill blend', 'price' => 529000, 'colors' => ['Khaki', 'Blue Grey', 'White'], 'sizes' => ['S', 'M', 'L'], 'weight' => 390],
                ['name' => 'Smocked Cotton Dress', 'short' => 'Lightweight volume with comfortable day-long wear.', 'material' => 'Textured cotton voile', 'price' => 449000, 'colors' => ['Rose Dust', 'Sage', 'Onyx'], 'sizes' => ['S', 'M', 'L'], 'weight' => 300],
                ['name' => 'Slip Maxi Dress', 'short' => 'An occasion piece that layers easily under outerwear.', 'material' => 'Gloss satin charmeuse', 'price' => 599000, 'colors' => ['Copper', 'Pearl', 'Midnight'], 'sizes' => ['S', 'M', 'L'], 'weight' => 330],
            ],
            'outerwear' => [
                ['name' => 'Cropped Trench Jacket', 'short' => 'A sharp silhouette for humid commutes and sudden rain.', 'material' => 'Water-resistant cotton blend', 'price' => 689000, 'colors' => ['Stone', 'Olive', 'Black'], 'sizes' => ['S', 'M', 'L'], 'weight' => 710],
                ['name' => 'Lightweight Bomber', 'short' => 'Sport-inspired texture with a refined finish.', 'material' => 'Technical nylon', 'price' => 559000, 'colors' => ['Bone', 'Ash', 'Midnight'], 'sizes' => ['S', 'M', 'L'], 'weight' => 530],
                ['name' => 'Structured Blazer', 'short' => 'A core tailoring piece for presentations and dinner plans.', 'material' => 'Stretch suiting', 'price' => 749000, 'colors' => ['Camel', 'Navy', 'Black'], 'sizes' => ['S', 'M', 'L', 'XL'], 'weight' => 680],
                ['name' => 'Quilted Overshirt', 'short' => 'Insulated light outerwear with easy layering proportions.', 'material' => 'Padded recycled nylon', 'price' => 629000, 'colors' => ['Clay', 'Forest', 'Graphite'], 'sizes' => ['S', 'M', 'L'], 'weight' => 760],
            ],
            'accessories' => [
                ['name' => 'Textured Everyday Tote', 'short' => 'Work-ready capacity with a soft structured body.', 'material' => 'Grained vegan leather', 'price' => 459000, 'colors' => ['Sand', 'Espresso', 'Black'], 'sizes' => ['One Size'], 'weight' => 840],
                ['name' => 'Mini Crossbody Bag', 'short' => 'Compact storage sized for evenings and travel.', 'material' => 'Pebbled vegan leather', 'price' => 399000, 'colors' => ['Ivory', 'Chili', 'Black'], 'sizes' => ['One Size'], 'weight' => 420],
                ['name' => 'Silk Blend Scarf', 'short' => 'A styling accent for bags, necklines, and hair.', 'material' => 'Silk modal blend', 'price' => 169000, 'colors' => ['Petal', 'Moss', 'Monochrome'], 'sizes' => ['One Size'], 'weight' => 80],
                ['name' => 'Slim Leather Belt', 'short' => 'A finishing detail that sharpens dresses and tailoring.', 'material' => 'Smooth leather', 'price' => 219000, 'colors' => ['Tan', 'Chocolate', 'Black'], 'sizes' => ['S', 'M', 'L'], 'weight' => 140],
            ],
            'footwear' => [
                ['name' => 'Minimalist Loafers', 'short' => 'Comfort-first slip-ons with a clean square toe.', 'material' => 'Soft faux leather', 'price' => 489000, 'colors' => ['Sand', 'Mahogany', 'Black'], 'sizes' => ['37', '38', '39', '40'], 'weight' => 620],
                ['name' => 'Court Sneakers', 'short' => 'An understated pair built for all-day wear.', 'material' => 'Leather and mesh mix', 'price' => 539000, 'colors' => ['White', 'Grey'], 'sizes' => ['37', '38', '39', '40'], 'weight' => 700],
                ['name' => 'Strappy Sandals', 'short' => 'Open shape for warm-weather styling and events.', 'material' => 'Smooth synthetic leather', 'price' => 429000, 'colors' => ['Gold', 'Tan', 'Black'], 'sizes' => ['36', '37', '38', '39', '40'], 'weight' => 410],
                ['name' => 'Block Heel Mules', 'short' => 'Stable event footwear with a modern slim upper.', 'material' => 'Satin and faux leather', 'price' => 519000, 'colors' => ['Cream', 'Merlot', 'Black'], 'sizes' => ['36', '37', '38', '39', '40'], 'weight' => 470],
            ],
        ];

        $productIndex = 0;

        foreach ($catalog as $categoryKey => $items) {
            foreach ($items as $itemIndex => $item) {
                $promotion = match (true) {
                    $categoryKey === 'accessories' || $categoryKey === 'footwear' => $promotions['bundle'],
                    $itemIndex === 0 || $itemIndex === 2 => $promotions['launch'],
                    default => $promotions['workday'],
                };

                $isPromoted = $productIndex % 2 === 0;
                $isNewArrival = $itemIndex < 2;
                $isFeatured = $productIndex < 8 || $itemIndex === 0;
                $brand = $brands[$productIndex % count($brands)];
                $name = $item['name'];

                $product = Product::create([
                    'category_id' => $categories[$categoryKey]->id,
                    'promotion_id' => $isPromoted ? $promotion->id : null,
                    'brand' => $brand,
                    'name' => $name,
                    'slug' => Str::slug($brand.' '.$name),
                    'short_description' => $item['short'],
                    'description' => $item['short'].' Built for clients who need the storefront to feel fully merchandised, current, and believable.',
                    'material' => $item['material'],
                    'size_chart' => $this->sizeChartFor($categoryKey, $item['sizes']),
                    'base_price' => $item['price'],
                    'compare_price' => $isPromoted ? $item['price'] + 70000 : ($productIndex % 3 === 0 ? $item['price'] + 40000 : null),
                    'is_active' => true,
                    'is_featured' => $isFeatured,
                    'is_new_arrival' => $isNewArrival,
                    'is_promoted' => $isPromoted,
                ]);

                foreach ($this->collectionKeysFor($categoryKey, $itemIndex, $isPromoted) as $collectionKey) {
                    $product->collections()->syncWithoutDetaching([
                        $collections[$collectionKey]->id => ['sort_order' => $productIndex + 1],
                    ]);
                }

                foreach ([0, 1, 2] as $imageOffset) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'url' => $images[($productIndex + ($imageOffset * 3)) % count($images)],
                        'alt' => $name.' image '.($imageOffset + 1),
                        'position' => $imageOffset + 1,
                        'is_primary' => $imageOffset === 0,
                    ]);
                }

                foreach ($item['colors'] as $color) {
                    foreach ($item['sizes'] as $size) {
                        ProductVariant::create([
                            'product_id' => $product->id,
                            'sku' => Str::upper(Str::slug($brand.'-'.$name.'-'.$color.'-'.$size, '-')),
                            'color' => $color,
                            'size' => $size,
                            'price' => $item['price'],
                            'stock_on_hand' => fake()->numberBetween(10, 38),
                            'stock_reserved' => 0,
                            'weight_grams' => $item['weight'],
                            'is_active' => true,
                        ]);
                    }
                }

                $productIndex++;
            }
        }

        return Product::query()->with('variants')->get();
    }

    protected function seedTeamAddresses(User $admin, User $staff): void
    {
        $admin->addresses()->create([
            'label' => 'Head Office',
            'recipient_name' => $admin->name,
            'phone' => $admin->phone,
            'line1' => 'Jl. Jenderal Sudirman Kav. 52-53',
            'city' => 'Jakarta Pusat',
            'province' => 'DKI Jakarta',
            'postal_code' => '10220',
            'country' => 'Indonesia',
            'is_default' => true,
        ]);

        $staff->addresses()->create([
            'label' => 'Warehouse',
            'recipient_name' => $staff->name,
            'phone' => $staff->phone,
            'line1' => 'Jl. Raya Bekasi Km. 22 No. 15',
            'city' => 'Jakarta Timur',
            'province' => 'DKI Jakarta',
            'postal_code' => '13910',
            'country' => 'Indonesia',
            'is_default' => true,
        ]);
    }

    protected function seedCustomerAddresses(User $customer): void
    {
        $addresses = [
            [
                'label' => 'Home',
                'recipient_name' => $customer->name,
                'phone' => $customer->phone,
                'line1' => 'Jl. Senopati No. 18',
                'city' => 'Jakarta Selatan',
                'province' => 'DKI Jakarta',
                'postal_code' => '12190',
                'country' => 'Indonesia',
                'is_default' => true,
            ],
            [
                'label' => 'Office',
                'recipient_name' => $customer->name,
                'phone' => $customer->phone,
                'line1' => 'Jl. HR Rasuna Said Blok X5 No. 8',
                'city' => 'Jakarta Selatan',
                'province' => 'DKI Jakarta',
                'postal_code' => '12940',
                'country' => 'Indonesia',
                'is_default' => false,
            ],
            [
                'label' => 'Parents',
                'recipient_name' => $customer->name,
                'phone' => $customer->phone,
                'line1' => 'Jl. Diponegoro No. 71',
                'city' => 'Bandung',
                'province' => 'Jawa Barat',
                'postal_code' => '40115',
                'country' => 'Indonesia',
                'is_default' => false,
            ],
        ];

        foreach ($addresses as $address) {
            $customer->addresses()->create($address);
        }
    }

    protected function seedDemoCustomerAddresses($customers): void
    {
        $cities = [
            ['city' => 'Surabaya', 'province' => 'Jawa Timur', 'postal_code' => '60261', 'street' => 'Jl. Dharmahusada Indah'],
            ['city' => 'Bandung', 'province' => 'Jawa Barat', 'postal_code' => '40132', 'street' => 'Jl. Ciumbuleuit'],
            ['city' => 'Yogyakarta', 'province' => 'DI Yogyakarta', 'postal_code' => '55281', 'street' => 'Jl. Kaliurang'],
            ['city' => 'Denpasar', 'province' => 'Bali', 'postal_code' => '80227', 'street' => 'Jl. Teuku Umar'],
            ['city' => 'Semarang', 'province' => 'Jawa Tengah', 'postal_code' => '50241', 'street' => 'Jl. Pandanaran'],
            ['city' => 'Medan', 'province' => 'Sumatera Utara', 'postal_code' => '20111', 'street' => 'Jl. Setia Budi'],
            ['city' => 'Makassar', 'province' => 'Sulawesi Selatan', 'postal_code' => '90111', 'street' => 'Jl. Haji Bau'],
            ['city' => 'Malang', 'province' => 'Jawa Timur', 'postal_code' => '65119', 'street' => 'Jl. Ijen'],
        ];

        foreach ($customers as $index => $customer) {
            $city = $cities[$index % count($cities)];

            $customer->addresses()->create([
                'label' => 'Home',
                'recipient_name' => $customer->name,
                'phone' => $customer->phone,
                'line1' => $city['street'].' No. '.fake()->numberBetween(8, 188),
                'city' => $city['city'],
                'province' => $city['province'],
                'postal_code' => $city['postal_code'],
                'country' => 'Indonesia',
                'is_default' => true,
            ]);
        }
    }

    protected function seedWishlistsAndActiveCart(User $customer, $products): void
    {
        foreach ($products->shuffle()->take(6) as $product) {
            WishlistItem::create([
                'user_id' => $customer->id,
                'product_id' => $product->id,
            ]);
        }

        $cart = Cart::create([
            'user_id' => $customer->id,
            'cart_token' => (string) Str::uuid(),
            'status' => 'active',
        ]);

        foreach ($products->shuffle()->take(3) as $product) {
            $variant = $product->variants->random();

            CartItem::create([
                'cart_id' => $cart->id,
                'product_variant_id' => $variant->id,
                'quantity' => fake()->numberBetween(1, 2),
                'unit_price' => $variant->price,
            ]);
        }
    }

    protected function seedOrders(User $customer, $demoCustomers, $products): void
    {
        $variants = ProductVariant::query()->with('product')->get();
        $orderNumber = 1001;

        $customerStates = [
            ['days_ago' => 120, 'status' => 'completed', 'payment_status' => 'paid', 'fulfillment_status' => 'delivered', 'payment_method' => 'bank_transfer', 'inventory' => 'committed'],
            ['days_ago' => 95, 'status' => 'completed', 'payment_status' => 'paid', 'fulfillment_status' => 'delivered', 'payment_method' => 'credit_card', 'inventory' => 'committed'],
            ['days_ago' => 70, 'status' => 'completed', 'payment_status' => 'paid', 'fulfillment_status' => 'shipped', 'payment_method' => 'qris', 'inventory' => 'committed'],
            ['days_ago' => 42, 'status' => 'processing', 'payment_status' => 'paid', 'fulfillment_status' => 'ready_to_ship', 'payment_method' => 'virtual_account', 'inventory' => 'reserved'],
            ['days_ago' => 28, 'status' => 'processing', 'payment_status' => 'paid', 'fulfillment_status' => 'awaiting_fulfillment', 'payment_method' => 'ewallet', 'inventory' => 'reserved'],
            ['days_ago' => 14, 'status' => 'pending', 'payment_status' => 'pending', 'fulfillment_status' => 'awaiting_fulfillment', 'payment_method' => 'credit_card', 'inventory' => 'reserved'],
            ['days_ago' => 7, 'status' => 'cancelled', 'payment_status' => 'refunded', 'fulfillment_status' => 'cancelled', 'payment_method' => 'bank_transfer', 'inventory' => null],
            ['days_ago' => 3, 'status' => 'processing', 'payment_status' => 'paid', 'fulfillment_status' => 'shipped', 'payment_method' => 'credit_card', 'inventory' => 'committed'],
        ];

        foreach ($customerStates as $state) {
            $address = $customer->addresses()->inRandomOrder()->first();
            $itemVariants = $variants->shuffle()->take(fake()->numberBetween(1, 3));

            $this->createOrder(
                $customer,
                $address,
                $itemVariants,
                $state,
                'CBX-DEMO-'.$orderNumber,
            );

            $orderNumber++;
        }

        foreach ($demoCustomers as $index => $demoCustomer) {
            $orderCount = $index % 3 === 0 ? 2 : 1;

            for ($iteration = 0; $iteration < $orderCount; $iteration++) {
                $state = [
                    'days_ago' => fake()->numberBetween(2, 90),
                    'status' => $iteration === 0 ? 'completed' : 'processing',
                    'payment_status' => 'paid',
                    'fulfillment_status' => $iteration === 0 ? 'delivered' : 'ready_to_ship',
                    'payment_method' => fake()->randomElement(['credit_card', 'bank_transfer', 'virtual_account', 'qris']),
                    'inventory' => $iteration === 0 ? 'committed' : 'reserved',
                ];

                $this->createOrder(
                    $demoCustomer,
                    $demoCustomer->addresses()->first(),
                    $variants->shuffle()->take(fake()->numberBetween(1, 4)),
                    $state,
                    'CBX-DEMO-'.$orderNumber,
                );

                $orderNumber++;
            }
        }

        foreach ($products->shuffle()->take(5) as $product) {
            WishlistItem::firstOrCreate([
                'user_id' => $demoCustomers->random()->id,
                'product_id' => $product->id,
            ]);
        }
    }

    protected function createOrder(User $user, $address, $itemVariants, array $state, string $number): void
    {
        $placedAt = now()->subDays($state['days_ago']);
        $shippingTotal = fake()->randomElement([18000, 22000, 28000, 35000]);
        $lineItems = [];
        $subtotal = 0;
        $totalWeight = 0;

        foreach ($itemVariants as $variant) {
            $quantity = fake()->numberBetween(1, 3);
            $lineTotal = $quantity * (float) $variant->price;

            $lineItems[] = [
                'variant' => $variant,
                'quantity' => $quantity,
                'line_total' => $lineTotal,
            ];

            $subtotal += $lineTotal;
            $totalWeight += $quantity * $variant->weight_grams;
        }

        $discountTotal = $state['payment_status'] === 'paid' && fake()->boolean(35)
            ? min(60000, (int) round($subtotal * 0.1))
            : 0;

        $order = Order::create([
            'number' => $number,
            'user_id' => $user->id,
            'email' => $user->email,
            'phone' => $address->phone,
            'status' => $state['status'],
            'payment_status' => $state['payment_status'],
            'fulfillment_status' => $state['fulfillment_status'],
            'subtotal' => $subtotal,
            'discount_total' => $discountTotal,
            'shipping_total' => $shippingTotal,
            'grand_total' => max(0, $subtotal - $discountTotal + $shippingTotal),
            'address_snapshot' => $address->toShipmentArray(),
            'notes' => 'Demo order seeded for storefront and admin review.',
            'placed_at' => $placedAt,
            'inventory_committed_at' => $state['inventory'] === 'committed' ? $placedAt->copy()->addDay() : null,
        ]);

        foreach ($lineItems as $lineItem) {
            $variant = $lineItem['variant'];

            OrderItem::create([
                'order_id' => $order->id,
                'product_variant_id' => $variant->id,
                'product_name' => $variant->product->name,
                'variant_name' => $variant->display_name,
                'sku' => $variant->sku,
                'quantity' => $lineItem['quantity'],
                'unit_price' => $variant->price,
                'total_price' => $lineItem['line_total'],
                'metadata' => [
                    'brand' => $variant->product->brand,
                    'material' => $variant->product->material,
                ],
            ]);

            if ($state['inventory'] === 'committed') {
                $liveVariant = ProductVariant::query()->find($variant->id);

                if ($liveVariant) {
                    $liveVariant->update([
                        'stock_on_hand' => max(0, $liveVariant->stock_on_hand - $lineItem['quantity']),
                    ]);
                }
            }

            if ($state['inventory'] === 'reserved') {
                ProductVariant::query()
                    ->whereKey($variant->id)
                    ->increment('stock_reserved', $lineItem['quantity']);
            }
        }

        Payment::create([
            'order_id' => $order->id,
            'provider' => 'Colorbox Demo Gateway',
            'method' => $state['payment_method'],
            'external_reference' => 'PAY-'.$number,
            'amount' => $order->grand_total,
            'status' => $state['payment_status'],
            'payload' => [
                'seeded' => true,
                'channel' => $state['payment_method'],
            ],
            'paid_at' => $state['payment_status'] === 'paid' ? $placedAt->copy()->addHours(2) : null,
        ]);

        Shipment::create([
            'order_id' => $order->id,
            'provider' => 'Colorbox Logistics',
            'service_name' => fake()->randomElement(['Regular', 'Next Day', 'Same Day']),
            'tracking_number' => 'CBXTRK'.fake()->unique()->numerify('######'),
            'weight_grams' => $totalWeight,
            'destination_summary' => implode(', ', array_filter([$address->city, $address->province, $address->country])),
            'cost' => $shippingTotal,
            'status' => $this->shipmentStatusFor($state['fulfillment_status']),
            'label_url' => 'https://example.test/labels/'.$number,
            'payload' => ['seeded' => true],
            'shipped_at' => in_array($state['fulfillment_status'], ['shipped', 'delivered'], true) ? $placedAt->copy()->addDay() : null,
            'delivered_at' => $state['fulfillment_status'] === 'delivered' ? $placedAt->copy()->addDays(3) : null,
        ]);
    }

    protected function seedInventoryAdjustments($products, array $teamMembers): void
    {
        $templates = [
            ['type' => 'restock', 'source' => 'purchase-order', 'quantity' => 18, 'notes' => 'Weekly replenishment received.'],
            ['type' => 'restock', 'source' => 'manual-count', 'quantity' => 7, 'notes' => 'Stock found during cycle count.'],
            ['type' => 'damage', 'source' => 'warehouse-audit', 'quantity' => -2, 'notes' => 'Packaging damage during handling.'],
            ['type' => 'sample', 'source' => 'client-showcase', 'quantity' => -1, 'notes' => 'Allocated for demo styling set.'],
        ];

        $variants = $products->flatMap(fn ($product) => $product->variants)->shuffle()->take(18);

        foreach ($variants as $index => $variant) {
            $template = $templates[$index % count($templates)];
            $quantity = $template['quantity'] < 0
                ? -min($variant->stock_on_hand, abs($template['quantity']))
                : $template['quantity'];

            if ($quantity === 0) {
                continue;
            }

            $variant->update([
                'stock_on_hand' => max(0, $variant->stock_on_hand + $quantity),
            ]);

            InventoryAdjustment::create([
                'product_variant_id' => $variant->id,
                'user_id' => $teamMembers[$index % count($teamMembers)]->id,
                'type' => $template['type'],
                'source' => $template['source'],
                'quantity' => $quantity,
                'notes' => $template['notes'],
                'created_at' => now()->subDays($index + 1),
                'updated_at' => now()->subDays($index + 1),
            ]);
        }
    }

    protected function collectionKeysFor(string $categoryKey, int $itemIndex, bool $isPromoted): array
    {
        $collectionKeys = [$itemIndex < 2 ? 'new-arrivals' : 'weekend-transit'];

        if (in_array($categoryKey, ['tops', 'bottoms', 'outerwear'], true)) {
            $collectionKeys[] = 'workday-layers';
        }

        if (in_array($categoryKey, ['dresses', 'footwear'], true)) {
            $collectionKeys[] = 'occasion-edit';
        }

        if (in_array($categoryKey, ['accessories', 'footwear'], true)) {
            $collectionKeys[] = 'gift-ready';
        }

        if ($isPromoted) {
            $collectionKeys[] = 'promo-picks';
        }

        return array_values(array_unique($collectionKeys));
    }

    protected function sizeChartFor(string $categoryKey, array $sizes): ?string
    {
        if ($sizes === ['One Size']) {
            return 'One size fits most. Refer to product measurements for drop length and strap dimensions.';
        }

        if ($categoryKey === 'footwear') {
            return 'Footwear runs true to size. If you are between sizes, take the next size up.';
        }

        return implode(PHP_EOL, array_map(
            fn (string $size, int $index): string => $size.': '.(88 + ($index * 6)).'-'.(92 + ($index * 6)).' cm bust / '.(68 + ($index * 4)).'-'.(72 + ($index * 4)).' cm waist',
            $sizes,
            array_keys($sizes),
        ));
    }

    protected function shipmentStatusFor(string $fulfillmentStatus): string
    {
        return match ($fulfillmentStatus) {
            'delivered' => 'delivered',
            'shipped' => 'in_transit',
            'cancelled' => 'cancelled',
            default => 'ready_to_ship',
        };
    }
}
