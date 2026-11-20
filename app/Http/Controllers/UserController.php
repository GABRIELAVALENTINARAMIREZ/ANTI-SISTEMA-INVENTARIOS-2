<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        try {
            $usuarios = User::with('rol')->get();
            $roles = Role::all();
        } catch (\Exception $e) {
            $usuarios = collect();
            $roles = collect();
        }

        return view('usuarios.index', compact('usuarios', 'roles'));
    }
}
