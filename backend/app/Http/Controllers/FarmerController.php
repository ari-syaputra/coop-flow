<?php

namespace App\Http\Controllers;

use App\Models\Farmer;
use App\Models\User;
use App\Models\Land;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class FarmerController extends Controller
{
    /**
     * Menampilkan daftar master petani beserta akun user dan semua daftar lahannya
     */
    public function index()
    {
        // Mengambil petani beserta data user dan array data lands-nya
        $farmers = Farmer::with(['user', 'lands'])->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $farmers
        ], 200);
    }

    /**
     * Daftarkan Petani Baru lewat Admin Lapangan beserta Multi-Lahan
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // Validasi Akun User
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|unique:users',
            'address' => 'nullable|string',
            
            // Validasi Profil Petani
            'farmer_group' => 'required|string|max:255',
            'nik' => 'nullable|string|size:16|unique:farmers',
            'notes' => 'nullable|string',
            
            // Validasi Array Lahan (Diterima dalam bentuk struktur array json)
            'lands' => 'required|array|min:1',
            'lands.*.land_name' => 'required|string|max:255',
            'lands.*.area' => 'required|numeric|min:0',
            'lands.*.location_address' => 'nullable|string',
        ], [
            'lands.required' => 'Petani wajib memiliki minimal 1 data lahan.',
            'lands.*.land_name.required' => 'Nama lahan tidak boleh kosong.',
            'lands.*.area.required' => 'Luas area lahan wajib diisi.'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        DB::beginTransaction();

        try {
            // 1. Buat User Account terlebih dahulu
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'address' => $request->address,
            ]);

            // Assign role otomatis sebagai petani
            $user->assignRole('petani');

            // 2. Kalkulasi Akumulasi Total Luas Lahan dari array yang dikirim
            $totalLandArea = collect($request->lands)->sum('area');

            // 3. Buat Data Profil Petani terikat dengan user_id
            $farmer = Farmer::create([
                'user_id' => $user->id,
                'farmer_group' => $request->farmer_group,
                'nik' => $request->nik,
                'total_land_area' => $totalLandArea, // Menyimpan total kalkulasi agrregat
                'notes' => $request->notes,
            ]);

            // 4. Looping untuk menyimpan data setiap kavling lahan ke tabel 'lands'
            foreach ($request->lands as $landData) {
                $farmer->lands()->create([
                    'land_name' => $landData['land_name'],
                    'area' => $landData['area'],
                    'location_address' => $landData['location_address'] ?? null,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data master petani dan rincian lahan berhasil didaftarkan!',
                'data' => $farmer->load(['user', 'lands'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan data ke server.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menampilkan detail satu petani beserta daftar lahannya
     */
    public function show($id)
    {
        $farmer = Farmer::with(['user', 'lands'])->find($id);

        if (!$farmer) {
            return response()->json(['message' => 'Petani tidak ditemukan'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $farmer
        ], 200);
    }

    /**
     * Mengubah data profil master petani beserta sinkronisasi pembaruan lahan
     */
    public function update(Request $request, $id)
    {
        $farmer = Farmer::find($id);
        if (!$farmer) {
            return response()->json(['message' => 'Petani tidak ditemukan'], 404);
        }

        $user = $farmer->user;

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|unique:users,phone,' . $user->id,
            'address' => 'nullable|string',
            'farmer_group' => 'required|string|max:255',
            'nik' => 'nullable|string|size:16|unique:farmers,nik,' . $farmer->id,
            'notes' => 'nullable|string',
            
            // Validasi array lahan saat update
            'lands' => 'required|array|min:1',
            'lands.*.land_name' => 'required|string|max:255',
            'lands.*.area' => 'required|numeric|min:0',
            'lands.*.location_address' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        DB::beginTransaction();

        try {
            // 1. Update data User Akun
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
            ]);

            // 2. Bersihkan / Hapus rincian data lahan lama untuk petani ini (Re-write approach)
            $farmer->lands()->delete();

            // 3. Masukkan kembali rincian data lahan baru dari request form
            foreach ($request->lands as $landData) {
                $farmer->lands()->create([
                    'land_name' => $landData['land_name'],
                    'area' => $landData['area'],
                    'location_address' => $landData['location_address'] ?? null,
                ]);
            }

            // 4. Hitung ulang total luas lahan terupdate
            $totalLandArea = collect($request->lands)->sum('area');

            // 5. Update data utama profil Petani
            $farmer->update([
                'farmer_group' => $request->farmer_group,
                'nik' => $request->nik,
                'total_land_area' => $totalLandArea,
                'notes' => $request->notes,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data profil petani dan rincian lahan berhasil diperbarui!',
                'data' => $farmer->load(['user', 'lands'])
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui data.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menghapus petani (Otomatis menghapus User dan seluruh Lands karena cascade)
     */
    public function destroy($id)
    {
        $farmer = Farmer::find($id);
        if (!$farmer) {
            return response()->json(['message' => 'Petani tidak ditemukan'], 404);
        }

        $user = User::find($farmer->user_id);
        if ($user) {
            $user->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Data master petani beserta seluruh aset lahannya berhasil dihapus.'
        ], 200);
    }
}