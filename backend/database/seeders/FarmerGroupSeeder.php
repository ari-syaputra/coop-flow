<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FarmerGroup;

class FarmerGroupSeeder extends Seeder
{
    public function run(): void
    {
        $groups = [
            [
                'name'        => 'Kelompok Tani Makmur Sentosa',
                'description' => 'Kelompok tani utama untuk komoditas padi dan palawija daerah barat.',
            ],
            [
                'name'        => 'Kelompok Tani Tani Mukti',
                'description' => 'Kelompok tani fokus hortikultura sayuran dan buah organik.',
            ],
            [
                'name'        => 'Kelompok Tani Sembada Maju',
                'description' => 'Kelompok tani spesialis hortikultura Depok & Kalasan.',
            ],
        ];

        foreach ($groups as $group) {
            FarmerGroup::firstOrCreate(['name' => $group['name']], $group);
        }
    }
}