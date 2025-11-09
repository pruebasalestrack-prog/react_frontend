<?php

namespace App\Mail;

use Illuminate\Database\Eloquent\Model;

class PasswordReset extends Model
{
    protected $table = 'password_resets';
    protected $connection = 'conexion1';
    protected $primaryKey = 'email';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false; // IMPORTANTE: no usa timestamps automáticos

    protected $fillable = [
        'email',
        'token',
        'created_at' 
    ];
}