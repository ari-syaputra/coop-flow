<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransactionMlLog extends Model
{
    protected $fillable = [
        'transaction_id',
        'land_id',
        'fertilizer_id',
        'luas_lahan_hektar',
        'jenis_komoditas',
        'fase_tanam_saat_ini',
        'suhu_rata_rata_celcius',
        'kelembapan_persen',
        'curah_hujan_mm',
        'original_recommended_kg',
        'actual_purchased_kg'
    ];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function land(): BelongsTo
    {
        return $this->belongsTo(Land::class);
    }

    public function fertilizer(): BelongsTo
    {
        return $this->belongsTo(Fertilizer::class);
    }
}