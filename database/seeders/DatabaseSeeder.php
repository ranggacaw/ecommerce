<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Collection;
use App\Models\HeroBanner;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Promotion;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@colorbox.test',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Staff User',
            'email' => 'staff@colorbox.test',
            'role' => 'staff',
        ]);

        $customer = User::factory()->create([
            'name' => 'Test Customer',
            'email' => 'test@example.com',
            'role' => 'customer',
        ]);

        $tops = Category::create([
            'name' => 'Atasan',
            'slug' => 'atasan',
            'description' => 'Shirts, blouses, and elevated daily layers.',
            'type' => 'tops',
        ]);

        $bottoms = Category::create([
            'name' => 'Bawahan',
            'slug' => 'bawahan',
            'description' => 'Denim, skirts, and tailored silhouettes.',
            'type' => 'bottoms',
        ]);

        $accessories = Category::create([
            'name' => 'Aksesori',
            'slug' => 'aksesori',
            'description' => 'Bags, scarves, and finishing pieces.',
            'type' => 'accessories',
        ]);

        $newArrivals = Collection::create([
            'name' => 'New Arrivals',
            'slug' => 'new-arrivals',
            'kind' => 'new-arrivals',
            'description' => 'Fresh drops curated for the new season.',
        ]);

        $promoEdit = Collection::create([
            'name' => 'Promo Picks',
            'slug' => 'promo-picks',
            'kind' => 'promo',
            'description' => 'Limited-time highlights with promo pricing.',
        ]);

        $promotion = Promotion::create([
            'name' => 'Season Launch',
            'code' => 'LAUNCH10',
            'description' => 'Ten percent off curated new-season products.',
            'discount_type' => 'percentage',
            'discount_value' => 10,
            'is_active' => true,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addMonth(),
        ]);

        HeroBanner::create([
            'title' => 'The Soft Structure Edit',
            'subtitle' => 'Tailored layers, fluid bottoms, and accessories designed for the monsoon-to-office switch.',
            'image_url' => 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
            'cta_label' => 'Shop the edit',
            'cta_href' => '/collections/new-arrivals',
            'sort_order' => 1,
        ]);

        HeroBanner::create([
            'title' => 'Weekend Transit',
            'subtitle' => 'Lightweight pieces built for movement, layering, and late-evening plans.',
            'image_url' => 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
            'cta_label' => 'Explore accessories',
            'cta_href' => '/categories/aksesori',
            'sort_order' => 2,
        ]);

        $products = [
            [$tops, 'Oversized Poplin Shirt', 'Crisp cotton poplin with a relaxed shoulder line.', 'Cotton poplin', true, false, 329000, ['White', 'Sky'], ['S', 'M', 'L']],
            [$bottoms, 'Pleated Tailored Trousers', 'High-waist trousers with a fluid drape and pressed front pleat.', 'Poly-viscose blend', true, true, 489000, ['Stone', 'Black'], ['M', 'L']],
            [$accessories, 'Textured Everyday Tote', 'Soft structure tote sized for workdays and carry-on transitions.', 'Vegan leather', false, true, 459000, ['Sand', 'Espresso'], ['One Size']],
        ];

        foreach ($products as [$category, $name, $description, $material, $newArrival, $promo, $price, $colors, $sizes]) {
            $product = Product::create([
                'category_id' => $category->id,
                'promotion_id' => $promo ? $promotion->id : null,
                'name' => $name,
                'slug' => Str::slug($name),
                'short_description' => $description,
                'description' => $description.' Designed for flexible styling and clean layering.',
                'material' => $material,
                'size_chart' => 'S: bust 92 cm, M: bust 98 cm, L: bust 104 cm',
                'base_price' => $price,
                'compare_price' => $promo ? $price + 50000 : null,
                'is_active' => true,
                'is_featured' => true,
                'is_new_arrival' => $newArrival,
                'is_promoted' => $promo,
            ]);

            $newArrivals->products()->attach($product->id, ['sort_order' => $product->id]);

            if ($promo) {
                $promoEdit->products()->attach($product->id, ['sort_order' => $product->id]);
            }

            ProductImage::create([
                'product_id' => $product->id,
                'url' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
                'alt' => $name.' front view',
                'position' => 1,
                'is_primary' => true,
            ]);

            ProductImage::create([
                'product_id' => $product->id,
                'url' => 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
                'alt' => $name.' detail view',
                'position' => 2,
            ]);

            foreach ($colors as $color) {
                foreach ($sizes as $size) {
                    ProductVariant::create([
                        'product_id' => $product->id,
                        'sku' => strtoupper(Str::slug($name.'-'.$color.'-'.$size, '-')),
                        'color' => $color,
                        'size' => $size,
                        'price' => $price,
                        'stock_on_hand' => 12,
                        'stock_reserved' => 0,
                        'weight_grams' => 350,
                        'is_active' => true,
                    ]);
                }
            }
        }

        $customer->addresses()->create([
            'label' => 'Home',
            'recipient_name' => $customer->name,
            'phone' => $customer->phone,
            'line1' => 'Jl. Senopati No. 18',
            'city' => 'Jakarta Selatan',
            'province' => 'DKI Jakarta',
            'postal_code' => '12190',
            'country' => 'Indonesia',
            'is_default' => true,
        ]);

        $admin->addresses()->create([
            'label' => 'Office',
            'recipient_name' => $admin->name,
            'phone' => $admin->phone,
            'line1' => 'Jl. Sudirman Kav. 52',
            'city' => 'Jakarta Pusat',
            'province' => 'DKI Jakarta',
            'postal_code' => '10220',
            'country' => 'Indonesia',
            'is_default' => true,
        ]);
    }
}
