<?php
declare(strict_types=1);

class SmtpMailer
{
    private string $host;
    private int $port;
    private string $username;
    private string $password;
    private string $encryption;
    private string $fromAddress;
    private string $fromName;
    private string $clientName;

    public function __construct(array $config)
    {
        $this->host = (string) ($config['host'] ?? '');
        $this->port = (int) ($config['port'] ?? 0);
        $this->username = (string) ($config['username'] ?? '');
        $this->password = (string) ($config['password'] ?? '');
        $this->encryption = strtolower((string) ($config['encryption'] ?? ''));
        $this->fromAddress = (string) ($config['from_address'] ?? '');
        $this->fromName = (string) ($config['from_name'] ?? '');
        $this->clientName = (string) ($config['client_name'] ?? 'localhost');
    }

    public function send(string $toEmail, string $toName, string $subject, string $body): void
    {
        $socket = $this->connect();

        $this->sendCommand($socket, 'MAIL FROM:<' . $this->fromAddress . '>', [250]);
        $this->sendCommand($socket, 'RCPT TO:<' . $toEmail . '>', [250, 251]);
        $this->sendCommand($socket, 'DATA', [354]);

        $headers = [
            'From: ' . $this->formatAddress($this->fromName, $this->fromAddress),
            'To: ' . $this->formatAddress($toName, $toEmail),
            'Subject: ' . $this->encodeHeader($subject),
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
        ];

        $message = implode("\r\n", $headers) . "\r\n\r\n" . $this->normalizeBody($body) . "\r\n.";
        $this->write($socket, $message . "\r\n");
        $this->expectResponse($socket, [250]);

        $this->sendCommand($socket, 'QUIT', [221]);
        fclose($socket);
    }

    private function connect()
    {
        $remote = $this->encryption === 'ssl' ? 'ssl://' . $this->host : $this->host;
        $socket = fsockopen($remote, $this->port, $errno, $errstr, 10);
        if (!is_resource($socket)) {
            throw new RuntimeException('Unable to connect to SMTP server.');
        }

        stream_set_timeout($socket, 10);
        $this->expectResponse($socket, [220]);

        $this->sendCommand($socket, 'EHLO ' . $this->clientName, [250]);

        if ($this->encryption === 'tls') {
            $this->sendCommand($socket, 'STARTTLS', [220]);
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new RuntimeException('Unable to establish TLS connection.');
            }
            $this->sendCommand($socket, 'EHLO ' . $this->clientName, [250]);
        }

        if ($this->username !== '') {
            $this->sendCommand($socket, 'AUTH LOGIN', [334]);
            $this->sendCommand($socket, base64_encode($this->username), [334]);
            $this->sendCommand($socket, base64_encode($this->password), [235]);
        }

        return $socket;
    }

    private function sendCommand($socket, string $command, array $expectedCodes): void
    {
        $this->write($socket, $command . "\r\n");
        $this->expectResponse($socket, $expectedCodes);
    }

    private function expectResponse($socket, array $expectedCodes): void
    {
        $response = $this->readResponse($socket);
        $code = (int) substr($response, 0, 3);
        if (!in_array($code, $expectedCodes, true)) {
            throw new RuntimeException('SMTP error: ' . $response);
        }
    }

    private function readResponse($socket): string
    {
        $data = '';
        while (!feof($socket)) {
            $line = fgets($socket, 512);
            if ($line === false) {
                break;
            }
            $data .= $line;
            if (preg_match('/^\d{3} /', $line) === 1) {
                break;
            }
        }
        return trim($data);
    }

    private function write($socket, string $data): void
    {
        $written = fwrite($socket, $data);
        if ($written === false) {
            throw new RuntimeException('Unable to write to SMTP server.');
        }
    }

    private function normalizeBody(string $body): string
    {
        $normalized = str_replace(["\r\n", "\r"], "\n", $body);
        $normalized = str_replace("\n", "\r\n", $normalized);
        return preg_replace('/^\./m', '..', $normalized) ?? $normalized;
    }

    private function formatAddress(string $name, string $email): string
    {
        $trimmed = trim($name);
        if ($trimmed === '') {
            return $email;
        }
        return $this->encodeHeader($trimmed) . ' <' . $email . '>';
    }

    private function encodeHeader(string $value): string
    {
        if (function_exists('mb_encode_mimeheader')) {
            return mb_encode_mimeheader($value, 'UTF-8', 'B', "\r\n");
        }
        return $value;
    }
}

