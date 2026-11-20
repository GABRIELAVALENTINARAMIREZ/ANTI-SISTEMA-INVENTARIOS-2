<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ubicacion extends Model
{
    use HasFactory;

    protected $table = 'ubicaciones';
    protected $primaryKey = 'id_ubicacion';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'tipo',
    ];

    public function productos()
    {
        return $this->hasMany(Producto::class, 'id_ubicacion', 'id_ubicacion');
    }

    public function lotes()
    {
        return $this->hasMany(Lote::class, 'id_ubicacion', 'id_ubicacion');
    }
}
