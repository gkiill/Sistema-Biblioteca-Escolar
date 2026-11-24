<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Loan;
use App\Models\User;
use App\Services\LoanService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LoanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Loan::with(['book.author', 'user'])->latest('loan_date');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $emprestimos = $query->paginate(15);

        return response()->json($emprestimos);
    }

    public function store(Request $request, LoanService $service): JsonResponse
    {
        $livro = null;
        $usuario = null;

        if ($request->filled('book_id')) {
            $livro = Book::find($request->input('book_id'));
        } elseif ($request->filled('bookIsbn')) {
            $isbnLimpo = preg_replace('/[-\s]/', '', (string) $request->input('bookIsbn'));
            $livro = Book::where('isbn', $isbnLimpo)
                ->orWhere('isbn', (string) $request->input('bookIsbn'))
                ->first();
        }
        if (!$livro && $request->filled('bookTitle')) {
            $livro = Book::where('title', 'ilike', '%' . trim((string) $request->input('bookTitle')) . '%')->first();
        }

        if ($request->filled('user_id')) {
            $usuario = User::find($request->input('user_id'));
        } elseif ($request->filled('userEmail')) {
            $email = strtolower(trim((string) $request->input('userEmail')));
            $usuario = User::whereRaw('LOWER(email) = ?', [$email])->first();
        }
        if (!$usuario && $request->filled('userId')) {
            $doc = preg_replace('/[^a-zA-Z0-9]/', '', (string) $request->input('userId'));
            $usuario = User::where('document', $doc)->orWhere('id', is_numeric($doc) ? (int) $doc : -1)->first();
        }

        if (!$livro) {
            return response()->json(['erro' => 'Livro não encontrado no acervo (verifique ISBN ou título).'], 422);
        }
        if (!$usuario) {
            return response()->json(['erro' => 'Usuário não encontrado (verifique e-mail ou RA/ID).'], 422);
        }

        try {
            $emprestimo = $service->registrar(
                $livro,
                $usuario,
                $request->input('pickupDate'),
                $request->input('returnDate'),
            );
            $emprestimo->load(['book.author', 'user']);

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
        $emprestimo = Loan::with(['book.author', 'user'])->findOrFail($id);
        return response()->json($emprestimo);
    }
}
