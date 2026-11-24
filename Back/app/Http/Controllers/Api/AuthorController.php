<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Author;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    public function index(): JsonResponse
    {
        $authors = Author::withCount("books")->orderBy("name")->get();
        return response()->json($authors);
    }

    public function store(Request $request): JsonResponse
    {
        $dados = $request->validate([
            "name" => "required|string|max:255",
            "biography" => "nullable|string",
        ]);

        $author = Author::create($dados);

        return response()->json(
            [
                "mensagem" => "Autor cadastrado com sucesso!",
                "dados" => $author,
            ],
            201,
        );
    }

    public function show(int $id): JsonResponse
    {
        $author = Author::with("books")->findOrFail($id);
        return response()->json($author);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $author = Author::findOrFail($id);
        $dados = $request->validate([
            "name" => "sometimes|required|string|max:255",
            "biography" => "nullable|string",
        ]);

        $author->update($dados);

        return response()->json([
            "mensagem" => "Autor atualizado com sucesso!",
            "dados" => $author,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $author = Author::findOrFail($id);
        $author->delete();

        return response()->json(
            [
                "mensagem" => "Autor removido com sucesso!",
            ],
            200,
        );
    }
}
