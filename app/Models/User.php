<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';
    public $timestamps = false;

    protected $fillable = [
        'id_rol',
        'nombre',
        'usuario',
        'correo',
        'password_hash',
        'avatar',
        'estado',
        'ultimo_acceso',
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    protected $casts = [
        'ultimo_acceso' => 'datetime',
        'creado_en' => 'datetime',
    ];

    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function rol()
    {
        return $this->belongsTo(Role::class, 'id_rol', 'id_rol');
    }

    public function tokens()
    {
        return $this->hasMany(PersonalAccessToken::class, 'id_usuario', 'id_usuario');
    }

    public function movimientos()
    {
        return $this->hasMany(Movimiento::class, 'id_usuario', 'id_usuario');
    }

    public function auditorias()
    {
        return $this->hasMany(Auditoria::class, 'id_usuario', 'id_usuario');
    }

    /**
     * Genera un token de API seguro (hash SHA-256 en BD, entrega texto plano una sola vez).
     */
    public function crearTokenApi(string $nombre = 'default', array $habilidades = ['*'], ?int $minutosExpiracion = 480): string
    {
        $plainToken = Str::random(64);
        $tokenHash = hash('sha256', $plainToken);

        $this->tokens()->create([
            'nombre' => $nombre,
            'token' => $tokenHash,
            'habilidades' => $habilidades,
            'ultimo_uso' => now(),
            'expira_en' => $minutosExpiracion ? now()->addMinutes($minutosExpiracion) : null,
        ]);

        return $plainToken;
    }

    /**
     * Verifica si el usuario tiene alguno de los roles indicados.
     */
    public function tieneRol(string ...$roles): bool
    {
        if (!$this->rol) {
            $this->load('rol');
        }
        return in_array($this->rol?->nombre, $roles, true);
    }
}
