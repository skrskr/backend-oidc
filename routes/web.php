<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\OIDCController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::get('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');

Route::get('/.well-known/openid-configuration', [OIDCController::class, 'discovery']);
Route::middleware('auth:api')->get('/userinfo', [OIDCController::class, 'userinfo']);
Route::get('/oauth/jwks', [OIDCController::class, 'jwks']);
