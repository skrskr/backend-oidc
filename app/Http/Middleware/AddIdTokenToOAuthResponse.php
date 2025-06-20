<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Illuminate\Http\Request;

class AddIdTokenToOAuthResponse
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Only add id_token for /oauth/token and successful response
        if ($request->is('oauth/token') && $response->getStatusCode() === 200) {
            $data = $response->getData(true);

            // Only for grant_type=authorization_code or password
            if (in_array($request->input('grant_type'), ['authorization_code', 'password'])) {
                // Get the user (for password grant, username is email)
                $user = null;
                if ($request->input('grant_type') === 'password') {
                    $user = \App\Models\User::where('email', $request->input('username'))->first();
                }
                // For authorization_code grant, you may need to decode the access token to get the user
                // This is a simplified version for password grant

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
                        'organization' => $user->organization,
                    ];
                    $id_token = JWT::encode($payload, $privateKey, 'RS256');
                    $data['id_token'] = $id_token;
                    $response->setData($data);
                }
            }
        }

        return $response;
    }
}
