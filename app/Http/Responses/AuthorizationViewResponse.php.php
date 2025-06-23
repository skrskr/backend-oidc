<?php

namespace App\Http\Responses;

use Laravel\Passport\Contracts\AuthorizationViewResponse as AuthorizationViewResponseContract;
use Illuminate\Http\Request;

class AuthorizationViewResponse implements AuthorizationViewResponseContract
{
    protected array $parameters = [];

    public function withParameters($parameters = []): static
    {
        $this->parameters = $parameters;

        return $this;
    }

    public function toResponse($request)
    {
        return view('vendor.passport.authorize', array_merge([
            'client' => $request->attributes->get('client'),
            'user' => $request->user(),
            'scopes' => $request->attributes->get('scopes'),
            'request' => $request,
        ], $this->parameters));
    }
}

