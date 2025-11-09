<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordReset extends Model
{
    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'password_resets';

    /**
     * Indica si el modelo debe usar timestamps automáticos.
     * La tabla password_resets normalmente NO tiene timestamps estándar
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Los atributos que se pueden asignar masivamente.
     *
     * @var array
     */
    protected $fillable = [
        'email',
        'token',
        'created_at',
    ];

    /**
     * La clave primaria de la tabla.
     * La tabla password_resets normalmente usa 'email' como clave
     *
     * @var string
     */
    protected $primaryKey = 'email';

    /**
     * Indica si la clave primaria es incremental.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * El tipo de datos de la clave primaria.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array
     */
    protected $casts = [
        'created_at' => 'datetime',
    ];
}