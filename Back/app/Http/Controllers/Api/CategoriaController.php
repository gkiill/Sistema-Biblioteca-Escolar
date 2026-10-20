<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function index(): JsonResponse
    {
        $categorias = Categoria::withCount("livros")->orderBy("nome")->get();
        return response()->json($categorias);
    }

    public function store(Request $request): JsonResponse
    {
        $dados = $request->validate([
            "nome" => "required|string|max:100|unique:categorias,nome",
            "descricao" => "nullable|string|max:255",
        ]);

        $categoria = Categoria::create($dados);

        return response()->json(
            [
                "mensagem" => "Categoria criada com sucesso!",
                "dados" => $categoria,
            ],
            201,
        );
    }

    public function show(int $id): JsonResponse
    {
        $categoria = Categoria::with("livros.autor")->findOrFail($id);
        return response()->json($categoria);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $categoria = Categoria::findOrFail($id);
        $dados = $request->validate([
            "nome" =>
                "sometimes|required|string|max:100|unique:categorias,nome," .
                $id,
            "descricao" => "nullable|string|max:255",
        ]);

        $categoria->update($dados);

        return response()->json([
            "mensagem" => "Categoria atualizada com sucesso!",
            "dados" => $categoria,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->delete();

        return response()->json(
            [
                "mensagem" => "Categoria removida com sucesso!",
            ],
            200,
        );
    }
}
