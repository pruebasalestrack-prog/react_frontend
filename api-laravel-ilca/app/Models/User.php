<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Models\Company;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $table = 'users';
    protected $connection = 'conexion1';
    protected $primaryKey = 'id';
    public $timestamps = false;
    protected $dateFormat = 'Ymd h:i:s';



    //protected $table = 'users';

    protected $fillable = [
        'nick',
        'email',
        'password',
        'tipouser',
        'estatus',
        'nombre',
        'apellido',
        'fecha_nacimiento',
        'user_uuid_created',
        'user_uuid_updated',
        'confirm_token',
        'estatus',
        'active_directory',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'session_id',

    ];

    protected $dates = ['deleted_at'];

    protected $softDelete = true;


    /**
     * The attributes that should be cast.
     *
     * @var array<string,string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */


    public function Companies()
    {
        return $this->belongsToMany(
            Company::class,  // Modelo relacionado
            'user_comp',       // Tabla pivote
            'user_id',         // Clave foránea del usuario en la pivote
            'company_id'       // Clave foránea de la empresa en la pivote
        )
            ->withPivot('id')
            ->wherePivot('deleted_at', null)
            ->orderBy('id');
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }


    // public function sendPasswordResetNotification($token)
    // {
    //     $email = $this->email;
    //     //$query = DB::select('select token from password_resets where email = ?',[$email])[0];
    //     //$to = $query->token;
    //     $this->notify(new MailResetPasswordToken($token));
    // }
}
