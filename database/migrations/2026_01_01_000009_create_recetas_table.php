<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recetas', function (Blueprint $table) {
            $table->increments('id_receta');
            $table->string('nombre', 120)->unique();
            $table->string('categoria_menu', 80);
            $table->decimal('precio_venta', 12, 2)->default(0);
            $table->integer('tiempo_preparacion_min')->default(10);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recetas');
    }
};
