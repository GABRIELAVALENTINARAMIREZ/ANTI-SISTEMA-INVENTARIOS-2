<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersonalAccessToken extends Model
{
    use HasFactory;

    protected $table = 'personal_access_tokens';
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'nombre',
        'token',
        'habilidades',
        'ultimo_uso',
        'expira_en',
    ];

    protected $casts = [
        'habilidades' => 'array',
        'ultimo_uso' => 'datetime',
        'expira_en' => 'datetime',
        'creado_en' => 'datetime',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id_usuario');
    }

    public function haExpirado(): bool
    {
        return $this->expira_en !== null && $this->expira_en->isPast();
    }
}
