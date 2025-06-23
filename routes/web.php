<?php

use App\Http\Controllers\ProfileController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/verify-company', function () {
    return Inertia::render('Auth/VerifyEmail');
})->name('verify.company');

Route::post('/immrsa/auth/login', function (Illuminate\Http\Request $request) {
    $response = Http::post('https://backend.immrsa.io/api/immrsa/auth/login', $request->except(['_token']));

    if ($response->successful()) {
        $data = $response->json();
        $userData = $data['user'];
        $user = User::updateOrCreate(
            ['email' => $userData['email']],
            [
                'name' => $userData['firstName'].' '.$userData['lastName'],
                'password' => Hash::make($request->password),
                'organization' => $data['company']['name'] ?? null,
            ]
        );
        Auth::login($user);
        // Rebuild OIDC params for redirect
        $oidcParams = http_build_query($request->query());

        return redirect('/oauth/authorize?'.$oidcParams);
    }

    return back()->withErrors(['login' => 'Login failed']);
});

require __DIR__.'/auth.php';
