<?php
declare(strict_types=1);

require_once __DIR__ . '/../lib/SupabaseClient.php';

class ApplicantsController
{
    public function create(array $input): void
    {
        $this->blockAdminSubmission();
        $client = $this->createClient();

        $requestData = $this->extractRequestData($input);
        $firstName = trim((string) ($requestData['first_name'] ?? ''));
        $lastName = trim((string) ($requestData['last_name'] ?? ''));
        $middleName = isset($requestData['middle_name']) ? trim((string) $requestData['middle_name']) : null;
        $gender = trim((string) ($requestData['gender'] ?? ''));
        $age = isset($requestData['age']) ? (int) $requestData['age'] : 0;
        $phoneNumber = trim((string) ($requestData['phone_number'] ?? ''));
        $email = trim((string) ($requestData['email'] ?? ''));
        $positionApplied = trim((string) ($requestData['position_applied'] ?? ''));
        $country = trim((string) ($requestData['country'] ?? ''));
        $currentAddress = trim((string) ($requestData['current_address'] ?? ''));
        $schoolName = isset($requestData['school_name']) ? trim((string) $requestData['school_name']) : '';
        $designationName = trim((string) ($requestData['designation_name'] ?? ''));
        $uploadedCv = !empty($requestData['uploaded_cv']);
        $fileInfo = $this->extractCvFile();

        if ($firstName === '' || $lastName === '' || $gender === '' || $age <= 0 || $phoneNumber === '' || $email === '' || $positionApplied === '' || $country === '' || $currentAddress === '' || $designationName === '') {
            json_response(400, ['ok' => false, 'message' => 'Missing required applicant fields.']);
        }

        $duplicateFlags = $this->checkDuplicateContact($client, $phoneNumber, $email);
        if ($duplicateFlags['phone'] && $duplicateFlags['email']) {
            json_response(409, ['ok' => false, 'message' => 'An applicant with this phone number and email already exists.']);
        }
        if ($duplicateFlags['phone']) {
            json_response(409, ['ok' => false, 'message' => 'An applicant with this phone number already exists.']);
        }
        if ($duplicateFlags['email']) {
            json_response(409, ['ok' => false, 'message' => 'An applicant with this email already exists.']);
        }

        $statusMap = $this->loadStatusMap($client);
        if (!isset($statusMap['rejected'])) {
            json_response(500, ['ok' => false, 'message' => 'Default status is missing.']);
        }

        $designationMap = $this->loadDesignationMap($client);
        if (!isset($designationMap[$designationName])) {
            json_response(400, ['ok' => false, 'message' => 'Invalid designation.']);
        }

        if ($designationName === 'intern' && trim($schoolName) === '') {
            json_response(400, ['ok' => false, 'message' => 'School is required for intern applicants.']);
        }

        $schoolId = $this->resolveSchoolId($client, $schoolName);
        if (trim($schoolName) !== '' && $schoolId === null) {
            json_response(422, ['ok' => false, 'message' => 'School is not recognized. Please select an existing school.']);
        }
        $applicantId = $this->generateUuidV4();
        $cvPath = null;
        if ($fileInfo !== null) {
            $cvPath = $this->uploadCvFile($client, $fileInfo, $applicantId);
            $uploadedCv = true;
        }
        $payload = [
            'id' => $applicantId,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'gender' => $gender,
            'age' => $age,
            'phone_number' => $phoneNumber,
            'email' => $email,
            'position_applied' => $positionApplied,
            'country' => $country,
            'current_address' => $currentAddress,
            'uploaded_cv' => $uploadedCv,
            'status_id' => $statusMap['rejected'],
            'designation_id' => $designationMap[$designationName],
            'new_applicant_status' => true,
        ];

        if ($middleName !== null && $middleName !== '') {
            $payload['middle_name'] = $middleName;
        }

        if ($schoolId !== null) {
            $payload['school_id'] = $schoolId;
        }

        if ($cvPath !== null) {
            $payload['cv_path'] = $cvPath;
        }

        $response = $client->request('POST', '/rest/v1/applicants', [], $payload);

        if ($response['status'] >= 400) {
            json_response(500, ['ok' => false, 'message' => 'Unable to create applicant record.']);
        }

        json_response(201, ['ok' => true]);
    }

    public function list(): void
    {
        $this->requireAdmin();
        $client = $this->createClient();

        $response = $client->get('/rest/v1/applicants', [
            'select' => 'id,first_name,last_name,middle_name,gender,age,phone_number,email,position_applied,country,current_address,uploaded_cv,cv_path,status_id,school_id,new_applicant_status,created_at,applicant_statuses(status_name),schools(school_name)',
            'order' => 'created_at.desc',
        ]);

        if ($response['status'] >= 400) {
            json_response(500, ['ok' => false, 'message' => 'Unable to query applicant records.']);
        }

        $rows = is_array($response['data']) ? $response['data'] : [];
        $normalized = array_map(function (array $row): array {
            return [
                'id' => $row['id'] ?? null,
                'first_name' => $row['first_name'] ?? null,
                'last_name' => $row['last_name'] ?? null,
                'middle_name' => $row['middle_name'] ?? null,
                'gender' => $row['gender'] ?? null,
                'age' => $row['age'] ?? null,
                'phone_number' => $row['phone_number'] ?? null,
                'email' => $row['email'] ?? null,
                'position_applied' => $row['position_applied'] ?? null,
                'country' => $row['country'] ?? null,
                'current_address' => $row['current_address'] ?? null,
                'uploaded_cv' => $row['uploaded_cv'] ?? false,
                'cv_path' => $row['cv_path'] ?? null,
                'status_id' => $row['status_id'] ?? null,
                'school_id' => $row['school_id'] ?? null,
                'new_applicant_status' => $row['new_applicant_status'] ?? false,
                'created_at' => $row['created_at'] ?? null,
                'status_name' => $this->extractRelationValue($row['applicant_statuses'] ?? null, 'status_name'),
                'school_name' => $this->extractRelationValue($row['schools'] ?? null, 'school_name'),
            ];
        }, $rows);

        json_response(200, [
            'ok' => true,
            'data' => [
                'applicants' => $normalized,
            ],
        ]);
    }

    public function getCvUrl(): void
    {
        $this->requireAdmin();
        $applicantId = isset($_GET['applicant_id']) ? trim((string) $_GET['applicant_id']) : '';
        if ($applicantId === '') {
            json_response(400, ['ok' => false, 'message' => 'Applicant ID is required.']);
        }

        $client = $this->createClient();
        $response = $client->get('/rest/v1/applicants', [
            'select' => 'cv_path',
            'id' => 'eq.' . $applicantId,
            'limit' => '1',
        ]);

        if ($response['status'] >= 400) {
            json_response(500, ['ok' => false, 'message' => 'Unable to fetch applicant CV.']);
        }

        $rows = is_array($response['data']) ? $response['data'] : [];
        if (count($rows) === 0) {
            json_response(404, ['ok' => false, 'message' => 'Applicant not found.']);
        }

        $cvPath = $rows[0]['cv_path'] ?? null;
        if (!is_string($cvPath) || trim($cvPath) === '') {
            json_response(404, ['ok' => false, 'message' => 'CV not available.']);
        }

        $signed = $client->createSignedUrl('applicant-cvs', $cvPath, 900);
        if ($signed['status'] >= 400) {
            json_response(500, ['ok' => false, 'message' => 'Unable to generate CV link.']);
        }

        $signedUrl = null;
        if (is_array($signed['data']) && isset($signed['data']['signedURL'])) {
            $signedUrl = (string) $signed['data']['signedURL'];
        } elseif (is_array($signed['data']) && isset($signed['data']['signedUrl'])) {
            $signedUrl = (string) $signed['data']['signedUrl'];
        }

        if ($signedUrl === null || $signedUrl === '') {
            json_response(500, ['ok' => false, 'message' => 'Unable to generate CV link.']);
        }

        if (!str_starts_with($signedUrl, 'http')) {
            $supabaseUrl = env_value('SUPABASE_URL');
            $signedUrl = rtrim($supabaseUrl, '/') . '/storage/v1/' . ltrim($signedUrl, '/');
        }

        json_response(200, [
            'ok' => true,
            'data' => [
                'url' => $signedUrl,
            ],
        ]);
    }

    public function summary(): void
    {
        $this->requireAdmin();
        $client = $this->createClient();

        $statusMap = $this->loadStatusMap($client);

        $response = $client->get('/rest/v1/applicants', [
            'select' => 'id,status_id',
        ]);

        if ($response['status'] >= 400) {
            json_response(500, ['ok' => false, 'message' => 'Unable to query applicant summary.']);
        }

        $rows = is_array($response['data']) ? $response['data'] : [];
        $hiredCount = 0;
        $rejectedCount = 0;

        foreach ($rows as $row) {
            $statusId = isset($row['status_id']) ? (int) $row['status_id'] : 0;
            if ($statusId !== 0 && isset($statusMap['hired']) && $statusId === $statusMap['hired']) {
                $hiredCount += 1;
            }

            if ($statusId !== 0 && isset($statusMap['rejected']) && $statusId === $statusMap['rejected']) {
                $rejectedCount += 1;
            }
        }

        json_response(200, [
            'ok' => true,
            'data' => [
                'hired' => $hiredCount,
                'rejected' => $rejectedCount,
            ],
        ]);
    }

    public function listSchools(): void
    {
        $client = $this->createClient();
        $response = $client->get('/rest/v1/schools', [
            'select' => 'id,school_name',
            'order' => 'school_name.asc',
        ]);

        if ($response['status'] >= 400) {
            json_response(500, ['ok' => false, 'message' => 'Unable to fetch schools.']);
        }

        $rows = is_array($response['data']) ? $response['data'] : [];
        $schools = array_map(function (array $row): array {
            return [
                'id' => $row['id'] ?? null,
                'school_name' => $row['school_name'] ?? null,
            ];
        }, $rows);

        json_response(200, [
            'ok' => true,
            'data' => [
                'schools' => $schools,
            ],
        ]);
    }

    public function delete(array $input): void
    {
        $this->requireAdmin();
        $ids = $input['ids'] ?? null;
        if (!is_array($ids) || count($ids) === 0) {
            json_response(400, ['ok' => false, 'message' => 'Applicant IDs are required.']);
        }

        $filtered = array_values(array_filter(array_map('strval', $ids), fn (string $id) => $id !== ''));
        if (count($filtered) === 0) {
            json_response(400, ['ok' => false, 'message' => 'Applicant IDs are required.']);
        }

        $client = $this->createClient();
        $idList = implode(',', $filtered);
        $response = $client->request('DELETE', '/rest/v1/applicants', [
            'id' => 'in.(' . $idList . ')',
        ]);

        if ($response['status'] >= 400) {
            json_response(500, ['ok' => false, 'message' => 'Unable to delete applicants.']);
        }

        json_response(200, ['ok' => true]);
    }

    public function updateStatus(array $input): void
    {
        $this->requireAdmin();
        $applicantId = isset($input['applicant_id']) ? trim((string) $input['applicant_id']) : '';
        $statusName = isset($input['status_name']) ? strtolower(trim((string) $input['status_name'])) : '';
        $newApplicantStatus = array_key_exists('new_applicant_status', $input)
            ? (bool) $input['new_applicant_status']
            : false;

        if ($applicantId === '' || $statusName === '') {
            json_response(400, ['ok' => false, 'message' => 'Applicant ID and status name are required.']);
        }

        $client = $this->createClient();
        $statusMap = $this->loadStatusMap($client);

        if (!isset($statusMap[$statusName])) {
            json_response(400, ['ok' => false, 'message' => 'Invalid status name.']);
        }

        $response = $client->request('PATCH', '/rest/v1/applicants', [
            'id' => 'eq.' . $applicantId,
        ], [
            'status_id' => $statusMap[$statusName],
            'new_applicant_status' => $newApplicantStatus,
        ]);

        if ($response['status'] >= 400) {
            json_response(500, ['ok' => false, 'message' => 'Unable to update applicant status.']);
        }

        json_response(200, ['ok' => true]);
    }

    private function requireAdmin(): void
    {
        start_secure_session();

        $roleId = $_SESSION['admin_role_id'] ?? null;
        if (!isset($_SESSION['admin_user_id'], $roleId)) {
            json_response(401, ['ok' => false, 'message' => 'Not authenticated.']);
        }

        if ((int) $roleId !== 1) {
            json_response(403, ['ok' => false, 'message' => 'Admin access required.']);
        }
    }

    private function blockAdminSubmission(): void
    {
        start_secure_session();
        $roleId = $_SESSION['admin_role_id'] ?? null;
        if ((int) $roleId === 1) {
            json_response(403, ['ok' => false, 'message' => 'Admins cannot submit applications.']);
        }
    }

    private function createClient(): SupabaseClient
    {
        $supabaseUrl = env_value('SUPABASE_URL');
        $serviceKey = env_value('SUPABASE_SERVICE_ROLE_KEY');

        if ($supabaseUrl === '' || $serviceKey === '') {
            json_response(500, ['ok' => false, 'message' => 'Supabase credentials are missing.']);
        }

        return new SupabaseClient($supabaseUrl, $serviceKey);
    }

    private function loadStatusMap(SupabaseClient $client): array
    {
        $response = $client->get('/rest/v1/applicant_statuses', [
            'select' => 'id,status_name',
        ]);

        if ($response['status'] >= 400) {
            json_response(500, ['ok' => false, 'message' => 'Unable to query applicant statuses.']);
        }

        $rows = is_array($response['data']) ? $response['data'] : [];
        $map = [];
        foreach ($rows as $row) {
            if (isset($row['status_name'], $row['id'])) {
                $map[strtolower((string) $row['status_name'])] = (int) $row['id'];
            }
        }
        return $map;
    }

    private function loadDesignationMap(SupabaseClient $client): array
    {
        $response = $client->get('/rest/v1/designations', [
            'select' => 'id,designation_name',
        ]);

        if ($response['status'] >= 400) {
            json_response(500, ['ok' => false, 'message' => 'Unable to query designations.']);
        }

        $rows = is_array($response['data']) ? $response['data'] : [];
        $map = [];
        foreach ($rows as $row) {
            if (isset($row['designation_name'], $row['id'])) {
                $map[(string) $row['designation_name']] = (int) $row['id'];
            }
        }
        return $map;
    }

    private function resolveSchoolId(SupabaseClient $client, string $schoolName): ?int
    {
        $trimmed = trim($schoolName);
        if ($trimmed === '') {
            return null;
        }

        $lookup = $client->get('/rest/v1/schools', [
            'select' => 'id',
            'school_name' => 'eq.' . $trimmed,
            'limit' => '1',
        ]);

        if ($lookup['status'] < 400 && is_array($lookup['data']) && count($lookup['data']) > 0) {
            return isset($lookup['data'][0]['id']) ? (int) $lookup['data'][0]['id'] : null;
        }

        return null;
    }

    private function extractRelationValue(mixed $relation, string $key): ?string
    {
        if (is_array($relation)) {
            if (isset($relation[$key]) && is_string($relation[$key])) {
                return $relation[$key];
            }
            if (isset($relation[0][$key]) && is_string($relation[0][$key])) {
                return $relation[0][$key];
            }
        }
        return null;
    }

    private function extractRequestData(array $input): array
    {
        $contentType = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
        if (str_contains($contentType, 'multipart/form-data')) {
            return $_POST;
        }

        return $input;
    }

    private function extractCvFile(): ?array
    {
        if (!isset($_FILES['cv_file']) || !is_array($_FILES['cv_file'])) {
            return null;
        }

        $file = $_FILES['cv_file'];
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            return null;
        }

        $tmpName = $file['tmp_name'] ?? '';
        if ($tmpName === '' || !is_readable($tmpName)) {
            return null;
        }

        $size = (int) ($file['size'] ?? 0);
        if ($size <= 0 || $size > 10 * 1024 * 1024) {
            json_response(422, ['ok' => false, 'message' => 'CV file size exceeds 10MB.']);
        }

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($tmpName) ?: '';
        if ($mime !== 'application/pdf') {
            json_response(422, ['ok' => false, 'message' => 'Only PDF files are accepted.']);
        }

        return [
            'tmp_name' => $tmpName,
            'size' => $size,
        ];
    }

    private function uploadCvFile(SupabaseClient $client, array $fileInfo, string $applicantId): string
    {
        $tmpName = $fileInfo['tmp_name'];
        $binary = file_get_contents($tmpName);
        if ($binary === false) {
            json_response(500, ['ok' => false, 'message' => 'Unable to read CV file.']);
        }

        $objectPath = 'applicants/' . $applicantId . '.pdf';
        $response = $client->uploadObject('applicant-cvs', $objectPath, $binary, 'application/pdf');

        if ($response['status'] >= 400) {
            json_response(500, ['ok' => false, 'message' => 'Unable to upload CV.']);
        }

        return $objectPath;
    }

    private function generateUuidV4(): string
    {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    private function checkDuplicateContact(SupabaseClient $client, string $phoneNumber, string $email): array
    {
        $response = $client->get('/rest/v1/applicants', [
            'select' => 'phone_number,email',
            'or' => sprintf('(%s,%s)', 'phone_number.eq.' . $phoneNumber, 'email.eq.' . $email),
        ]);

        if ($response['status'] >= 400) {
            json_response(500, ['ok' => false, 'message' => 'Unable to validate applicant uniqueness.']);
        }

        $rows = is_array($response['data']) ? $response['data'] : [];
        $phoneMatch = false;
        $emailMatch = false;
        foreach ($rows as $row) {
            if (isset($row['phone_number']) && (string) $row['phone_number'] === $phoneNumber) {
                $phoneMatch = true;
            }
            if (isset($row['email']) && (string) $row['email'] === $email) {
                $emailMatch = true;
            }
            if ($phoneMatch && $emailMatch) {
                break;
            }
        }

        return [
            'phone' => $phoneMatch,
            'email' => $emailMatch,
        ];
    }
}
