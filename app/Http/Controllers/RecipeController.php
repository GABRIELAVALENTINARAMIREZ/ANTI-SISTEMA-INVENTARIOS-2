<?php

namespace App\Http\Controllers;

use App\Models\Receta;
use App\Models\Producto;
use Illuminate\Http\Request;

class RecipeController extends Controller
{
    public function index()
    {
        try {
            $recetas = Receta::with('ingredientes.producto')->get();
            $productos = Producto::all();
        } catch (\Exception $e) {
            $recetas = collect();
            $productos = collect();
        }

        return view('recetas.index', compact('recetas', 'productos'));
    }
}
