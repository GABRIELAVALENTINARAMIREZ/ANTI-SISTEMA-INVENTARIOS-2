<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lotes', function (Blueprint $table) {
            $table->increments('id_lote');
            $table->string('numero_lote', 50)->unique();
            $table->unsignedInteger('id_producto');
            $table->decimal('cantidad', 10, 2)->default(0);
            $table->date('fecha_ingreso');
            $table->date('fecha_vencimiento');
            $table->unsignedInteger('id_ubicacion')->nullable();
            $table->boolean('dado_de_baja')->default(false);

            $table->foreign('id_producto')
                ->references('id_producto')
                ->on('productos')
                ->onUpdate('cascade')
                ->onDelete('restrict');

            $table->foreign('id_ubicacion')
                ->references('id_ubicacion')
                ->on('ubicaciones')
                ->onUpdate('cascade')
                ->onDelete('set null');

            $table->index('id_producto');
            $table->index('fecha_vencimiento');
            $table->index('dado_de_baja');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lotes');
    }
};
