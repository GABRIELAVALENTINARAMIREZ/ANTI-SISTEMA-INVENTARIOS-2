<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categorias', function (Blueprint $table) {
            $table->increments('id_categoria');
            $table->string('nombre', 80)->unique();
            $table->string('descripcion', 255)->nullable();
            $table->string('icono', 40)->default('Package');
            $table->string('color', 20)->default('#E63946');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categorias');
    }
};
