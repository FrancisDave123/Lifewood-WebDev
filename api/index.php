<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/controllers/UserLoginController.php';
require_once __DIR__ . '/controllers/AdminSessionController.php';
require_once __DIR__ . '/controllers/UserProfileController.php';

cors_bootstrap();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
$scriptDir = rtrim(dirname($_SERVER['SCRIPT_NAME'] ?? '/'), '/');

if ($scriptDir !== '' && str_starts_with($path, $scriptDir)) {
    $path = substr($path, strlen($scriptDir));
}

$path = '/' . ltrim($path, '/');

if ($path === '/' && $method === 'GET') {
    json_response(200, ['ok' => true, 'message' => 'API online.']);
}

if ($path === '/login' && $method === 'POST') {
    $input = get_json_input();
    (new UserLoginController())->handle($input);
}

if ($path === '/auth/session' && $method === 'GET') {
    (new AdminSessionController())->handle();
}

if ($path === '/auth/profile' && $method === 'GET') {
    (new UserProfileController())->handle();
}

if ($path === '/auth/logout' && $method === 'POST') {
    (new AdminSessionController())->logout();
}

json_response(404, ['ok' => false, 'message' => 'Endpoint not found.']);
