<?php
declare(strict_types=1);

require_once __DIR__ . '/../lib/SupabaseClient.php';

class UserLoginController
{
    private const MAX_EMAIL_LENGTH = 254;
    private const MAX_PASSWORD_LENGTH = 256;
    private const RATE_LIMIT_WINDOW = 600;
    private const RATE_LIMIT_ATTEMPTS = 10;

    public function handle(array $input): void
    {
        $email = strtolower(trim((string) ($input['email'] ?? '')));
        $password = (string) ($input['password'] ?? '');

        if ($email === '' || $password === '') {
            json_response(422, ['ok' => false, 'message' => 'Email and password are required.']);
        }

        if (strlen($email) > self::MAX_EMAIL_LENGTH || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            json_response(422, ['ok' => false, 'message' => 'Invalid email format.']);
        }

        if (strlen($password) > self::MAX_PASSWORD_LENGTH) {
            json_response(422, ['ok' => false, 'message' => 'Invalid password format.']);
        }

        start_secure_session();
        $this->enforceRateLimit();

        $user = $this->fetchUserByEmail($email);
        if ($user === null || !$this->verifyPassword($password, $user['password'] ?? null)) {
            $this->registerFailedAttempt();
            json_response(401, ['ok' => false, 'message' => 'Invalid credentials.']);
        }

        session_regenerate_id(true);
        $_SESSION['admin_user_id'] = $user['id'];
        $_SESSION['admin_email'] = $user['email'];
        $_SESSION['admin_role_id'] = (int) $user['role_id'];
        $_SESSION['admin_role_name'] = (string) ($user['role_name'] ?? '');
        $_SESSION['admin_logged_in_at'] = time();

        json_response(200, [
            'ok' => true,
            'data' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'role_id' => (int) $user['role_id'],
                'role_name' => $user['role_name'] ?? null,
            ],
        ]);
    }

    private function enforceRateLimit(): void
    {
        $now = time();
        $attempts = $_SESSION['login_attempts'] ?? ['count' => 0, 'first' => $now];

        if (!is_array($attempts)) {
            $attempts = ['count' => 0, 'first' => $now];
        }

        if (($now - (int) $attempts['first']) > self::RATE_LIMIT_WINDOW) {
            $attempts = ['count' => 0, 'first' => $now];
        }

        if ((int) $attempts['count'] >= self::RATE_LIMIT_ATTEMPTS) {
            json_response(429, ['ok' => false, 'message' => 'Too many login attempts. Try again later.']);
        }

        $_SESSION['login_attempts'] = $attempts;
    }

    private function registerFailedAttempt(): void
    {
        $attempts = $_SESSION['login_attempts'] ?? ['count' => 0, 'first' => time()];
        if (!is_array($attempts)) {
            $attempts = ['count' => 0, 'first' => time()];
        }

        $attempts['count'] = (int) ($attempts['count'] ?? 0) + 1;
        $_SESSION['login_attempts'] = $attempts;
    }

    private function fetchUserByEmail(string $email): ?array
    {
        $supabaseUrl = getenv('SUPABASE_URL') ?: '';
        $serviceKey = getenv('SUPABASE_SERVICE_ROLE_KEY') ?: '';

        if ($supabaseUrl === '' || $serviceKey === '') {
            json_response(500, ['ok' => false, 'message' => 'Supabase credentials are missing.']);
        }

        $client = new SupabaseClient($supabaseUrl, $serviceKey);
        $response = $client->get('/rest/v1/user_accounts', [
            'select' => 'id,email,password,role_id,roles(name)',
            'email' => 'eq.' . $email,
            'limit' => '1',
        ]);

        if ($response['status'] >= 400) {
            json_response(500, ['ok' => false, 'message' => 'Unable to query user records.']);
        }

        $data = $response['data'];
        if (!is_array($data) || count($data) === 0) {
            return null;
        }

        $user = $data[0];
        $user['role_name'] = $this->extractRoleName($user['roles'] ?? null);
        return $user;
    }

    private function extractRoleName(mixed $roles): ?string
    {
        if (is_array($roles)) {
            if (isset($roles['name']) && is_string($roles['name'])) {
                return $roles['name'];
            }
            if (isset($roles[0]['name']) && is_string($roles[0]['name'])) {
                return $roles[0]['name'];
            }
        }
        return null;
    }

    private function verifyPassword(string $password, ?string $stored): bool
    {
        if ($stored === null || $stored === '') {
            return false;
        }

        if (str_starts_with($stored, '$2y$') || str_starts_with($stored, '$argon2')) {
            return password_verify($password, $stored);
        }

        return false;
    }
}
