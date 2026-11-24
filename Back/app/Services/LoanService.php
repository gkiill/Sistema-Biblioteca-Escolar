<?php

namespace App\Services;

use App\Models\Book;
use App\Models\Loan;
use App\Models\User;
use Exception;

class LoanService
{
    public function registrar(
        Book $livro,
        User $usuario,
        ?string $pickupDate = null,
        ?string $returnDate = null,
    ): Loan {
        if ($usuario->status !== 'ativo') {
            throw new Exception('O usuário está inativo ou suspenso e não pode realizar empréstimos.');
        }

        $emprestimosAtivos = $livro->loans()->whereNull('return_date')->count();
        if ($emprestimosAtivos >= $livro->amount) {
            throw new Exception('Este livro não possui exemplares disponíveis no momento.');
        }

        $jaComLivro = $livro->loans()
            ->where('user_id', $usuario->id)
            ->whereNull('return_date')
            ->exists();

        if ($jaComLivro) {
            throw new Exception('O usuário já possui um exemplar deste livro em empréstimo aberto.');
        }

        return Loan::create([
            'book_id' => $livro->id,
            'user_id' => $usuario->id,
            'loan_date' => $pickupDate ?: now()->toDateString(),
            'expected_return_date' => $returnDate ?: now()->addDays(14)->toDateString(),
            'status' => 'ativo',
        ]);
    }
}
