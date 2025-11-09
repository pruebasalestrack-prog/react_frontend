<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Options;

class RolDet extends Model
{

    use SoftDeletes;

    const CREATED_AT = 'created_at';

    const UPDATED_AT = 'updated_at';

    const DELETED_AT = 'deleted_at';

    protected $table = 'rol_det';

    protected $primaryKey = 'id';

    protected $fillable = [
        'option_id',
        'rol_id',
        'group_id',
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

    public $timestamps = false;

    protected $dateFormat = 'Ymd h:i:s';


    	public function Option(){
		 return $this->hasOne(Options::class,'id','option_id');
	}	

    	public function Rol(){
		 return $this->hasOne(Rol::class,'id','rol_id');
	}	

    	public function Grupo(){
		 return $this->hasOne(Groups::class,'id','group_id');
	}	

}
