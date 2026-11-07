<?php

namespace App\Mail\Transport;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mailer\Transport\AbstractTransport;

/**
 * Envía correos por Microsoft Graph (Microsoft 365) usando credenciales de aplicación.
 *
 * Manda el mensaje MIME completo, así se conservan los encabezados List-Unsubscribe.
 * Requiere el permiso de aplicación Mail.Send y que el remitente sea un buzón del tenant.
 * https://learn.microsoft.com/graph/api/user-sendmail
 */
class MicrosoftGraphTransport extends AbstractTransport
{
    public function __construct(
        private string $tenantId,
        private string $clientId,
        private string $clientSecret,
    ) {
        parent::__construct();
    }

    protected function doSend(SentMessage $message): void
    {
        $remitente = $message->getEnvelope()->getSender()->getAddress();

        $respuesta = Http::withToken($this->token())
            ->withBody(base64_encode($message->toString()), 'text/plain')
            ->timeout(30)
            ->post('https://graph.microsoft.com/v1.0/users/' . rawurlencode($remitente) . '/sendMail');

        if ($respuesta->failed()) {
            $error = $respuesta->json('error.code') . ': ' . $respuesta->json('error.message');

            throw new RuntimeException("Microsoft Graph rechazó el envío desde {$remitente} ({$respuesta->status()}) {$error}");
        }
    }

    private function token(): string
    {
        $claveCache = 'microsoft-graph-token:' . $this->clientId;

        if ($token = Cache::get($claveCache)) {
            return $token;
        }

        $respuesta = Http::asForm()->post("https://login.microsoftonline.com/{$this->tenantId}/oauth2/v2.0/token", [
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'scope' => 'https://graph.microsoft.com/.default',
            'grant_type' => 'client_credentials',
        ]);

        if ($respuesta->failed()) {
            throw new RuntimeException('No se pudo obtener el token de Microsoft Graph: ' . $respuesta->json('error_description', $respuesta->body()));
        }

        Cache::put($claveCache, $respuesta->json('access_token'), now()->addSeconds($respuesta->json('expires_in', 3600) - 120));

        return $respuesta->json('access_token');
    }

    public function __toString(): string
    {
        return 'microsoft-graph';
    }
}
