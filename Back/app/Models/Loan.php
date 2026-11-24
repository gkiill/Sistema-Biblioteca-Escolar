<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Loan extends Model
{
    use HasFactory;

    protected $table = 'loan';

    protected $fillable = [
        'book_id',
        'user_id',
        'loan_date',
        'expected_return_date',
        'return_date',
        'status',
    ];

    protected $casts = [
        'loan_date' => 'date',
        'expected_return_date' => 'date',
        'return_date' => 'date',
    ];

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class, 'book_id');
    }

    public function livro(): BelongsTo
    {
        return $this->book();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function usuario(): BelongsTo
    {
        return $this->user();
    }
}
