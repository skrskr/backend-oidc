<?php

use App\Http\Controllers\OIDCController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Passport\Http\Controllers\AccessTokenController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:api');

// Route::get('/.well-known/openid-configuration', [OIDCController::class, 'discovery']);
// Route::middleware('auth:api')->get('/userinfo', [OIDCController::class, 'userinfo']);
// Route::get('/oauth/jwks', [OIDCController::class, 'jwks']);

Route::post('/oauth/token', [
    'middleware' => 'add.id_token',
    'uses' => AccessTokenController::class.'@issueToken',
]);
