<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;

//namespace App\Http\Controllers;



class LoginController extends Controller
{

    public function login(Request $request)
    {
        // Validar campos obligatorios
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
                'flag_inicio_sesion' => 'required|integer' /// SI ES 1 ES TIPO CIERRE SESION SI ES 0 ES TIPO INICIO SESION
            ]);
            // Buscar usuario por email
            $user = User::where('email', $request->email)
                ->with([
                    'Companies.UserCompany.ProfilesUserComp.RolDet.Option'
                ])->first();


            //dd($user);
            if (!$user) {
                return response()->json(['error' => 'Usuario no encontrado'], 404);
            }
            if (!empty($user->deleted_at)) {
                return response()->json(['error' => 'Usuario se encuenra eliminado'], 404);
            }

            if ($user->estatus == 0) {
                return response()->json(['error' => 'Usuario inactivo, contactar al administrador'], 403);
            }

            if ($user->bloqueo == 1) {
                return response()->json(['error' => 'Usuario bloqueado, contactar al administrador'], 403);
            }

            // Validar contraseña usando bcrypt
            if (!Hash::check($request->password, $user->password)) {
                return response()->json(['error' => 'Contraseña incorrecta'], 401);
            }

            // Generar token JWT

            $token = JWTAuth::fromUser($user);

            if (($user->remember_token == null || $user->remember_token == '') || $request->flag_inicio_sesion == 1) {
                $user->remember_token = $token;
                $user->save();
            }

            $ttlseconds = JWTAuth::factory()->getTTL() * 60;

            $user = $this->parsearLogin($user);
            //dd($user);
            return response()->json([
                'token' => $token,
                'token_type' => 'bearer',
                'expires_in' => $ttlseconds,
                'user' => [
                    'id' => $user->id ?? null,
                    'email' => $user->email ?? null,
                    'name' => trim(($user->nombre ?? '') . ' ' . ($user->apellido ?? '')),
                    'tipo_usuario' => $user->tipouser ?? null,
                    'remember_token' => $user->remember_token ?? null,
                    'companies' => $user->Companies ?? [],
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function loginv2(Request $request)
    {
        // Validar campos obligatorios
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
                'flag_inicio_sesion' => 'required|integer' /// SI ES 1 ES TIPO CIERRE SESION SI ES 0 ES TIPO INICIO SESION
            ]);
            // Buscar usuario por email
            $user = User::where('email', $request->email)
                ->with([
                    'Companies.UserCompany.ProfilesUserComp.RolDet.Option'
                ])->first();

            if (!$user) {
                return response()->json(['error' => 'Usuario no encontrado'], 404);
            }
            if (!$user->deleted_at == null) {
                return response()->json(['error' => 'Usuario se encuenra eliminado'], 404);
            }

            if ($user->estatus == 0) {
                return response()->json(['error' => 'Usuario inactivo, contactar al administrador'], 403);
            }

            if ($user->bloqueo == 1) {
                return response()->json(['error' => 'Usuario bloqueado, contactar al administrador'], 403);
            }
            // Validar contraseña usando bcrypt
            if (!Hash::check($request->password, $user->password)) {
                return response()->json(['error' => 'Contraseña incorrecta'], 401);
            }

            $token = JWTAuth::fromUser($user);

            if (($user->remember_token == null || $user->remember_token == '') || $request->flag_inicio_sesion == 1) {
                $user->remember_token = $token;
                $user->save();
            }

            $ttlseconds = JWTAuth::factory()->getTTL() * 60;

            $user = $this->parsearLogin($user);
            //dd($user);
            return response()->json([
                'token' => $token,
                'token_type' => 'bearer',
                'expires_in' => $ttlseconds,
                'user' => [
                    'id' => $user->id ?? null,
                    'email' => $user->email ?? null,
                    'name' => trim(($user->nombre ?? '') . ' ' . ($user->apellido ?? '')),
                    'tipo_usuario' => $user->tipouser ?? null,
                    'remember_token' => $user->remember_token ?? null,
                    'companies' => $user->Companies ?? [],
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            // Si envías token como parámetro
            $token = $request->bearerToken() ?? $request->token;
            // Obtener el usuario autenticado
            $user = JWTAuth::setToken($token)->authenticate();
            if (!$user) {
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }
            // Invalidate the token
            JWTAuth::invalidate($token);
            // Limpiar remember_token
            $user->remember_token = null;
            $user->save();

            return response()->json(['message' => 'Sesión cerrada exitosamente']);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token expirado'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Token inválido'], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al cerrar sesión', 'details' => $e->getMessage()], 500);
        }
    }

    private function parsearLogin($user)
    {
        $companies = $user->Companies->transform(function ($company) {
            // Tomar el primer registro user_company
            $uc = $company->UserCompany->first();

            // Si no hay user_company, solo devuelve la company
            //if (!$uc) return $company;

            // Obtener perfiles (opciones) del usuario en esta compañía
            $profiles = $uc->ProfilesUserComp->map(function ($profile) {
                $option = optional($profile->RolDet->Option);

                return [
                    'option' => [
                        'nombre' => $option->nombre,
                        'url' => $option->url,
                    ],
                    'permisos' => [
                        'est_create' => $profile->est_create,
                        'est_read' => $profile->est_read,
                        'est_update' => $profile->est_update,
                        'est_delete' => $profile->est_delete,
                        'est_print' => $profile->est_print,
                        'est_export' => $profile->est_export,
                        'est_comod1' => $profile->est_comod1,
                        'est_comod2' => $profile->est_comod2,
                        'est_comod3' => $profile->est_comod3,
                        'est_comod4' => $profile->est_comod4,
                        'est_comod5' => $profile->est_comod5,
                        'est_comod6' => $profile->est_comod6,
                        'est_comod7' => $profile->est_comod7,
                        'est_comod8' => $profile->est_comod8,
                        'est_comod9' => $profile->est_comod9,
                        'est_comod10' => $profile->est_comod10,
                    ]
                ];
            })->unique(fn($item) => $item['option']['url'])->values();
            //dd($profiles);
            // Devuelve la company con user_company y perfiles
            return [
                'id' => $company->id,
                'rol_id' => $company->rol_id,
                'nick' => $company->nick,
                'razonsocial' => $company->razonsocial,
                'direccion' => $company->direccion,
                'telefono' => $company->telefono,
                'identificacion' => $company->identificacion,
                'conexion' => $company->conexion,
                'comentario' => $company->comentario,
                'vigencia' => $company->vigencia,
                'notifica' => $company->notifica,
                'acceso' => $company->acceso,
                'entorno' => $company->entorno,
                'created_at' => $company->created_at,
                'updated_at' => $company->updated_at,
                'deleted_at' => $company->deleted_at,

                // Datos del user_company
                'user_company' => $uc->only([
                    'id',
                    'user_id',
                    'tipouser',
                    'tipouser_code',
                    'comentario',
                    'cant_dashboard',
                    'dashboard1',
                    'dashboard2',
                    'dashboard3',
                    'dashboard4',
                    'cant_dashbox',
                    'dashbox1',
                    'dashbox2',
                    'dashbox3',
                    'dashbox4'
                ]),

                // Perfiles / opciones del usuario en esta compañía
                'profiles_user_comp' => $profiles,
            ];
        });
        $user = $user->setRelation('Companies', $companies);
        return $user;
    }

    public function pruebarequest(Request $request)
    {
        response()->json([
            'mensaje' => 'Funciona correctamente'
        ]);
    }
}
