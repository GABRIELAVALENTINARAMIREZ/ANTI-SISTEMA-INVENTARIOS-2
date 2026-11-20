<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('id_usuario');
            $table->string('nombre', 100);
            $table->string('token', 64)->unique();
            $table->json('habilidades')->nullable();
            $table->dateTime('ultimo_uso')->nullable();
            $table->dateTime('expira_en')->nullable();
            $table->timestamp('creado_en')->useCurrent();

            $table->foreign('id_usuario')
                ->references('id_usuario')
                ->on('usuarios')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->index('id_usuario');
            $table->index('token');
            $table->index('expira_en');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
    }
};
