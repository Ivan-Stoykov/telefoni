<?php

use App\Http\Controllers\PhoneController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CheckoutController;

Route::post('login', [AuthController::class, 'login']);
Route::post('signup', [AuthController::class, 'signup']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::apiResource('phones', PhoneController::class);
Route::get('/users', [AdminController::class, 'usersList']);
Route::get('/users/{id}', [AdminController::class, 'user']);
Route::post('/checkout', [CheckoutController::class, 'store']);