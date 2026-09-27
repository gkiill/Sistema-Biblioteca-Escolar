<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Autor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AutorController extends Controller
{
    public function index(): JsonResponse
    {
        $autores = Autor::withCount("livros")->orderBy("nome")->get();
        return response()->json($autores);
    }

    public function store(Request $request): JsonResponse
    {
        $dados = $request->validate([
            "nome" => "required|string|max:255",
            "biografia" => "nullable|string",
        ]);

        $autor = Autor::create($dados);

        return response()->json(
            [
                "mensagem" => "Autor cadastrado com sucesso!",
                "dados" => $autor,
            ],
            201,
        );
    }

    public function show(int $id): JsonResponse
    {
        $autor = Autor::with("livros")->findOrFail($id);
        return response()->json($autor);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $autor = Autor::findOrFail($id);
        $dados = $request->validate([
            "nome" => "sometimes|required|string|max:255",
            "biografia" => "nullable|string",
        ]);

        $autor->update($dados);

        return response()->json([
            "mensagem" => "Autor atualizado com sucesso!",
            "dados" => $autor,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $autor = Autor::findOrFail($id);
        $autor->delete();

        return response()->json(
            [
                "mensagem" => "Autor removido com sucesso!",
            ],
            200,
        );
    }
}
