<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\UserCompanies;
use App\Models\Rol;


class Company extends Model
{
    use SoftDeletes;

    protected $table = 'company';
    protected $connection = 'conexion1';
    public $timestamps = false;
    protected $dateFormat = 'Ymd h:i:s';

        /**
        * The attributes that are mass assignable.
        *
        * @var array<int, string>
        */

    protected $fillable = [
        'nick',
        'razonsocial',
        'telefono',
        'identificacion',
        'conexion',
        'comentario',
        'rol_id',
        'vigencia',
        'notifica',
        'entorno'
    ];

    protected $dates = ['deleted_at'];
    protected $softDelete = true;

    public function UserCompany()
    {
        return $this->hasMany(UserCompanies::class, 'company_id', 'id');
    }

    public function Roles()
    {
        return $this->hasMany(Rol::class, 'id', 'rol_id');
    }
}