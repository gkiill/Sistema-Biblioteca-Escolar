<?php

namespace App\Services;

use App\Models\Emprestimo;
use App\Models\Livro;
use App\Models\User;
use Exception;

class EmprestimoService
{
    public function registrar(Livro $livro, User $usuario): Emprestimo
    {
        if ($usuario->status !== 'ativo') {
            throw new Exception('O usuário está inativo ou suspenso e não pode realizar empréstimos.');
        }

        $emprestimosAtivos = $livro->emprestimos()->whereNull('return_date')->count();
        if ($emprestimosAtivos >= $livro->amount) {
            throw new Exception('Este livro não possui exemplares disponíveis no momento.');
        }

        $jaComLivro = $livro->emprestimos()
            ->where('user_id', $usuario->id)
            ->whereNull('return_date')
            ->exists();

        if ($jaComLivro) {
            throw new Exception('O usuário já possui um exemplar deste livro em empréstimo aberto.');
        }

        return Emprestimo::create([
            'book_id' => $livro->id,
            'user_id' => $usuario->id,
            'loan_date' => now()->toDateString(),
            'expected_return_date' => now()->addDays(14)->toDateString(),
            'status' => 'ativo',
        ]);
    }
}