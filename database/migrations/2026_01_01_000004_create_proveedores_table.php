<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('proveedores', function (Blueprint $table) {
            $table->increments('id_proveedor');
            $table->string('nombre', 150);
            $table->string('nit', 30)->unique();
            $table->string('telefono', 30)->nullable();
            $table->string('correo', 120)->nullable();
            $table->string('direccion', 200)->nullable();
            $table->json('productos_suministrados')->nullable();
            $table->enum('estado', ['Activo', 'Inactivo'])->default('Activo');
            $table->timestamp('creado_en')->useCurrent();

            $table->index('estado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proveedores');
    }
};
