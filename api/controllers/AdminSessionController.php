<?php
declare(strict_types=1);

class AdminSessionController
{
    public function handle(): void
    {
        start_secure_session();

        if (!$this->hasSession()) {
            json_response(401, ['ok' => false, 'message' => 'Not authenticated.']);
        }

        json_response(200, [
            'ok' => true,
            'data' => [
                'email' => (string) ($_SESSION['admin_email'] ?? ''),
                'role_id' => (int) ($_SESSION['admin_role_id'] ?? 0),
                'role_name' => $_SESSION['admin_role_name'] ?? null,
            ],
        ]);
    }

    public function logout(): void
    {
        start_secure_session();
        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
        }

        session_destroy();
        json_response(200, ['ok' => true]);
    }

    private function hasSession(): bool
    {
        return isset($_SESSION['admin_user_id'], $_SESSION['admin_email'], $_SESSION['admin_role_id']);
    }
}
