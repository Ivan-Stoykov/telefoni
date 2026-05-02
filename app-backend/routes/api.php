<?php

use App\Http\Controllers\PhoneController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CheckoutController;

// Auth
Route::post('login', [AuthController::class, 'login']);
Route::post('signup', [AuthController::class, 'signup']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Phones
Route::apiResource('phones', PhoneController::class);

// Users
Route::get('/users', [AdminController::class, 'usersList']);
Route::get('/users/{id}', [AdminController::class, 'user']);
Route::put('/users/{id}', [AdminController::class, 'updateUser']);
Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);

// Orders
Route::get('/orders', [AdminController::class, 'ordersList']);
Route::get('/orders/{id}', [AdminController::class, 'order']);
Route::put('/orders/{id}', [AdminController::class, 'updateOrder']);
Route::delete('/orders/{id}', [AdminController::class, 'deleteOrder']);

// Checkout
Route::post('/checkout', [CheckoutController::class, 'store']);