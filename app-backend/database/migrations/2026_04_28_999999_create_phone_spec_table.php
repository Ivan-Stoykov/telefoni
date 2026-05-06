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
        Schema::create('phone_specs', function (Blueprint $table) {
            $table->id();
            $table->text('description')->nullable();
            $table->string('imageUrl')->nullable();
            $table->string('specName')->nullable();
            $table->text('mainCamera')->nullable();
            $table->string('MCFeatures')->nullable();
            $table->string('MCVideo')->nullable();
            $table->string('SelfieCamera')->nullable();
            $table->string('SCFeatures')->nullable();
            $table->string('SCVideo')->nullable();
            $table->string('Wifi')->nullable();
            $table->string('Bluetooth')->nullable();
            $table->string('Port')->nullable();
            $table->boolean('NFC')->nullable();
            $table->string('Positioning')->nullable();
            $table->string('Display')->nullable();
            $table->string('ScreenSize')->nullable();
            $table->string('ScreenResolution')->nullable();
            $table->string('ScreenType')->nullable();
            $table->string('Protection')->nullable();
            $table->string('Speakers')->nullable();
            $table->string('ModelNumber')->nullable();
            $table->string('Series')->nullable();
            $table->string('Dimensions')->nullable();
            $table->string('Weight')->nullable();
            $table->string('OS')->nullable();
            $table->string('Battery')->nullable();
            $table->string('Charging')->nullable();
            $table->unsignedBigInteger('processorId');
            $table->foreign('processorId')->references('id')->on('processors')->onDelete('cascade');
            $table->unsignedBigInteger('brandId');
            $table->foreign('brandId')->references('id')->on('brands')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('phone_specs');
    }
};
