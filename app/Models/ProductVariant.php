<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'sku',
        'color',
        'size',
        'price',
        'stock_on_hand',
        'stock_reserved',
        'weight_grams',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    protected $appends = ['available_stock', 'display_name'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function adjustments(): HasMany
    {
        return $this->hasMany(InventoryAdjustment::class);
    }

    public function getAvailableStockAttribute(): int
    {
        return max(0, $this->stock_on_hand - $this->stock_reserved);
    }

    public function getDisplayNameAttribute(): string
    {
        return trim($this->color.' / '.$this->size, ' /');
    }
}
