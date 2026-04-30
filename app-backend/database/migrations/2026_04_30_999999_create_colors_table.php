<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('phone_colors', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('colorId');
            $table->unsignedBigInteger('phoneId');
            $table->integer('quantity');
            $table->foreign('colorId')->references('id')->on('colors')->onDelete('cascade');
            $table->foreign('phoneId')->references('id')->on('phones')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('phone_colors');
    }
};
