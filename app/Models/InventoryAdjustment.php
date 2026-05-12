<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class InventoryAdjustment extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_variant_id',
        'user_id',
        'type',
        'source',
        'quantity',
        'notes',
        'status',
        'replaces_adjustment_id',
        'voided_by',
        'voided_at',
        'void_reason',
    ];

    protected $casts = [
        'voided_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    public function replacedAdjustment(): BelongsTo
    {
        return $this->belongsTo(self::class, 'replaces_adjustment_id');
    }

    public function replacementAdjustment(): HasOne
    {
        return $this->hasOne(self::class, 'replaces_adjustment_id');
    }

    public function voidedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'voided_by');
    }
}
