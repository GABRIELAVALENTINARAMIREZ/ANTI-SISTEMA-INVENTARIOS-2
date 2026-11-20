<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Proveedor;
use App\Models\Ubicacion;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Producto::with(['categoria', 'proveedor', 'ubicacion']);

            if ($request->filled('categoria')) {
                $query->where('id_categoria', $request->categoria);
            }
            if ($request->filled('estado')) {
                if ($request->estado === 'agotado') {
                    $query->where('cantidad', '<=', 0);
                } elseif ($request->estado === 'bajo') {
                    $query->whereColumn('cantidad', '<=', 'stock_minimo')->where('cantidad', '>', 0);
                } elseif ($request->estado === 'disponible') {
                    $query->whereColumn('cantidad', '>', 'stock_minimo');
                }
            }
            if ($request->filled('buscar')) {
                $b = $request->buscar;
                $query->where(function ($q) use ($b) {
                    $q->where('nombre', 'like', "%{$b}%")
                      ->orWhere('codigo', 'like', "%{$b}%");
                });
            }

            $productos = $query->get();
            $categorias = Categoria::all();
            $proveedores = Proveedor::all();
            $ubicaciones = Ubicacion::all();
        } catch (\Exception $e) {
            $productos = collect();
            $categorias = collect();
            $proveedores = collect();
            $ubicaciones = collect();
        }

        return view('inventario.index', compact('productos', 'categorias', 'proveedores', 'ubicaciones'));
    }
}
