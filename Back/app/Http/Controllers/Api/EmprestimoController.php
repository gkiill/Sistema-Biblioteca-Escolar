<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Emprestimo;
use App\Models\Livro;
use App\Models\User;
use App\Services\EmprestimoService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmprestimoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Emprestimo::with(['livro.autor', 'usuario'])->latest('loan_date');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $emprestimos = $query->paginate(15);

        return response()->json($emprestimos);
    }

    public function store(Request $request, EmprestimoService $service): JsonResponse
    {
        $dados = $request->validate([
            'book_id' => 'required|exists:book,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $livro = Livro::findOrFail($dados['book_id']);
        $usuario = User::findOrFail($dados['user_id']);

        try {
            $emprestimo = $service->registrar($livro, $usuario);
            $emprestimo->load(['livro.autor', 'usuario']);

            return response()->json([
                'mensagem' => 'Empréstimo realizado com sucesso!',
                'dados' => $emprestimo,
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'erro' => $e->getMessage(),
            ], 422);
        }
    }

    public function show(int $id): JsonResponse
    {
        $emprestimo = Emprestimo::with(['livro.autor', 'usuario'])->findOrFail($id);
        return response()->json($emprestimo);
    }
}