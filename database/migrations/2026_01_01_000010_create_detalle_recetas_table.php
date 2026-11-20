<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detalle_recetas', function (Blueprint $table) {
            $table->increments('id_detalle_receta');
            $table->unsignedInteger('id_receta');
            $table->unsignedInteger('id_producto');
            $table->decimal('cantidad', 10, 2);

            $table->foreign('id_receta')
                ->references('id_receta')
                ->on('recetas')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_producto')
                ->references('id_producto')
                ->on('productos')
                ->onUpdate('cascade')
                ->onDelete('restrict');

            $table->index('id_receta');
            $table->index('id_producto');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detalle_recetas');
    }
};
