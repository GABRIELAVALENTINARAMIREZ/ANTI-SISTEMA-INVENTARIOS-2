<?php

namespace App\Http\Controllers;

use App\Models\Lote;
use App\Models\Producto;
use App\Models\Ubicacion;
use Illuminate\Http\Request;

class BatchController extends Controller
{
    public function index()
    {
        try {
            $lotes = Lote::with(['producto', 'ubicacion'])
                ->orderBy('fecha_vencimiento', 'asc')
                ->get();
            $productos = Producto::all();
            $ubicaciones = Ubicacion::all();
        } catch (\Exception $e) {
            $lotes = collect();
            $productos = collect();
            $ubicaciones = collect();
        }

        return view('lotes.index', compact('lotes', 'productos', 'ubicaciones'));
    }
}
