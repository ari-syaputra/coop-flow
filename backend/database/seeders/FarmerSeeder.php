<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Farmer;
use App\Models\Cooperative;
use App\Models\FarmerGroup;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class FarmerSeeder extends Seeder
{
    public function run(): void
    {
        $rolePetani = Role::firstOrCreate(['name' => 'petani', 'guard_name' => 'api']);
        $faker = Faker::create('id_ID'); // Menggunakan nama lokal Indonesia

        // Ambil Koperasi Default & Koperasi Lainnya
        $coopDefault = Cooperative::where('cooperative_code', 'KOP-DEFAULT-001')->first();
        $otherCoops  = Cooperative::where('cooperative_code', '!=', 'KOP-DEFAULT-001')->get();

        // Ambil Kelompok Tani
        $group1 = FarmerGroup::where('name', 'Kelompok Tani Makmur Sentosa')->first();
        $group2 = FarmerGroup::where('name', 'Kelompok Tani Tani Mukti')->first();

        $refProvinceId = '34';
        $refCityId     = '3404';

        // =========================================================================
        // BAGIAN 1: 6 PETANI ORIGINAL (DIKUSUSKAN UNTUK KOPERASI DEFAULT / GODEAN)
        // =========================================================================
        if ($coopDefault) {
            
            // --- 1. Bapak Fikri ---
            $user1 = User::updateOrCreate(
                ['email' => 'fikri@email.com'],
                ['name' => 'Bapak Fikri', 'password' => Hash::make('password123'), 'phone' => '081234567898', 'address' => 'Dusun Sidomulyo RT 01/RW 02, Godean, Sleman', 'cooperative_id' => $coopDefault->id, 'status' => 'ACTIVE', 'email_verified_at' => now()]
            );
            if (!$user1->hasRole($rolePetani)) $user1->assignRole($rolePetani);

            $farmer1 = Farmer::updateOrCreate(
                ['user_id' => $user1->id],
                ['farmer_group_id' => $group1?->id, 'nik' => '3301011212800001', 'province_id' => $refProvinceId, 'city_id' => $refCityId, 'district_id' => '340402', 'village_id' => '3404022003', 'total_land_area' => 3.50, 'notes' => 'Petani padi senior dengan metode tumpang sari.']
            );
            $farmer1->lands()->delete(); // Reset lahan agar tidak duplikat saat re-seed
            
            $land1 = $farmer1->lands()->create(['land_name' => 'Sawah Lor (Tumpang Sari)', 'province_id' => $refProvinceId, 'city_id' => $refCityId, 'district_id' => '340402', 'village_id' => '3404022003', 'area' => 2.00, 'unit' => 'Hektar(Ha)', 'status' => 'Milik Sendiri', 'soil_type' => 'Aluvial', 'water_source' => 'Irigasi Teknis', 'irrigation_type' => 'Gravitasi', 'average_temperature' => 28.5, 'average_humidity' => 78, 'average_monthly_precipitation' => 180.00]);
            $land1->plants()->createMany([
                ['name' => 'Padi Ciherang', 'planting_date' => '2026-05-10', 'current_phase' => 'Generatif', 'last_fertilizer_type' => 'NPK', 'last_fertilizer_amount' => 120.00, 'last_phase' => 'Vegetatif'],
                ['name' => 'Jagung Manis', 'planting_date' => '2026-05-25', 'current_phase' => 'Vegetatif', 'last_fertilizer_type' => 'Urea', 'last_fertilizer_amount' => 80.00, 'last_phase' => 'Penyemaian']
            ]);

            // --- 2. Ibu Febiyanti ---
            $user2 = User::updateOrCreate(
                ['email' => 'febiyanti@email.com'],
                ['name' => 'Ibu Febiyanti', 'password' => Hash::make('password123'), 'phone' => '082345678901', 'address' => 'Dusun Sidomulyo RT 04/RW 01, Godean, Sleman', 'cooperative_id' => $coopDefault->id, 'status' => 'ACTIVE', 'email_verified_at' => now()]
            );
            if (!$user2->hasRole($rolePetani)) $user2->assignRole($rolePetani);

            $farmer2 = Farmer::updateOrCreate(
                ['user_id' => $user2->id],
                ['farmer_group_id' => $group1?->id, 'nik' => '3301015505850002', 'province_id' => $refProvinceId, 'city_id' => $refCityId, 'district_id' => '340402', 'village_id' => '3404022003', 'total_land_area' => 1.25, 'notes' => 'Petani hortikultura cabai dan bawang.']
            );
            $farmer2->lands()->delete();
            $land2 = $farmer2->lands()->create(['land_name' => 'Kebun Bawang', 'province_id' => $refProvinceId, 'city_id' => $refCityId, 'district_id' => '340402', 'village_id' => '3404022003', 'area' => 0.75, 'unit' => 'Hektar(Ha)', 'status' => 'Bagi Hasil', 'soil_type' => 'Andosol', 'water_source' => 'Sumur Bor', 'irrigation_type' => 'Sprinkler', 'average_temperature' => 26.0, 'average_humidity' => 82, 'average_monthly_precipitation' => 200.00]);
            $land2->plants()->create(['name' => 'Bawang Merah', 'planting_date' => '2026-06-01', 'current_phase' => 'Vegetatif', 'last_fertilizer_type' => 'NPK', 'last_fertilizer_amount' => 50.00, 'last_phase' => 'Penyemaian']);

            // --- 3. Bapak Ari ---
            $user3 = User::updateOrCreate(
                ['email' => 'ari@email.com'],
                ['name' => 'Bapak Ari', 'password' => Hash::make('password123'), 'phone' => '083456789012', 'address' => 'Dusun Sidomulyo RT 02/RW 03, Godean, Sleman', 'cooperative_id' => $coopDefault->id, 'status' => 'ACTIVE', 'email_verified_at' => now()]
            );
            if (!$user3->hasRole($rolePetani)) $user3->assignRole($rolePetani);

            $farmer3 = Farmer::updateOrCreate(
                ['user_id' => $user3->id],
                ['farmer_group_id' => $group1?->id, 'nik' => '3301012106750003', 'province_id' => $refProvinceId, 'city_id' => $refCityId, 'district_id' => '340402', 'village_id' => '3404022003', 'total_land_area' => 1.00, 'notes' => 'Petani padi reguler.']
            );
            $farmer3->lands()->delete();
            $land3 = $farmer3->lands()->create(['land_name' => 'Sawah Utama Ari', 'province_id' => $refProvinceId, 'city_id' => $refCityId, 'district_id' => '340402', 'village_id' => '3404022003', 'area' => 1.00, 'unit' => 'Hektar(Ha)', 'status' => 'Milik Sendiri', 'soil_type' => 'Aluvial', 'water_source' => 'Irigasi Teknis', 'irrigation_type' => 'Gravitasi', 'average_temperature' => 28.0, 'average_humidity' => 80, 'average_monthly_precipitation' => 150.00]);
            $land3->plants()->create(['name' => 'Padi IR64', 'planting_date' => '2026-06-15', 'current_phase' => 'Vegetatif', 'last_fertilizer_type' => 'NPK', 'last_fertilizer_amount' => 60.00, 'last_phase' => 'Penyemaian']);

            // --- 4. Bapak Ivan ---
            $user4 = User::updateOrCreate(
                ['email' => 'ivan@email.com'],
                ['name' => 'Bapak Ivan', 'password' => Hash::make('password123'), 'phone' => '084567890123', 'address' => 'Dusun Sidomulyo RT 01/RW 05, Godean, Sleman', 'cooperative_id' => $coopDefault->id, 'status' => 'ACTIVE', 'email_verified_at' => now()]
            );
            if (!$user4->hasRole($rolePetani)) $user4->assignRole($rolePetani);
            $farmer4 = Farmer::updateOrCreate(['user_id' => $user4->id], ['farmer_group_id' => $group2?->id, 'nik' => '3301011508880004', 'province_id' => $refProvinceId, 'city_id' => $refCityId, 'district_id' => '340402', 'village_id' => '3404022003', 'total_land_area' => 0.50, 'notes' => 'Petani jagung pakan ternak.']);
            $farmer4->lands()->delete();
            $land4 = $farmer4->lands()->create(['land_name' => 'Sawah Ivan', 'province_id' => $refProvinceId, 'city_id' => $refCityId, 'district_id' => '340402', 'village_id' => '3404022003', 'area' => 0.50, 'unit' => 'Hektar(Ha)', 'status' => 'Sewa', 'soil_type' => 'Regosol', 'water_source' => 'Tadah Hujan', 'irrigation_type' => 'Manual', 'average_temperature' => 30.0, 'average_humidity' => 70, 'average_monthly_precipitation' => 110.00]);
            $land4->plants()->create(['name' => 'Jagung Hibrida', 'planting_date' => '2026-05-01', 'current_phase' => 'Vegetatif', 'last_fertilizer_type' => 'Urea', 'last_fertilizer_amount' => 45.00, 'last_phase' => 'Penyemaian']);

            // --- 5. Ibu Brokline ---
            $user5 = User::updateOrCreate(
                ['email' => 'brokline@email.com'],
                ['name' => 'Ibu Brokline', 'password' => Hash::make('password123'), 'phone' => '085678901234', 'address' => 'Dusun Sidomulyo RT 03/RW 04, Godean, Sleman', 'cooperative_id' => $coopDefault->id, 'status' => 'ACTIVE', 'email_verified_at' => now()]
            );
            if (!$user5->hasRole($rolePetani)) $user5->assignRole($rolePetani);
            $farmer5 = Farmer::updateOrCreate(['user_id' => $user5->id], ['farmer_group_id' => $group2?->id, 'nik' => '3301014402920005', 'province_id' => $refProvinceId, 'city_id' => $refCityId, 'district_id' => '340402', 'village_id' => '3404022003', 'total_land_area' => 1.20, 'notes' => 'Petani tanaman organik ramah lingkungan.']);
            $farmer5->lands()->delete();
            $land5 = $farmer5->lands()->create(['land_name' => 'Kebun Semangka Brokline', 'province_id' => $refProvinceId, 'city_id' => $refCityId, 'district_id' => '340402', 'village_id' => '3404022003', 'area' => 1.20, 'unit' => 'Hektar(Ha)', 'status' => 'Milik Sendiri', 'soil_type' => 'Latosol', 'water_source' => 'Aliran Sungai', 'irrigation_type' => 'Gravitasi', 'average_temperature' => 28.0, 'average_humidity' => 75, 'average_monthly_precipitation' => 140.00]);
            $land5->plants()->create(['name' => 'Semangka Merah Tanpa Biji', 'planting_date' => '2026-06-10', 'current_phase' => 'Vegetatif', 'last_fertilizer_type' => 'Organik', 'last_fertilizer_amount' => 150.00, 'last_phase' => 'Penyemaian']);

            // --- 6. Bapak Slamet ---
            $user6 = User::updateOrCreate(
                ['email' => 'slamet@email.com'],
                ['name' => 'Bapak Slamet', 'password' => Hash::make('password123'), 'phone' => '086789012345', 'address' => 'Dusun Sidomulyo RT 02/RW 03, Godean, Sleman', 'cooperative_id' => $coopDefault->id, 'status' => 'ACTIVE', 'email_verified_at' => now()]
            );
            if (!$user6->hasRole($rolePetani)) $user6->assignRole($rolePetani);
            $farmer6 = Farmer::updateOrCreate(['user_id' => $user6->id], ['farmer_group_id' => $group2?->id, 'nik' => '3404051205800006', 'province_id' => $refProvinceId, 'city_id' => $refCityId, 'district_id' => '340402', 'village_id' => '3404022003', 'total_land_area' => 0.80, 'notes' => 'Petani padi di wilayah Sleman uji coba.']);
            $farmer6->lands()->delete();
            $land6 = $farmer6->lands()->create(['land_name' => 'Sawah Sidomulyo', 'province_id' => $refProvinceId, 'city_id' => $refCityId, 'district_id' => '340402', 'village_id' => '3404022003', 'area' => 0.80, 'unit' => 'Hektar(Ha)', 'status' => 'Milik Sendiri', 'soil_type' => 'Regosol', 'water_source' => 'Irigasi Teknis', 'irrigation_type' => 'Gravitasi', 'average_temperature' => 27.0, 'average_humidity' => 76, 'average_monthly_precipitation' => 160.00]);
            $land6->plants()->create(['name' => 'Padi Mentik Wangi', 'planting_date' => '2026-06-05', 'current_phase' => 'Vegetatif', 'last_fertilizer_type' => 'NPK', 'last_fertilizer_amount' => 90.00, 'last_phase' => 'Penyemaian']);
        }

        // =========================================================================
        // BAGIAN 2: GENERATOR PETANI BANYAK UNTUK KOPERASI LAINNYA (DEPOK, TEMPEL, DLL)
        // =========================================================================
        
        $komoditas = ['Padi IR64', 'Jagung Manis', 'Cabai Rawit Merah', 'Kedelai', 'Bawang Merah'];
        
        foreach ($otherCoops as $coop) {
            // Buat 5 Petani untuk setiap Koperasi lainnya secara otomatis
            for ($i = 1; $i <= 5; $i++) {
                $email = strtolower(str_replace(' ', '', $faker->firstName)) . "_{$coop->id}_{$i}@email.com";
                
                $newUser = User::firstOrCreate(
                    ['email' => $email],
                    [
                        'name'              => $faker->name,
                        'password'          => Hash::make('password123'),
                        'phone'             => $faker->numerify('0812########'),
                        'address'           => "Kecamatan {$coop->district}, Sleman",
                        'cooperative_id'    => $coop->id,
                        'status'            => 'ACTIVE',
                        'email_verified_at' => now(),
                    ]
                );
                
                if (!$newUser->hasRole($rolePetani)) {
                    $newUser->assignRole($rolePetani);
                }

                $newFarmer = Farmer::firstOrCreate(
                    ['user_id' => $newUser->id],
                    [
                        'farmer_group_id' => $faker->randomElement([$group1?->id, $group2?->id, null]),
                        'nik'             => $faker->numerify('330101##########'),
                        'province_id'     => $refProvinceId,
                        'city_id'         => $refCityId,
                        'district_id'     => '340499', // Dummy District ID
                        'village_id'      => '3404990001',
                        'total_land_area' => $faker->randomFloat(2, 0.5, 3.0),
                        'notes'           => "Petani otomatis dari Koperasi {$coop->district}.",
                    ]
                );

                // Buat 1 Lahan untuk Petani Baru
                $newLand = $newFarmer->lands()->create([
                    'land_name'                      => "Lahan {$faker->word()} {$coop->district}",
                    'province_id'                    => $refProvinceId,
                    'city_id'                        => $refCityId,
                    'district_id'                    => '340499',
                    'village_id'                     => '3404990001',
                    'area'                           => $faker->randomFloat(2, 0.5, 2.0),
                    'unit'                           => 'Hektar(Ha)',
                    'status'                         => 'Milik Sendiri',
                    'soil_type'                      => 'Regosol',
                    'water_source'                   => 'Irigasi Teknis',
                    'irrigation_type'                => 'Gravitasi',
                    'average_temperature'            => 28.0,
                    'average_humidity'               => 75,
                    'average_monthly_precipitation' => 150.00,
                ]);

                // Tambahkan 1 Tanaman Acak
                $newLand->plants()->create([
                    'name'                   => $faker->randomElement($komoditas),
                    'planting_date'          => $faker->dateTimeBetween('-2 months', 'now')->format('Y-m-d'),
                    'current_phase'          => 'Vegetatif',
                    'last_fertilizer_type'   => 'Urea',
                    'last_fertilizer_amount' => $faker->randomFloat(2, 30, 100),
                    'last_phase'             => 'Penyemaian',
                ]);
            }
        }
    }
}