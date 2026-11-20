<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Receta extends Model
{
    use HasFactory;

    protected $table = 'recetas';
    protected $primaryKey = 'id_receta';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'categoria_menu',
        'precio_venta',
        'tiempo_preparacion_min',
    ];

    protected $casts = [
        'precio_venta' => 'decimal:2',
    ];

    public function ingredientes()
    {
        return $this->hasMany(DetalleReceta::class, 'id_receta', 'id_receta');
    }
}
