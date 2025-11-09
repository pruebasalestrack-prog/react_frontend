<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\RolDet;

class Options extends Model
{
    use SoftDeletes;

    protected $table = 'options';
    protected $connection = 'conexion1';
    public $timestamps = false;

	protected $dateFormat = 'Ymd h:i:s';

	protected $primaryKey = 'id';

	protected $fillable = ['nombre','url'];
    
	protected $dates = ['deleted_at','created_at','updated_at'];

	protected $softDelete = true;

	public function RolDet(){
		 return $this->hasMany(RolDet::class,'option_id','id');
	}



}
