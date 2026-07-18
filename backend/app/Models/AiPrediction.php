<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiPrediction extends Model
{
    use HasFactory;

    /**
     * Atribut yang dapat diisi secara massal (mass assignable).
     */
    protected $fillable = [
        'cooperative_id',
        'fertilizer_id',
        'suggested_procurement_kg',
        'suggested_procurement_bags',
        'status_saran',
        'analysis_meta',
    ];

    protected $casts = [
        'suggested_procurement_kg' => 'float',
        'suggested_procurement_bags' => 'integer',
        'analysis_meta' => 'array', 
    ];

    /**
     * Relasi ke model Cooperative (Koperasi).
     */
    public function cooperative(): BelongsTo
    {
        return $this->belongsTo(Cooperative::class);
    }

    /**
     * Relasi ke model Fertilizer (Pupuk).
     */
    public function fertilizer(): BelongsTo
    {
        return $this->belongsTo(Fertilizer::class);
    }
}