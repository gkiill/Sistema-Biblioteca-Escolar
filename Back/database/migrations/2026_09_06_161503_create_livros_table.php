<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('livros', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('isbn')->unique();
            $table->integer('ano_publicacao')->nullable();
            $table->text('sinopse')->nullable();
            $table->string('capa_url')->nullable();
            $table->integer('quantidade')->default(1);
            $table->foreignId('autor_id')->constrained('autores')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('livros');
    }
};