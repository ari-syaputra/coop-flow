<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cooperative;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class CooperativeRegistrationSeeder extends Seeder
{
    public function run(): void
    {
        // Skema pendaftaran tambahan terdistribusi per bulan (Februari - Juli 2026)
        $registrations = [
            // FEBRUARI (5 Bulan lalu)
            [
                'months_ago' => 5,
                'cooperative_name' => 'Koperasi Tani Sleman Barat',
                'code' => 'REG-FEB-001',
                'district' => 'GODEAN',
                'village' => 'SIDOAGUNG',
                'email' => 'reg.godean@coopflow.id',
                'status' => 'ACTIVE',
            ],
            // MARET (4 Bulan lalu)
            [
                'months_ago' => 4,
                'cooperative_name' => 'Koperasi Minggir Prosperous',
                'code' => 'REG-MAR-002',
                'district' => 'MINGGIR',
                'village' => 'SENDANGAGUNG',
                'email' => 'reg.minggir@coopflow.id',
                'status' => 'REJECTED',
                'rejection_reason' => 'Dokumen NIB dan Izin Usaha tidak valid/kedaluwarsa.',
            ],
            // APRIL (3 Bulan lalu)
            [
                'months_ago' => 3,
                'cooperative_name' => 'KUD Mlati Agritama',
                'code' => 'REG-APR-003',
                'district' => 'MLATI',
                'village' => 'SENDANGADI',
                'email' => 'reg.mlati@coopflow.id',
                'status' => 'ACTIVE',
            ],
            // MEI (2 Bulan lalu)
            [
                'months_ago' => 2,
                'cooperative_name' => 'Koperasi Seyegan Subur',
                'code' => 'REG-MEI-004',
                'district' => 'SEYEGAN',
                'village' => 'MARGOKATON',
                'email' => 'reg.seyegan@coopflow.id',
                'status' => 'REJECTED',
                'rejection_reason' => 'Kapasitas gudang belum memenuhi syarat minimal 50 ton.',
            ],
            // JUNI (1 Bulan lalu)
            [
                'months_ago' => 1,
                'cooperative_name' => 'KUD Ngaglik Tani Utama',
                'code' => 'REG-JUN-005',
                'district' => 'NGAGLIK',
                'village' => 'SARDUHARDJO',
                'email' => 'reg.ngaglik@coopflow.id',
                'status' => 'PENDING',
            ],
            // JULI (Bulan Ini)
            [
                'months_ago' => 0,
                'cooperative_name' => 'KUD Pakem Makmur Bersama',
                'code' => 'REG-JUL-006',
                'district' => 'PAKEM',
                'village' => 'PAKEMBINANGUN',
                'email' => 'reg.pakem@coopflow.id',
                'status' => 'PENDING',
            ],
        ];

        foreach ($registrations as $index => $item) {
            $regDate = Carbon::now()->subMonths($item['months_ago'])->startOfMonth()->addDays(rand(2, 24));
            $isActivated = ($item['status'] === 'ACTIVE');

            // 1. Buat Data Induk Koperasi
            $cooperative = Cooperative::create([
                'name'                    => $item['cooperative_name'],
                'cooperative_code'        => $item['code'],
                'nib_cooperative'         => '912000011' . sprintf('%04d', $index + 1),
                'npwp'                    => '02.345.678.9-05' . sprintf('%02d', $index + 1) . '.000',
                'legal_approval_document' => 'cooperatives/legal-documents/sample_legal.pdf',
                'legal_approval_number'   => 'AHU-REG-00' . sprintf('%03d', $index + 1) . '.2026',
                'established_date'        => '2022-05-10',
                'address'                 => 'Jl. Kebon Agung No. ' . ($index + 15),
                'email_cooperative'       => $item['email'],
                'phone_cooperative'       => '0813' . sprintf('%08d', rand(10000000, 99999999)),
                'postal_code'             => '5556' . $index,
                'province'                => 'DAERAH ISTIMEWA YOGYAKARTA',
                'city_koor'               => 'KABUPATEN SLEMAN',
                'district'                => $item['district'],
                'village'                 => $item['village'],
                'warehouse_capacity_ton'  => rand(60, 150),
                'warehouse_surface_area'  => 600,
                'is_activated'            => $isActivated,
                'is_profile_completed'    => true,
                'created_at'              => $regDate,
                'updated_at'              => $regDate,
            ]);

            // 2. Buat Akun Pendaftar
            $user = User::create([
                'name'             => $item['cooperative_name'] . ' Admin',
                'email'            => $item['email'],
                'password'         => Hash::make('password123'),
                'phone'            => '0813' . sprintf('%08d', rand(10000000, 99999999)),
                'cooperative_id'   => $cooperative->id,
                'status'           => $item['status'],
                'rejection_reason' => $item['rejection_reason'] ?? null,
                'province_code'    => 'DAERAH ISTIMEWA YOGYAKARTA',
                'city_code'        => 'KABUPATEN SLEMAN',
                'district_code'    => $item['district'],
                'village_code'     => $item['village'],
                'created_at'       => $regDate,
                'updated_at'       => $regDate,
            ]);

            $user->assignRole('petugas-koperasi');
        }
    }
}