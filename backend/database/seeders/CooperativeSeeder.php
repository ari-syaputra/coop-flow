<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cooperative;

class CooperativeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cooperatives = [
            // 1. Koperasi Default Godean
            [
                'email_cooperative'    => 'koperasi@coopflow.id',
                'name'                 => 'Koperasi Unit Desa (KUD) Makmur Sejahtera',
                'cooperative_code'     => 'KOP-DEFAULT-001',
                'nib_cooperative'      => '1234567890',
                'phone_cooperative'    => '081234567891',
                'address'              => 'SIDOMULYO RT 05',
                'province'             => 'DAERAH ISTIMEWA YOGYAKARTA',
                'city_koor'            => 'KABUPATEN SLEMAN',
                'district'             => 'GODEAN',
                'village'              => 'SIDOMULYO',
                'is_activated'         => true,
                'is_profile_completed' => true,
            ],
            // 2. Koperasi di Kecamatan Depok
            [
                'email_cooperative'    => 'koperasi.depok@coopflow.id',
                'name'                 => 'Koperasi Tani Sembada Depok',
                'cooperative_code'     => 'KOP-DEPOK-002',
                'nib_cooperative'      => '1234567891',
                'phone_cooperative'    => '081234567892',
                'address'              => 'JL. RING ROAD UTARA NO. 12',
                'province'             => 'DAERAH ISTIMEWA YOGYAKARTA',
                'city_koor'            => 'KABUPATEN SLEMAN',
                'district'             => 'DEPOK',
                'village'              => 'CATURTUNGGAL',
                'is_activated'         => true,
                'is_profile_completed' => true,
            ],
            // 3. Koperasi di Kecamatan Tempel
            [
                'email_cooperative'    => 'koperasi.tempel@coopflow.id',
                'name'                 => 'Koperasi Tani Subur Tempel',
                'cooperative_code'     => 'KOP-TEMPEL-003',
                'nib_cooperative'      => '1234567892',
                'phone_cooperative'    => '081234567893',
                'address'              => 'JL. MAGELANG KM 17',
                'province'             => 'DAERAH ISTIMEWA YOGYAKARTA',
                'city_koor'            => 'KABUPATEN SLEMAN',
                'district'             => 'TEMPEL',
                'village'              => 'LUMBUNGREJO',
                'is_activated'         => true,
                'is_profile_completed' => true,
            ],
            // 4. Koperasi di Kecamatan Prambanan
            [
                'email_cooperative'    => 'koperasi.prambanan@coopflow.id',
                'name'                 => 'Koperasi Tani Manunggal Prambanan',
                'cooperative_code'     => 'KOP-PRAMBANAN-004',
                'nib_cooperative'      => '1234567893',
                'phone_cooperative'    => '081234567894',
                'address'              => 'JL. SOLO KM 14',
                'province'             => 'DAERAH ISTIMEWA YOGYAKARTA',
                'city_koor'            => 'KABUPATEN SLEMAN',
                'district'             => 'PRAMBANAN',
                'village'              => 'BOKOHARJO',
                'is_activated'         => true,
                'is_profile_completed' => true,
            ],
            // 5. Koperasi di Kecamatan Kalasan
            [
                'email_cooperative'    => 'koperasi.kalasan@coopflow.id',
                'name'                 => 'Koperasi Tani Sejahtera Kalasan',
                'cooperative_code'     => 'KOP-KALASAN-005',
                'nib_cooperative'      => '1234567894',
                'phone_cooperative'    => '081234567895',
                'address'              => 'JL. JOGJA-SOLO KM 11',
                'province'             => 'DAERAH ISTIMEWA YOGYAKARTA',
                'city_koor'            => 'KABUPATEN SLEMAN',
                'district'             => 'KALASAN',
                'village'              => 'TIRTOMARTANI',
                'is_activated'         => true,
                'is_profile_completed' => true,
            ],
        ];

        foreach ($cooperatives as $coopData) {
            Cooperative::firstOrCreate(
                ['email_cooperative' => $coopData['email_cooperative']],
                $coopData
            );
        }
    }
}