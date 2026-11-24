<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Loan;
use Illuminate\Http\JsonResponse;

class DevolucaoController extends Controller
{
    public function __invoke(int $id): JsonResponse
    {
        $emprestimo = Loan::findOrFail($id);

        if ($emprestimo->return_date !== null) {
            return response()->json([
                'erro' => 'Este empréstimo já foi devolvido anteriormente.',
            ], 422);
        }

        $emprestimo->update([
            'return_date' => now()->toDateString(),
            'status' => 'devolvido',
        ]);

        $emprestimo->load(['book', 'user']);

        return response()->json([
            'mensagem' => 'Livro devolvido com sucesso!',
            'dados' => $emprestimo,
        ]);
    }
}
