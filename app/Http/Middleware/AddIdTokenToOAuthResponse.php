<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AddIdTokenToOAuthResponse
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->is('oauth/token')) {
            Log::info('OAuth Token Request Details:', $request->all());
        }

        $response = $next($request);

        // Only add id_token for /oauth/token and successful response
        if ($request->is('oauth/token') && $response->getStatusCode() === 200) {
            $data = $response->getData(true);

            // Only for grant_type=authorization_code or password
            if (in_array($request->input('grant_type'), ['authorization_code', 'password'])) {
                $user = null;

                if ($request->input('grant_type') === 'password') {
                    $user = \App\Models\User::where('email', $request->input('username'))->first();
                } elseif ($request->input('grant_type') === 'authorization_code' && isset($data['access_token'])) {
                    // Decode JWT access token to get user_id
                    $accessToken = $data['access_token'];
                    $parts = explode('.', $accessToken);
                    if (count($parts) === 3) {
                        $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);
                        if (isset($payload['sub'])) {
                            $user = \App\Models\User::find($payload['sub']);
                        }
                    }
                }

                if ($user) {
                    $privateKey = file_get_contents(storage_path('oauth-private.key'));
                    $payload = [
                        'iss' => config('app.url'),
                        'sub' => $user->id,
                        'aud' => $request->input('client_id'),
                        'exp' => time() + 3600,
                        'iat' => time(),
                        'email' => $user->email,
                        'name' => $user->name,
                        'given_name' => $user->name,
                        'family_name' => '',
                        'preferred_username' => $user->name,
                        'organization' => $user->organization,
                    ];
                    $id_token = JWT::encode($payload, $privateKey, 'RS256');
                    $data['id_token'] = $id_token;
                    $response->setData($data);
                }
            }
        }

        if ($request->is('oauth/token') && $response->getStatusCode() !== 200) {
            Log::error('OAuth Token Error Response:', [
                'status' => $response->getStatusCode(),
                'content' => json_decode($response->getContent(), true),
            ]);
        }

        return $response;
    }
}
