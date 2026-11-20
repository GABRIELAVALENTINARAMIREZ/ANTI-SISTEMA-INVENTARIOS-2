<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detalle_movimientos', function (Blueprint $table) {
            $table->increments('id_detalle');
            $table->unsignedInteger('id_movimiento');
            $table->unsignedInteger('id_producto');
            $table->decimal('cantidad', 10, 2);
            $table->decimal('costo_unitario', 12, 2)->default(0);

            $table->foreign('id_movimiento')
                ->references('id_movimiento')
                ->on('movimientos')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_producto')
                ->references('id_producto')
                ->on('productos')
                ->onUpdate('cascade')
                ->onDelete('restrict');

            $table->index('id_movimiento');
            $table->index('id_producto');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detalle_movimientos');
    }
};
