<?php

namespace App\Http\Controllers;

use App\Models\Fertilizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class FertilizerController extends Controller implements HasMiddleware
{
    /**
     * Daftarkan Middleware untuk proteksi Role Spatie (Laravel 11 Style)
     */
    public static function middleware(): array
    {
        return [
            new Middleware('role:petugas-koperasi', only: ['store', 'update', 'destroy']),
        ];
    }


        $roleAdminLapangan    = Role::firstOrCreate(['name' => 'admin-lapangan', 'guard_name' => 'api']);
        $rolePetugasKoperasi  = Role::firstOrCreate(['name' => 'petugas-koperasi', 'guard_name' => 'api']);
        $roleDinasPertanian   = Role::firstOrCreate(['name' => 'dinas-pertanian', 'guard_name' => 'api']);
        $roleKemenkoPangan    = Role::firstOrCreate(['name' => 'kemenko-pangan', 'guard_name' => 'api']);
        $rolePetani           = Role::firstOrCreate(['name' => 'petani', 'guard_name' => 'api']);

        // --- Akun Admin Lapangan (Terikat Koperasi Ranjeng) ---
        $adminLapangan = User::firstOrCreate(
            ['email' => 'admin.lapangan@coopflow.id'],
            [
                'name' => 'Budi Setiawan (Admin Lapangan)',
                'password' => Hash::make('password123'),
                'phone' => '081234567890',
                'address' => 'Kantor Poktan Sleman, Yogyakarta',
                'cooperative_id' => 1,
                'status' => 'ACTIVE'
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
                'cooperative_id' => 1,
                'status' => 'PENDING'
            ]
        );
        if (!$petugasKoperasi->hasRole($rolePetugasKoperasi)) {
            $petugasKoperasi->assignRole($rolePetugasKoperasi);
        }

        // 4. Simpan ke Database
        $fertilizer = Fertilizer::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Data pupuk baru berhasil ditambahkan.',
            'data'    => $fertilizer->load('warehouse')
        ], 201);
    }

    /**
     * Display the specified resource (READ SINGLE).
     * Bisa diakses oleh semua user terautentikasi (Sanctum)
     */
    public function show(Fertilizer $fertilizer)
    {
        return response()->json([
            'success' => true,
            'message' => 'Detail data pupuk berhasil ditemukan.',
            'data'    => $fertilizer->load(['warehouse', 'mutations'])
        ], 200);
    }

    /**
     * Update the specified resource in storage (UPDATE).
     * HANYA PETUGAS KOPERASI
     */
    public function update(Request $request, Fertilizer $fertilizer)
    {
        $request->validate([
            'fertilizer_code'   => 'required|string|unique:fertilizers,fertilizer_code,' . $fertilizer->id,
            'warehouse_id'      => 'required|exists:warehouses,id',
            'name'              => 'required|string|max:255',
            'packaging_size_kg' => 'nullable|integer|min:1',
            'current_stock_kg'  => 'nullable|integer|min:0',
            'minimum_stock_kg'  => 'nullable|integer|min:0',
            'price_per_kg'      => 'required|integer|min:0',
            'image'             => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        $data = $request->only([
            'fertilizer_code', 'warehouse_id', 'name', 
            'packaging_size_kg', 'current_stock_kg', 'minimum_stock_kg', 'price_per_kg'
        ]);

        if ($request->hasFile('image')) {
            if ($fertilizer->image) {
                $oldPath = str_replace('/storage/', '', $fertilizer->image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('fertilizers', 'public');
            $data['image'] = Storage::url($path);
        }

        $current = $request->input('current_stock_kg', $fertilizer->current_stock_kg);
        $min = $request->input('minimum_stock_kg', $fertilizer->minimum_stock_kg);

        if ($current <= 0) {
            $data['status'] = 'habis';
        } elseif ($current <= $min) {
            $data['status'] = 'menipis';
        } else {
            $data['status'] = 'tersedia';
        }

        $fertilizer->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Data pupuk berhasil diperbarui.',
            'data'    => $fertilizer->load('warehouse')
        ], 200);
    }

    /**
     * Remove the specified resource from storage (DELETE).
     * HANYA PETUGAS KOPERASI
     */
    public function destroy(Fertilizer $fertilizer)
    {
        if ($fertilizer->image) {
            $path = str_replace('/storage/', '', $fertilizer->image);
            Storage::disk('public')->delete($path);
        }

        $fertilizer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data pupuk berhasil dihapus dari sistem.'
        ], 200);
    }
}