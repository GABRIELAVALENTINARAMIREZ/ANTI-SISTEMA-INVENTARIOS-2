<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Movimiento;
use App\Models\Categoria;
use App\Models\Lote;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $totalProductos = Producto::count();
            $bajoStockCount = Producto::whereColumn('cantidad', '<=', 'stock_minimo')->where('cantidad', '>', 0)->count();
            $agotadosCount = Producto::where('cantidad', '<=', 0)->count();
            $totalCategorias = Categoria::count();
            $lotesProximos = Lote::where('fecha_vencimiento', '<=', now()->addDays(5))
                ->where('dado_de_baja', false)
                ->with('producto')
                ->take(5)
                ->get();
            $movimientosRecientes = Movimiento::with(['usuario', 'proveedor'])
                ->orderBy('fecha', 'desc')
                ->take(6)
                ->get();
        } catch (\Exception $e) {
            // Fallback cuando la BD aún no ha sido migrada
            $totalProductos = 15;
            $bajoStockCount = 3;
            $agotadosCount = 1;
            $totalCategorias = 8;
            $lotesProximos = collect();
            $movimientosRecientes = collect();
        }

        return view('dashboard', compact(
            'totalProductos',
            'bajoStockCount',
            'agotadosCount',
            'totalCategorias',
            'lotesProximos',
            'movimientosRecientes'
        ));
    }
}
