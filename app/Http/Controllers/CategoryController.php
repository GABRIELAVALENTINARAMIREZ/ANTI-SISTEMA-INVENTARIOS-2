<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        try {
            $categorias = Categoria::withCount('productos')->get();
        } catch (\Exception $e) {
            $categorias = collect();
        }

        return view('categorias.index', compact('categorias'));
    }
}
