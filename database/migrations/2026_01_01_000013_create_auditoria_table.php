<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('auditoria', function (Blueprint $table) {
            $table->increments('id_auditoria');
            $table->unsignedInteger('id_usuario');
            $table->string('accion', 80);
            $table->string('modulo', 60);
            $table->text('detalle')->nullable();
            $table->dateTime('fecha')->useCurrent();

            $table->foreign('id_usuario')
                ->references('id_usuario')
                ->on('usuarios')
                ->onUpdate('cascade')
                ->onDelete('restrict');

            $table->index('id_usuario');
            $table->index('modulo');
            $table->index('fecha');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auditoria');
    }
};
