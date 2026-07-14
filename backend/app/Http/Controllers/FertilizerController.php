<?php

namespace App\Http\Controllers;

use App\Models\Fertilizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FertilizerController extends Controller
{
    /**
     * Display a listing of the resource (READ ALL).
     */
    public function index()
    {
        // Mengambil semua data pupuk beserta relasi gudangnya
        $fertilizers = Fertilizer::with('warehouse')->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar data pupuk berhasil diambil.',
            'data'    => $fertilizers
        ], 200);
    }

    /**
     * Store a newly created resource in storage (CREATE).
     */
    public function store(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'fertilizer_code'   => 'required|string|unique:fertilizers,fertilizer_code',
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

        // 2. Logika Upload Gambar
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('fertilizers', 'public');
            $data['image'] = Storage::url($path);
        }

        // 3. Otomatisasi Status Berdasarkan Stok
        $current = $request->input('current_stock_kg', 0);
        $min = $request->input('minimum_stock_kg', 1000);
        
        if ($current <= 0) {
            $data['status'] = 'habis';
        } elseif ($current <= $min) {
            $data['status'] = 'menipis';
        } else {
            $data['status'] = 'tersedia';
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
     */
    public function update(Request $request, Fertilizer $fertilizer)
    {
        // 1. Validasi Input (Abaikan unique check untuk id milik pupuk ini sendiri)
        $request->validate([
            'fertilizer_code'   => 'required|string|unique:fertilizers,fertilizer_code,' . $fertilizer->id,
            'warehouse_id'      => 'required|exists:warehouses,id',
            'name'              => 'required|string|max:255',
            'packaging_size_kg' => 'nullable|integer|min:1',
            'current_stock_kg'  => 'nullable|integer|min:0',
            'minimum_stock_kg'  => 'nullable|integer|min:0',
            'price_per_kg'      => 'required|integer|min:0',
            'image'             => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = $request->only([
            'fertilizer_code', 'warehouse_id', 'name', 
            'packaging_size_kg', 'current_stock_kg', 'minimum_stock_kg', 'price_per_kg'
        ]);

        // 2. Logika Update Gambar (Hapus gambar lama jika ada upload baru)
        if ($request->hasFile('image')) {
            if ($fertilizer->image) {
                $oldPath = str_replace('/storage/', '', $fertilizer->image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('fertilizers', 'public');
            $data['image'] = Storage::url($path);
        }

        // 3. Update Status Berdasarkan Stok Baru
        $current = $request->input('current_stock_kg', $fertilizer->current_stock_kg);
        $min = $request->input('minimum_stock_kg', $fertilizer->minimum_stock_kg);

        if ($current <= 0) {
            $data['status'] = 'habis';
        } elseif ($current <= $min) {
            $data['status'] = 'menipis';
        } else {
            $data['status'] = 'tersedia';
        }

        // 4. Update Database
        $fertilizer->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Data pupuk berhasil diperbarui.',
            'data'    => $fertilizer->load('warehouse')
        ], 200);
    }

    /**
     * Remove the specified resource from storage (DELETE).
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