<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Category extends Model
{
    use HasFactory;

    protected $table = 'category';

    protected $fillable = [
        'name',
        'description',
    ];

    public function books(): BelongsToMany
    {
        return $this->belongsToMany(Book::class, 'book_category', 'category_id', 'book_id');
    }

    public function livros(): BelongsToMany
    {
        return $this->books();
    }
}
