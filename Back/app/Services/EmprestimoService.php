<?php

namespace App\Services;

use App\Models\Emprestimo;
use App\Models\Livro;
use App\Models\Usuario;
use Exception;

class EmprestimoService
{
    public function registrar(Livro $livro, Usuario $usuario): Emprestimo
    {
        if ($usuario->status !== 'ativo') {
            throw new Exception('O usuário está inativo ou suspenso e não pode realizar empréstimos.');
        }

        $emprestimosAtivos = $livro->emprestimos()->whereNull('data_devolucao_real')->count();
        if ($emprestimosAtivos >= $livro->quantidade) {
            throw new Exception('Este livro não possui exemplares disponíveis no momento.');
        }

        $jaComLivro = $livro->emprestimos()
            ->where('usuario_id', $usuario->id)
            ->whereNull('data_devolucao_real')
            ->exists();

        if ($jaComLivro) {
            throw new Exception('O usuário já possui um exemplar deste livro em empréstimo aberto.');
        }

        return Emprestimo::create([
            'livro_id' => $livro->id,
            'usuario_id' => $usuario->id,
            'data_emprestimo' => now()->toDateString(),
            'data_devolucao_prevista' => now()->addDays(14)->toDateString(),
            'status' => 'ativo',
        ]);
    }
}