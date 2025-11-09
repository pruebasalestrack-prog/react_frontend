<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\RolDet;

class OptionsUserCompany extends Model
{
	use SoftDeletes;

    protected $table = 'options_user_comp';
    protected $connection = 'conexion1';
	protected $primaryKey = 'id';

	public $timestamps = false;

	protected $dateFormat = 'Ymd h:i:s';

	protected $fillable = ['roldet_id',
	'usercomp_id',
	'est_create',
	'est_read',
	'est_update',
	'est_delete',
	'est_print',
	'est_export',
	'est_comod1',
	'est_comod2',
	'est_comod3'
	];

	protected $dates = ['deleted_at'];

	protected $softDelete = true;

	
	public function RolDet(){
		return $this->hasOne(RolDet::class,'id','roldet_id');
	}

	// public function UserCompany(){
	// 	return $this->hasOne(UserCompanies::class,'id','usercomp_id');
	// }

}