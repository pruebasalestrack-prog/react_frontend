<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Parametros extends Model
{
    use SoftDeletes;

    protected $table = 'parametros';
    protected $connection = 'conexion1';
    protected $primaryKey = 'id';
    

    public $timestamps = false;

    protected $fillable = ['grupo', 'clave', 'valor', 'descripcion'];

    protected $dates = ['deleted_at'];

    protected $softDelete = true;

    //protected $softDelete = true;

    public static function valor ($grupo, $clave){
        $registro = self::where('grupo', $grupo)->where('clave',$clave)->first();
        if($registro)
        {
            return $registro->valor;
        }else{
            return "";
        }
    }    

}
