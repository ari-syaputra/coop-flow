<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Fertilizer extends Model
{
    protected $fillable = [
        'fertilizer_code', 
        'warehouse_id', 
        'name', 
        'image',
        'packaging_size_kg', 
        'current_stock_kg', 
        'minimum_stock_kg', 
        'price_per_kg', 
        'status'
    ];

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function mutations(): HasMany
    {
        return $this->hasMany(InventoryMutation::class);
    }
}