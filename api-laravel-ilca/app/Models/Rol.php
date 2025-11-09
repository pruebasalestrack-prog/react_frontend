<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Company;

class Rol extends Model
{
    use SoftDeletes;

    protected $table = 'roles';
    protected $connection = 'conexion1';
    protected $primaryKey = 'id';
	protected $fillable = ['nombre'];
	protected $dates = ['deleted_at'];
	protected $softDelete = true;
	public $timestamps = false;
	protected $dateFormat = 'Ymd h:i:s';


    public function Company(){
		 return $this->hasMany(Company::class,'rol_id','id');
	}

	public function DetRol(){
		 return $this->hasMany(RolDet::class,'rol_id','id');
	}	
}
