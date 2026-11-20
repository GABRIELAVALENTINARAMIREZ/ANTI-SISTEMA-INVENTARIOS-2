<?php

namespace App\Http\Controllers;

use App\Models\Movimiento;
use App\Models\Producto;
use App\Models\Proveedor;
use Illuminate\Http\Request;

class MovementController extends Controller
{
    public function index()
    {
        try {
            $movimientos = Movimiento::with(['usuario', 'proveedor', 'detalles.producto'])
                ->orderBy('fecha', 'desc')
                ->get();
            $productos = Producto::all();
            $proveedores = Proveedor::all();
        } catch (\Exception $e) {
            $movimientos = collect();
            $productos = collect();
            $proveedores = collect();
        }

        return view('movimientos.index', compact('movimientos', 'productos', 'proveedores'));
    }
}
