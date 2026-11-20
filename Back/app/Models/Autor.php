<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Autor extends Model
{
    use HasFactory;

    protected $table = 'author';

    protected $fillable = [
        'name',
        'biography',
    ];

    public function livros(): HasMany
    {
        return $this->hasMany(book::class, 'authr_id');
    }
}