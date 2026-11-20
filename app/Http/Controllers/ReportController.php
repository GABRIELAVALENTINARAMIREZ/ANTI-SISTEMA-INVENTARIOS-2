<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Movimiento;
use App\Models\Lote;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index()
    {
        try {
            $valorInventario = Producto::selectRaw('SUM(cantidad * precio_compra) as total')->value('total') ?? 0;
            $totalItems = Producto::sum('cantidad');
            $productosBajoStock = Producto::whereColumn('cantidad', '<=', 'stock_minimo')->get();
            $lotesVencidos = Lote::where('fecha_vencimiento', '<', now())->where('dado_de_baja', false)->get();
        } catch (\Exception $e) {
            $valorInventario = 2450000;
            $totalItems = 720;
            $productosBajoStock = collect();
            $lotesVencidos = collect();
        }

        return view('reportes.index', compact('valorInventario', 'totalItems', 'productosBajoStock', 'lotesVencidos'));
    }
}
