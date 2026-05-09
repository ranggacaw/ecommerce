<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'city',
        'latitude',
        'longitude',
        'distance',
        'hours',
        'phone',
        'services',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'distance' => 'float',
        'services' => 'array',
        'is_active' => 'boolean',
    ];
}
