<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name', 'Laravel') }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div class="container">
            <a class="navbar-brand" href="/">{{ config('app.name', 'Laravel') }}</a>
            @auth
                <a href="/dashboard" class="btn btn-outline-primary me-2">Dashboard</a>
                <a href="{{ route('logout') }}" class="btn btn-outline-danger">Logout</a>
            @endauth
        </div>
    </nav>
    <main>
        @yield('content')
    </main>
</body>

</html>
