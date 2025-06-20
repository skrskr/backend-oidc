<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class OIDCController extends Controller
{
    public function discovery(Request $request)
    {
        $baseUrl = Config::get('app.url');

        return response()->json([
            'issuer' => $baseUrl,
            'authorization_endpoint' => $baseUrl.'/oauth/authorize',
            'token_endpoint' => $baseUrl.'/oauth/token',
            'userinfo_endpoint' => $baseUrl.'/api/userinfo',
            'jwks_uri' => $baseUrl.'/oauth/jwks',
            'response_types_supported' => ['code', 'token', 'id_token', 'code token', 'code id_token'],
            'subject_types_supported' => ['public'],
            'id_token_signing_alg_values_supported' => ['RS256'],
            'scopes_supported' => ['openid', 'profile', 'email'],
            'token_endpoint_auth_methods_supported' => ['client_secret_basic', 'client_secret_post'],
            'claims_supported' => ['sub', 'name', 'email'],
        ]);
    }

    public function userinfo(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'sub' => (string) $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'organization' => $user->organization,
        ]);
    }

    public function jwks()
    {
        // Load the public key
        $publicKeyPath = base_path('storage/oauth-public.key');
        $publicKey = file_get_contents($publicKeyPath);

        // Extract modulus and exponent from the public key
        $details = openssl_pkey_get_details(openssl_pkey_get_public($publicKey));
        $n = isset($details['rsa']['n']) ? rtrim(strtr(base64_encode($details['rsa']['n']), '+/', '-_'), '=') : '';
        $e = isset($details['rsa']['e']) ? rtrim(strtr(base64_encode($details['rsa']['e']), '+/', '-_'), '=') : '';

        return response()->json([
            'keys' => [
                [
                    'kty' => 'RSA',
                    'use' => 'sig',
                    'kid' => '1',
                    'alg' => 'RS256',
                    'n' => $n,
                    'e' => $e,
                ],
            ],
        ]);
    }
}
