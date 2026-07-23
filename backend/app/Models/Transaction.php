<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    protected $fillable = [
        'transaction_code',
        'invoice_number',
        'farmer_id',
        'payment_method',
        'grand_total',
        'amount_paid',
        'status',
        'payment_details',
    ];

    public function farmer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(TransactionItem::class);
    }

    public function mlLogs(): HasMany
    {
        return $this->hasMany(TransactionMlLog::class);
    }
}