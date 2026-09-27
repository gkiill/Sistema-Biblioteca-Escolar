<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Emprestimo extends Model
{
    use HasFactory;

    protected $table = 'emprestimos';

    protected $fillable = [
        'livro_id',
        'usuario_id',
        'data_emprestimo',
        'data_devolucao_prevista',
        'data_devolucao_real',
        'status',
    ];

    protected $casts = [
        'data_emprestimo' => 'date',
        'data_devolucao_prevista' => 'date',
        'data_devolucao_real' => 'date',
    ];

    public function livro(): BelongsTo
    {
        return $this->belongsTo(Livro::class, 'livro_id');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}