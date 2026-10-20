<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Livro extends Model
{
    use HasFactory;

    protected $table = 'livros';

    protected $fillable = [
        'titulo',
        'isbn',
        'ano_publicacao',
        'sinopse',
        'capa_url',
        'quantidade',
        'autor_id',
    ];

    public function autor(): BelongsTo
    {
        return $this->belongsTo(Autor::class, 'autor_id');
    }

    public function categorias(): BelongsToMany
    {
        return $this->belongsToMany(Categoria::class, 'categoria_livro');
    }

    public function emprestimos(): HasMany
    {
        return $this->hasMany(Emprestimo::class, 'livro_id');
    }
}