<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notificaciones', function (Blueprint $table) {
            $table->increments('id_notificacion');
            $table->string('titulo', 120);
            $table->string('mensaje', 255);
            $table->enum('severidad', ['critica', 'advertencia', 'info'])->default('info');
            $table->boolean('leida')->default(false);
            $table->dateTime('creada_en')->useCurrent();

            $table->index('leida');
            $table->index('severidad');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notificaciones');
    }
};
