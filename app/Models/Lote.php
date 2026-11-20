<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lote extends Model
{
    use HasFactory;

    protected $table = 'lotes';
    protected $primaryKey = 'id_lote';
    public $timestamps = false;

    protected $fillable = [
        'numero_lote',
        'id_producto',
        'cantidad',
        'fecha_ingreso',
        'fecha_vencimiento',
        'id_ubicacion',
        'dado_de_baja',
    ];

    protected $casts = [
        'cantidad' => 'decimal:2',
        'fecha_ingreso' => 'date',
        'fecha_vencimiento' => 'date',
        'dado_de_baja' => 'boolean',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto', 'id_producto');
    }

    public function ubicacion()
    {
        return $this->belongsTo(Ubicacion::class, 'id_ubicacion', 'id_ubicacion');
    }

    public function getEstadoAttribute()
    {
        $hoy = now()->startOfDay();
        $vencimiento = $this->fecha_vencimiento->startOfDay();
        $diasDiferencia = $hoy->diffInDays($vencimiento, false);

        if ($diasDiferencia < 0) {
            return 'vencido';
        } elseif ($diasDiferencia <= 5) {
            return 'proximo_vencer';
        }
        return 'vigente';
    }
}
