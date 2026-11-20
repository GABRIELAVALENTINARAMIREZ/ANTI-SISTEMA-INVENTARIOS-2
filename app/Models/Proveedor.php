<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proveedor extends Model
{
    use HasFactory;

    protected $table = 'proveedores';
    protected $primaryKey = 'id_proveedor';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'nit',
        'telefono',
        'correo',
        'direccion',
        'productos_suministrados',
        'estado',
    ];

    protected $casts = [
        'productos_suministrados' => 'array',
        'creado_en' => 'datetime',
    ];

    public function productos()
    {
        return $this->hasMany(Producto::class, 'id_proveedor', 'id_proveedor');
    }

    public function movimientos()
    {
        return $this->hasMany(Movimiento::class, 'id_proveedor', 'id_proveedor');
    }
}
