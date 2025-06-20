<?php

return [
    'issuer' => env('APP_URL'), // e.g., https://app.onlinecheckwriter.com

    'claims' => [
        'sub'   => 'id',
        'email' => 'email',
        'name'  => 'name',
    ],
];