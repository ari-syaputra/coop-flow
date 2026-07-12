<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class RoleAndUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Reset Cached Roles dan Permissions bawaan Spatie
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $roleAdminLapangan    = Role::firstOrCreate(['name' => 'admin-lapangan', 'guard_name' => 'web']);
        $rolePetugasKoperasi  = Role::firstOrCreate(['name' => 'petugas-koperasi', 'guard_name' => 'web']);
        $roleDinasPertanian   = Role::firstOrCreate(['name' => 'dinas-pertanian', 'guard_name' => 'web']);
        $roleKemenkoPangan    = Role::firstOrCreate(['name' => 'kemenko-pangan', 'guard_name' => 'web']);
        $rolePetani           = Role::firstOrCreate(['name' => 'petani', 'guard_name' => 'web']);

        // --- Akun Admin Lapangan (Terikat Koperasi Ranjeng) ---
        $adminLapangan = User::firstOrCreate(
            ['email' => 'admin.lapangan@coopflow.id'],
            [
                'name' => 'Budi Setiawan (Admin Lapangan)',
                'password' => Hash::make('password123'),
                'phone' => '081234567890',
                'address' => 'Kantor Poktan Sleman, Yogyakarta',
                'cooperative_id' => 1
            ]
        );
        if (!$adminLapangan->hasRole($roleAdminLapangan)) {
            $adminLapangan->assignRole($roleAdminLapangan);
        }

        // --- Akun Petugas Koperasi (Terikat Koperasi Ranjeng) ---
        $petugasKoperasi = User::firstOrCreate(
            ['email' => 'koperasi@coopflow.id'],
            [
                'name' => 'Siti Aminah (Petugas Koperasi)',
                'password' => Hash::make('password123'),
                'phone' => '081234567891',
                'address' => 'Koperasi Unit Desa (KUD) Makmur Sejahtera',
                'cooperative_id' => 1
            ]
        );
        if (!$petugasKoperasi->hasRole($rolePetugasKoperasi)) {
            $petugasKoperasi->assignRole($rolePetugasKoperasi);
        }

        // --- Akun Dinas Pertanian (Tidak Terikat Koperasi) ---
        $dinasPertanian = User::firstOrCreate(
            ['email' => 'dinas.pertanian@go.id'],
            [
                'name' => 'Ir. Ahmad Subarjo (Dinas Pertanian)',
                'password' => Hash::make('password123'),
                'phone' => '081234567892',
                'address' => 'Kantor Dinas Pertanian & Ketahanan Pangan Daerah',
                'cooperative_id' => null
            ]
        );
        if (!$dinasPertanian->hasRole($roleDinasPertanian)) {
            $dinasPertanian->assignRole($roleDinasPertanian);
        }

        // --- Akun Kemenko Pangan (Tidak Terikat Koperasi) ---
        $kemenkoPangan = User::firstOrCreate(
            ['email' => 'kemenko.pangan@go.id'],
            [
                'name' => 'Dr. Hendra Wijaya (Kemenko Pangan)',
                'password' => Hash::make('password123'),
                'phone' => '081234567893',
                'address' => 'Kementerian Koordinator Bidang Pangan, Jakarta',
                'cooperative_id' => null
            ]
        );
        if (!$kemenkoPangan->hasRole($roleKemenkoPangan)) {
            $kemenkoPangan->assignRole($roleKemenkoPangan);
        }
    }
}