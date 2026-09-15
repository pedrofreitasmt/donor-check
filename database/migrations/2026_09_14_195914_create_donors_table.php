<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donors', function (Blueprint $table) {
            $table->id();

            // Dados Pessoais
            $table->string('name');
            $table->date('birth_date'); // Para validar idade (16 a 69)
            $table->string('gender'); // Importante para regras de gravidez
            $table->decimal('weight', 5, 2); // Para validar mínimo de 50kg

            // Documento de Identificação Oficial com Foto
            $table->string('document_type'); // Ex: 'RG', 'CNH', 'CTPS'
            $table->string('document_number')->unique();

            // Histórico
            $table->date('first_donation_date')->nullable(); // Para validar doações após os 60 anos

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donors');
    }
};
