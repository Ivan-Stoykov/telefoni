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
        Schema::create('colors', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('colorId');
            $table->unsignedBigInteger('PhoneId');
            $table->foreign('colorId')->references('id')->on('color')->onDelete('cascade');
            $table->foreign('PhoneId')->references('id')->on('phone')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('colors');
    }
};
