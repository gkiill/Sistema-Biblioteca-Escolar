<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Emprestimo;
use Illuminate\Http\JsonResponse;

class DevolucaoController extends Controller
{
    public function __invoke(int $id): JsonResponse
    {
        $emprestimo = Emprestimo::findOrFail($id);

        if ($emprestimo->data_devolucao_real !== null) {
            return response()->json([
                'erro' => 'Este empréstimo já foi devolvido anteriormente.',
            ], 422);
        }

        $emprestimo->update([
            'data_devolucao_real' => now()->toDateString(),
            'status' => 'devolvido',
        ]);

        $emprestimo->load(['livro', 'usuario']);

        return response()->json([
            'mensagem' => 'Livro devolvido com sucesso!',
            'dados' => $emprestimo,
        ]);
    }
}