<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Usuario extends Model
{
    use HasFactory;

    protected $table = 'usuarios';

    protected $fillable = [
        'nome',
        'email',
        'documento',
        'perfil',
        'departamento',
        'status',
    ];

    public function emprestimos(): HasMany
    {
        return $this->hasMany(Emprestimo::class, 'usuario_id');
    }
}