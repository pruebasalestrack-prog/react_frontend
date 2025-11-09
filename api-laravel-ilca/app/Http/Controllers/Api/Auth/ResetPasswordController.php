<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use App\Mail\ForgotPassword;
use Illuminate\Http\Request;
//use DB;
//use DB;
use Illuminate\Support\Str;
//2use Mail;
//use Illuminate\Support\Facades\Hash;
//use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use App\Mail\PasswordReset;


class ResetPasswordController extends Controller
{

    private function handleAuthFail($user)
    {
        if (empty($user))
            return response()->json(['error' => 'El usuario no existe.']);
        else if ($user->estatus != 1)
            return response()->json(['error' => 'El usuario no se activó aún.']);
        else if ($user->active_directory !== 'N')
            return response()->json(['error' => 'No puede cambiar clave en usuario de Active Directory']);
        else if (!empty($user->deleted_at))
            return response()->json(['error' => 'El usuario se ha eliminado.']);
        else if (!empty($user->bloqueo == 1))
            return response()->json(['error' => 'El usuario esta bloqueado']);
        return response()->json(['error' => 'El usuario no existe.']);
    }

    public function resetPassword(Request $request)
    {
        try {
            $request->validate([
                'contrasena' => 'required|confirmed',
                'token' => 'required'
            ]);

            $email = PasswordReset::where('token', $request->token)->first();
            if (empty($email)) {
                return response()->json(["status" => false, "mensaje" => "Token inválido, porfavor reintente"]);
            }
            User::where('email', $email->email)->update([
                'password' => Hash::make($request->contrasena),
                'updated_at' => date('Ymd H:i:s')
            ]);


            return response()->json(["status" => true, "mensaje" => "Contraseña cambiada correctamente"]);
        } catch (\Exception $e) {
            return response()->json(["status" => false, "mensaje" => $e->getMessage()]);
        }
    }


    //$email = $request->input('email');
    //$user = User::where('email', $email)->first();
    //$up = PasswordReset::where('email', $email)->first();





    public function sendPasswordReset($user, $token)
    {
        $nombre = $user->nombre . '-' . $user->apellido;
        Mail::to($user->email, $nombre)->send(new ForgotPassword($user->email, $nombre, $token));
    }
}
