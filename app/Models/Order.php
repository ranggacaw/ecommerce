<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'number',
        'user_id',
        'email',
        'phone',
        'status',
        'payment_status',
        'fulfillment_status',
        'subtotal',
        'discount_total',
        'shipping_total',
        'grand_total',
        'address_snapshot',
        'notes',
        'placed_at',
        'inventory_committed_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount_total' => 'decimal:2',
        'shipping_total' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'address_snapshot' => 'array',
        'placed_at' => 'datetime',
        'inventory_committed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function shipments(): HasMany
    {
        return $this->hasMany(Shipment::class);
    }

    public function getShippingNameAttribute(): string
    {
        return $this->address_snapshot['recipient_name'] ?? '';
    }

    public function getShippingAddressAttribute(): string
    {
        return $this->address_snapshot['line1'] ?? '';
    }

    public function getShippingCityAttribute(): string
    {
        return $this->address_snapshot['city'] ?? '';
    }

    public function getShippingPostalCodeAttribute(): string
    {
        return $this->address_snapshot['postal_code'] ?? '';
    }

    public function getTaxTotalAttribute(): float
    {
        return max(0, (float) $this->grand_total - (float) $this->subtotal - (float) $this->shipping_total + (float) $this->discount_total);
    }
}
