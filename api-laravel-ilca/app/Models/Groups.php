<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\RolDet;

class Groups extends Model
{
    use SoftDeletes;

    protected $table = 'groups';

    protected $primaryKey = 'id';

    protected $fillable = ['group_id','nombre','tiponivel'];
    
    protected $dates = ['deleted_at'];

    protected $softDelete = true;


    public function RolDet()
    {
        return $this->hasMany(RolDet::class, 'group_id', 'id');
    }

    //protected $dateFormat = 'Y M j h:i:s';

//     public function getDateFormat()
//     {
//         return getFormatDate();
//     }

}
