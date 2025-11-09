<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use App\Mail\ForgotPassword;
use Illuminate\Http\Request;
use DB;
//use Mail;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;

class AuthController extends Controller
{



    private function parsearCompany($company)
    {
        $uc = $company->UserCompany->first();
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
    }




}
