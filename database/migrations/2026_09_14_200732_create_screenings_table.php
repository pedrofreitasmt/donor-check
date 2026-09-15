<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('screenings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('donor_id')->constrained()->onDelete('cascade');

            // Requisitos básicos no momento da doação
            $table->integer('sleep_hours_last_24h'); // Estar descansado (mínimo 6 horas)
            $table->boolean('fatty_food_last_4h')->default(false); // Estar alimentado (evitar alimentação gordurosa)
            $table->boolean('alcohol_last_12h')->default(false); // Ingestão de bebida alcoólica

            // Impedimentos temporários gerais
            $table->date('cold_symptoms_end_date')->nullable(); // Resfriado: aguardar 7 dias após desaparecimento
            $table->date('last_tattoo_date')->nullable(); // Tatuagem/maquiagem definitiva: aguardar 12 meses
            $table->date('std_risk_date')->nullable(); // Risco de adquirir doenças sexualmente transmissíveis: aguardar 12 meses
            $table->date('last_endoscopy_date')->nullable(); // Procedimento endoscópico: aguardar 6 meses

            // Procedimentos Dentários
            $table->date('dental_procedure_date')->nullable();
            $table->string('dental_procedure_type')->nullable(); // extração ou canal - aguardar 7 dias

            // Impedimentos Temporários para Mulheres
            $table->boolean('is_pregnant')->default(false); // Gravidez
            $table->date('delivery_date')->nullable(); // Data do parto (verificar 90/180 dias ou 12 meses se amamentando)
            $table->string('delivery_type')->nullable(); // normal ou cesariana
            $table->boolean('is_breastfeeding')->default(false); // Amamentação
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('screenings');
    }
};
