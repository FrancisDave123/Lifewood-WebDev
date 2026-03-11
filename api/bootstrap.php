<?php
declare(strict_types=1);

function load_env(): void
{
    $envPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env';
    if (!is_readable($envPath)) {
        return;
    }

    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }

        if (!str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = array_map('trim', explode('=', $line, 2));
        if ($key === '') {
            continue;
        }

        $value = trim($value);
        if ((str_starts_with($value, '"') && str_ends_with($value, '"')) || (str_starts_with($value, "'") && str_ends_with($value, "'"))) {
            $value = substr($value, 1, -1);
        }

        putenv($key . '=' . $value);
        $_ENV[$key] = $value;
    }
}

function json_response(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');
    echo json_encode($payload);
    exit;
}

function get_json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function get_allowed_origins(): array
{
    $raw = getenv('ALLOWED_ORIGINS') ?: '';
    if ($raw === '') {
        return [];
    }

    return array_values(array_filter(array_map('trim', explode(',', $raw))));
}

function is_same_origin(string $origin): bool
{
    if ($origin === '') {
        return true;
    }

    $originParts = parse_url($origin);
    if (!is_array($originParts) || empty($originParts['host'])) {
        return false;
    }

    $currentHost = $_SERVER['HTTP_HOST'] ?? '';
    if ($currentHost === '') {
        return false;
    }

    $originHost = $originParts['host'];
    $originPort = $originParts['port'] ?? null;
    $currentParts = parse_url(((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://') . $currentHost);
    $currentPort = $currentParts['port'] ?? null;

    if ($originHost !== ($currentParts['host'] ?? '')) {
        return false;
    }

    if ($originPort === null && $currentPort === null) {
        return true;
    }

    return (int) ($originPort ?? 0) === (int) ($currentPort ?? 0);
}

function cors_bootstrap(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowedOrigins = get_allowed_origins();
    $isAllowed = $origin === '' ? true : (in_array($origin, $allowedOrigins, true) || is_same_origin($origin));

    if ($origin !== '' && $isAllowed) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Credentials: true');
    }

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        if ($origin !== '' && !$isAllowed) {
            json_response(403, ['ok' => false, 'message' => 'Origin not allowed.']);
        }

        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        http_response_code(204);
        exit;
    }

    if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH', 'DELETE'], true) && $origin !== '' && !$isAllowed) {
        json_response(403, ['ok' => false, 'message' => 'Origin not allowed.']);
    }
}

function start_secure_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');

    $secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_start();
}

load_env();
