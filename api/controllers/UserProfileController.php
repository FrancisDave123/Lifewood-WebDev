<?php
declare(strict_types=1);

require_once __DIR__ . '/../lib/SupabaseClient.php';

class UserProfileController
{
    public function handle(): void
    {
        start_secure_session();

        $userId = $_SESSION['admin_user_id'] ?? null;
        if ($userId === null) {
            json_response(401, ['ok' => false, 'message' => 'Not authenticated.']);
        }

        $supabaseUrl = env_value('SUPABASE_URL');
        $serviceKey = env_value('SUPABASE_SERVICE_ROLE_KEY');

        if ($supabaseUrl === '' || $serviceKey === '') {
            json_response(500, ['ok' => false, 'message' => 'Supabase credentials are missing.']);
        }

        $client = new SupabaseClient($supabaseUrl, $serviceKey);
        $response = $client->get('/rest/v1/user_accounts', [
            'select' => 'id,email,first_name,last_name,middle_name,role_id,roles(name)',
            'id' => 'eq.' . $userId,
            'limit' => '1',
        ]);

        if ($response['status'] >= 400) {
            json_response(500, ['ok' => false, 'message' => 'Unable to query user records.']);
        }

        $data = $response['data'];
        if (!is_array($data) || count($data) === 0) {
            json_response(404, ['ok' => false, 'message' => 'Profile not found.']);
        }

        $user = $data[0];
        $roleName = $this->extractRoleName($user['roles'] ?? null);

        json_response(200, [
            'ok' => true,
            'data' => [
                'id' => $user['id'] ?? null,
                'email' => $user['email'] ?? null,
                'first_name' => $user['first_name'] ?? null,
                'last_name' => $user['last_name'] ?? null,
                'middle_name' => $user['middle_name'] ?? null,
                'role_id' => $user['role_id'] ?? null,
                'role_name' => $roleName,
            ],
        ]);
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
}
