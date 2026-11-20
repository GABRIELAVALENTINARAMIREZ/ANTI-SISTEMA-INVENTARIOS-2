<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->increments('id_producto');
            $table->string('codigo', 30)->unique();
            $table->string('nombre', 150);
            $table->string('imagen', 255)->nullable();
            $table->unsignedInteger('id_categoria');
            $table->unsignedInteger('id_proveedor');
            $table->unsignedInteger('id_ubicacion')->nullable();
            $table->decimal('cantidad', 10, 2)->default(0);
            $table->string('unidad_medida', 30)->default('unidades');
            $table->decimal('stock_minimo', 10, 2)->default(0);
            $table->decimal('precio_compra', 12, 2)->default(0);
            $table->timestamp('actualizado_en')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('id_categoria')
                ->references('id_categoria')
                ->on('categorias')
                ->onUpdate('cascade')
                ->onDelete('restrict');

            $table->foreign('id_proveedor')
                ->references('id_proveedor')
                ->on('proveedores')
                ->onUpdate('cascade')
                ->onDelete('restrict');

            $table->foreign('id_ubicacion')
                ->references('id_ubicacion')
                ->on('ubicaciones')
                ->onUpdate('cascade')
                ->onDelete('set null');

            $table->index('id_categoria');
            $table->index('id_proveedor');
            $table->index('id_ubicacion');
            $table->index('cantidad');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
