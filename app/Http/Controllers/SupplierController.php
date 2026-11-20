<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        try {
            $proveedores = Proveedor::withCount('productos')->get();
        } catch (\Exception $e) {
            $proveedores = collect();
        }

        return view('proveedores.index', compact('proveedores'));
    }
}
