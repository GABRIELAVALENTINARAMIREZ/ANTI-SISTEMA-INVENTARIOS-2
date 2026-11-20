<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $table = 'productos';
    protected $primaryKey = 'id_producto';
    public $timestamps = false;

    protected $fillable = [
        'codigo',
        'nombre',
        'imagen',
        'id_categoria',
        'id_proveedor',
        'id_ubicacion',
        'cantidad',
        'unidad_medida',
        'stock_minimo',
        'precio_compra',
    ];

    protected $casts = [
        'cantidad' => 'decimal:2',
        'stock_minimo' => 'decimal:2',
        'precio_compra' => 'decimal:2',
        'actualizado_en' => 'datetime',
    ];

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'id_categoria', 'id_categoria');
    }

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'id_proveedor', 'id_proveedor');
    }

    public function ubicacion()
    {
        return $this->belongsTo(Ubicacion::class, 'id_ubicacion', 'id_ubicacion');
    }

    public function lotes()
    {
        return $this->hasMany(Lote::class, 'id_producto', 'id_producto');
    }

    public function detallesMovimiento()
    {
        return $this->hasMany(DetalleMovimiento::class, 'id_producto', 'id_producto');
    }

    public function detallesReceta()
    {
        return $this->hasMany(DetalleReceta::class, 'id_producto', 'id_producto');
    }

    // Accessor para estado de stock
    public function getEstadoStockAttribute()
    {
        if ($this->cantidad <= 0) {
            return 'agotado';
        } elseif ($this->cantidad <= $this->stock_minimo) {
            return 'bajo_stock';
        }
        return 'disponible';
    }
}
