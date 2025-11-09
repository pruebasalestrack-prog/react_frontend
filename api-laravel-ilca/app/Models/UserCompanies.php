<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\OptionsUserCompany;

class UserCompanies extends Model
{
    use SoftDeletes;

    protected $table = 'user_comp';
    protected $connection = 'conexion1';
	protected $primaryKey = 'id';

	public $timestamps = false;

	protected $dateFormat = 'Ymd h:i:s';

	protected $fillable = ['user_id','company_id', 'tipouser','tipouser_code','comentario','cant_dashboard','dashboard1','dashboard2','dashboard3','dashboard4'	];
	
	protected $dates = ['deleted_at'];

	protected $softDelete = true;


	public function ProfilesUserComp(){// OPCIONES ASIGNADAS AL USUARIO DE LA COMPAÑIA. -CLASE - FOREIN KEY - LOCAL KEY
		 return $this->hasMany(OptionsUserCompany::class,'usercomp_id','id');
	}


	public function Company(){// COMPAÑIA A LA QUE PERTENECE EL USUARIO -CLASE - FOREIN KEY - LOCAL KEY
		 return $this->hasOne(Company::class,'id','company_id');
	}


}
