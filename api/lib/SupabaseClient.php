<?php
declare(strict_types=1);

class SupabaseClient
{
    private string $baseUrl;
    private string $serviceKey;

    public function __construct(string $baseUrl, string $serviceKey)
    {
        $this->baseUrl = rtrim($baseUrl, '/');
        $this->serviceKey = $serviceKey;
    }

    public function get(string $path, array $query = []): array
    {
        return $this->request('GET', $path, $query, null);
    }

    public function request(string $method, string $path, array $query = [], ?array $payload = null): array
    {
        $url = $this->baseUrl . $path;
        if (!empty($query)) {
            $url .= '?' . http_build_query($query, '', '&', PHP_QUERY_RFC3986);
        }

        $ch = curl_init();
        if ($ch === false) {
            throw new RuntimeException('Unable to initialize HTTP client.');
        }

        $headers = [
            'apikey: ' . $this->serviceKey,
            'Authorization: Bearer ' . $this->serviceKey,
            'Accept: application/json',
        ];

        $options = [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_TIMEOUT => 10,
        ];

        if ($payload !== null) {
            $headers[] = 'Content-Type: application/json';
            $options[CURLOPT_HTTPHEADER] = $headers;
            $options[CURLOPT_POSTFIELDS] = json_encode($payload);
        }

        curl_setopt_array($ch, $options);

        $responseBody = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($responseBody === false) {
            throw new RuntimeException('Supabase request failed: ' . $error);
        }

        $decoded = json_decode($responseBody, true);

        return [
            'status' => $status,
            'data' => is_array($decoded) ? $decoded : null,
            'raw' => $responseBody,
        ];
    }
}
