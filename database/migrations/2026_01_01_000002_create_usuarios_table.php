<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->increments('id_usuario');
            $table->unsignedInteger('id_rol');
            $table->string('nombre', 120);
            $table->string('usuario', 60)->unique();
            $table->string('correo', 120)->unique();
            $table->string('password_hash', 255);
            $table->string('avatar', 255)->nullable();
            $table->enum('estado', ['Activo', 'Inactivo'])->default('Activo');
            $table->dateTime('ultimo_acceso')->nullable();
            $table->timestamp('creado_en')->useCurrent();

            $table->foreign('id_rol')
                ->references('id_rol')
                ->on('roles')
                ->onUpdate('cascade')
                ->onDelete('restrict');

            $table->index('id_rol');
            $table->index('estado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
