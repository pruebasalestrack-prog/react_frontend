<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Parametros;

class ForgotPassword extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public $email;
    public $nombre;
    public $token;

    public function __construct($email, $nombre, $token)
    {
        $this->email = $email;
        $this->nombre = $nombre;
        $this->token = $token;
    }

    public function build()
    {
        try {
            $copia = Parametros::valor('CORREO_SECURY', 'COPIA');
            $arre = explode(";", $copia);

            $data['email_de'] = Parametros::valor('CORREO_SECURY', 'DE');
            $data['email_name'] = Parametros::valor('CORREO_SECURY', 'NOMBRE_DE');
            $data['email_cc'] = ['arcee1060@gmail.com']; // 🎯 CC quemado
            $data['asunto'] = Parametros::valor('CORREO_SECURY', 'ASUNTO_OLVIDOCLAVE');
            
            \Log::info('📧 Configuración de correo cargada desde Parametros');
            
        } catch (\Exception $e) {
            // 🔧 Fallback si hay error con Parametros
            \Log::warning('⚠️ No se pudieron cargar parámetros de correo, usando valores por defecto', [
                'error' => $e->getMessage()
            ]);
            
            $data['email_de'] = 'info@pure.ec';
            $data['email_name'] = 'Pure Technology';
            $data['email_cc'] = ['arcee1060@gmail.com'];
            $data['asunto'] = 'Recuperación de Contraseña - Pure Technology';
        }

        return $this->view('forgot_password')
            ->from($data['email_de'], $data['email_name'])
            ->cc($data['email_cc'])
            ->subject($data['asunto']);
    }
}