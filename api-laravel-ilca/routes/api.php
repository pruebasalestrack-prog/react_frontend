<?php

use Illuminate\Support\Facades\Route;
//use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\Auth\ResetPasswordController;


//use App\Http\Controllers\Api\Auth\ForgotPasswordController;


// Route::get('/', function () {
//     return view('welcome');
// });
//Route::get('/csrf-token', function () {
//    return response()->json(['token' => csrf_token()]);
//});

//Route::post('/pruebarequest',[LoginController::class, 'pruebarequest']);

Route::post('/login', [LoginController::class, 'login']); //REQUIERE EMAIL PASSWORD Y FLAG INICIO SESION 
Route::post('/logout', [LoginController::class, 'logout']); //REQUIERE ID Y TOKEN
Route::post('/forgot-password', [ForgotPasswordController::class, 'forgotPassword']);
Route::post('/reset-password', [ResetPasswordController::class, 'resetPassword']);

// En routes/web.php

