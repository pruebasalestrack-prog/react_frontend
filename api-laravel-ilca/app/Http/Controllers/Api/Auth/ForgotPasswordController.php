<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use App\Mail\ForgotPassword;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\User;
use App\Mail\PasswordReset;

class ForgotPasswordController extends Controller
{
    /**
     * 🔍 Valida si el usuario puede resetear su contraseña
     * Retorna un mensaje de error si no cumple las condiciones, null si todo está OK
     */
    private function handleAuthFail($user)
    {
        // ❌ Si el usuario NO existe
        if (empty($user)) {
            return response()->json(['error' => 'El usuario no existe.'], 404);
        }
        
        // ❌ Si el usuario no está activo
        if ($user->estatus != 1) {
            return response()->json(['error' => 'El usuario no se activó aún.'], 403);
        }
        
        // ❌ Si el usuario es de Active Directory
        if ($user->active_directory !== 'N') {
            return response()->json(['error' => 'No puede cambiar clave en usuario de Active Directory'], 403);
        }
        
        // ❌ Si el usuario está eliminado
        if (!empty($user->deleted_at)) {
            return response()->json(['error' => 'El usuario se ha eliminado.'], 403);
        }
        
        // ❌ Si el usuario está bloqueado
        if ($user->bloqueo == 1) {
            return response()->json(['error' => 'El usuario está bloqueado'], 403);
        }
        
        // ✅ Si pasa todas las validaciones, retornar null (sin error)
        return null;
    }

    public function forgotPassword(Request $request)
    {
        try {
            \Log::info('🔍 Iniciando forgotPassword', ['email' => $request->email]);
            
            // Validar que el email sea válido
            $request->validate(['email' => 'required|email']);

            // Buscar el usuario por email
            $user = User::where('email', $request->email)->first();
            \Log::info('👤 Usuario encontrado', ['user_id' => $user ? $user->id : 'no encontrado']);

            // Validar si el usuario puede resetear la contraseña
            $validationError = $this->handleAuthFail($user);
            
            // Si hay algún error, retornarlo
            if ($validationError !== null) {
                return $validationError;
            }

            // Generar token de recuperación (60 caracteres)
            $token = Str::random(60);
            \Log::info('🔑 Token generado', ['token' => $token, 'length' => strlen($token)]);

            // 🔥 CRÍTICO: GUARDAR EL TOKEN EN LA BASE DE DATOS
            try {
                // Eliminar tokens anteriores del mismo email
                PasswordReset::where('email', $request->email)->delete();
                \Log::info('🗑️ Tokens antiguos eliminados para: ' . $request->email);

                // Guardar el nuevo token SIN HASHEAR
                PasswordReset::create([
                    'email' => $request->email,
                    'token' => $token,
                    'created_at' => now()
                ]);
                
                \Log::info('💾 Token guardado en BD exitosamente', [
                    'email' => $request->email,
                    'token_preview' => substr($token, 0, 20) . '...'
                ]);
            } catch (\Exception $dbError) {
                \Log::error('❌ Error al guardar token en BD', [
                    'error' => $dbError->getMessage(),
                    'email' => $request->email
                ]);
                throw new \Exception('Error al guardar el token de recuperación');
            }
            
            // Enviar correo de recuperación
            $this->sendPasswordReset($user, $token);
            \Log::info('📧 Correo procesado exitosamente');

            return response()->json([
                "status" => true, 
                "mensaje" => "Correo de recuperación enviado correctamente a arcee1060@gmail.com (modo testing)"
            ], 200);

        } catch (\Exception $e) {
            \Log::error('❌ Error en forgotPassword', [
                'mensaje' => $e->getMessage(),
                'email' => $request->email ?? 'no email',
                'linea' => $e->getLine(),
                'archivo' => $e->getFile(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                "status" => false, 
                "mensaje" => "Error al procesar la solicitud: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 📧 Envía el correo de recuperación de contraseña
     * 🎯 CORREO QUEMADO para testing: arcee1060@gmail.com
     */
    public function sendPasswordReset($user, $token)
    {
        try {
            $nombre = $user->nombre . ' ' . $user->apellido;
            
            // 🎯 CORREO QUEMADO PARA TESTING
            $emailDestino = 'arcee1060@gmail.com';
            
            \Log::info('📧 Enviando correo a: ' . $emailDestino . ' (usuario original: ' . $user->email . ')');
            
            Mail::to($emailDestino, $nombre)->send(new ForgotPassword($user->email, $nombre, $token));
            
            \Log::info('✅ Correo enviado exitosamente a: ' . $emailDestino);
        } catch (\Exception $e) {
            \Log::error('❌ Error al enviar correo', [
                'mensaje' => $e->getMessage(),
                'linea' => $e->getLine(),
                'archivo' => $e->getFile()
            ]);
            throw $e;
        }
    }
}