<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
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

    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class, 'author_id');
    }

    public function autor(): BelongsTo
    {
        return $this->author();
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'book_category', 'book_id', 'category_id');
    }

    public function categorias(): BelongsToMany
    {
        return $this->categories();
    }

    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class, 'book_id');
    }

    public function emprestimos(): HasMany
    {
        return $this->loans();
    }
}
