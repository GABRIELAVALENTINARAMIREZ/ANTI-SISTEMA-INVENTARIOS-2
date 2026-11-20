<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movimientos', function (Blueprint $table) {
            $table->increments('id_movimiento');
            $table->enum('tipo', ['entrada', 'salida']);
            $table->string('subtipo', 60);
            $table->unsignedInteger('id_proveedor')->nullable();
            $table->unsignedInteger('id_usuario');
            $table->text('observacion')->nullable();
            $table->decimal('total_cop', 14, 2)->default(0);
            $table->dateTime('fecha')->useCurrent();

            $table->foreign('id_proveedor')
                ->references('id_proveedor')
                ->on('proveedores')
                ->onUpdate('cascade')
                ->onDelete('set null');

            $table->foreign('id_usuario')
                ->references('id_usuario')
                ->on('usuarios')
                ->onUpdate('cascade')
                ->onDelete('restrict');

            $table->index('tipo');
            $table->index('subtipo');
            $table->index('fecha');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movimientos');
    }
};
