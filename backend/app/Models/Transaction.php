<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    protected $fillable = [
        'farmer_id',
        'payment_method',
        'amount_paid'
    ];

    // Relasi ke Petani (User)
    public function farmer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }

    // Relasi ke item pembelian
    public function items(): HasMany
    {
        return $this->hasMany(TransactionItem::class);
    }

    // Relasi ke log ML yang merekam kondisi transaksi ini
    public function mlLogs(): HasMany
    {
        return $this->hasMany(TransactionMlLog::class);
    }
}