@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="card mt-5">
            <div class="card-header">
                <h3>Authorize "{{ $client->name }}"</h3>
            </div>
            <div class="card-body">
                <p>
                    <strong>{{ $client->name }}</strong> is requesting permission to access your account.
                </p>
                @if (count($scopes) > 0)
                    <div>
                        <p><strong>This application will be able to:</strong></p>
                        <ul>
                            @foreach ($scopes as $scope)
                                <li>{{ $scope->description }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif
                <form method="post" action="{{ route('passport.authorizations.approve') }}">
                    @csrf
                    <input type="hidden" name="state" value="{{ $request->state }}">
                    <input type="hidden" name="client_id" value="{{ $client->id }}">
                    <input type="hidden" name="auth_token" value="{{ $authToken }}">
                    <button class="btn btn-success" type="submit">Authorize</button>
                </form>
                <form method="post" action="{{ route('passport.authorizations.deny') }}" class="mt-2">
                    @csrf
                    <input type="hidden" name="state" value="{{ $request->state }}">
                    <input type="hidden" name="client_id" value="{{ $client->id }}">
                    <input type="hidden" name="auth_token" value="{{ $authToken }}">
                    <button class="btn btn-danger" type="submit">Cancel</button>
                </form>
            </div>
        </div>
    </div>
@endsection
