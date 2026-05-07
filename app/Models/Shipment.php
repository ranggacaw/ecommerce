<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Shipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'provider',
        'service_name',
        'tracking_number',
        'weight_grams',
        'destination_summary',
        'cost',
        'status',
        'label_url',
        'payload',
        'shipped_at',
        'delivered_at',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
        'payload' => 'array',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
