<?php

use App\Http\Controllers\OIDCController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Laravel\Passport\Http\Controllers\AccessTokenController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:api');

Route::get('/.well-known/openid-configuration', [OIDCController::class, 'discovery']);
Route::middleware('auth:api')->get('/userinfo', [OIDCController::class, 'userinfo']);
Route::get('/oauth/jwks', [OIDCController::class, 'jwks']);

Route::post('/oauth/token', [
    // 'middleware' => 'add.id_token',
    'uses' => AccessTokenController::class.'@issueToken',
]);

Route::post('/immrsa/auth/signup', function (Request $request) {
    $response = Http::post('https://backend.immrsa.io/api/immrsa/auth/signup', $request->all());

    if ($response->successful()) {
        // Create or update the user locally
        $data = $request->all();
        User::updateOrCreate(
            ['email' => $data['email']],
            [
                'name' => $data['firstName'].' '.$data['lastName'],
                'password' => Hash::make($data['password']), // Store a hash, even if not used
                'organization' => $data['companyName'] ?? null,
            ]
        );
    }

    return response()->json($response->json(), $response->status());
});

Route::post('/immrsa/auth/verify', function (Request $request) {
    $response = Http::post('https://backend.immrsa.io/api/immrsa/auth/verify', $request->all());

    return response()->json($response->json(), $response->status());
});

Route::post('/immrsa/auth/login', function (Request $request) {
    $response = Http::post('https://backend.immrsa.io/api/immrsa/auth/login', $request->all());

    if ($response->successful()) {
        $data = $response->json();
        $userData = $data['user'];
        $user = \App\Models\User::where('email', $userData['email'])->first();
        if ($user) {
            Auth::login($user);
        }
    }

    return response()->json($response->json(), $response->status());
});
