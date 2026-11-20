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

    protected $table = 'book';

    protected $fillable = [
        'title',
        'isbn',
        'year',
        'synopsis',
        'amount',
        'author_id',
    ];

    public function autor(): BelongsTo
    {
        return $this->belongsTo(Autor::class, 'author_id');
    }

    public function categorias(): BelongsToMany
    {
        return $this->belongsToMany(Categoria::class, 'book_category', 'book_id', 'category_id');
    }

    public function emprestimos(): HasMany
    {
        return $this->hasMany(Emprestimo::class, 'book_id');
    }
}