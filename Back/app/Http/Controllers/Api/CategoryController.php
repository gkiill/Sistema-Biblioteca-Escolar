<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::withCount("books")->orderBy("name")->get();
        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $dados = $request->validate([
            "name" => "required|string|max:100|unique:category,name",
            "description" => "nullable|string|max:255",
        ]);

        $category = Category::create($dados);

        return response()->json(
            [
                "mensagem" => "Categoria criada com sucesso!",
                "dados" => $category,
            ],
            201,
        );
    }

    public function show(int $id): JsonResponse
    {
        $category = Category::with("books.author")->findOrFail($id);
        return response()->json($category);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $dados = $request->validate([
            "name" =>
                "sometimes|required|string|max:100|unique:category,name," .
                $id,
            "description" => "nullable|string|max:255",
        ]);

        $category->update($dados);

        return response()->json([
            "mensagem" => "Categoria atualizada com sucesso!",
            "dados" => $category,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json(
            [
                "mensagem" => "Categoria removida com sucesso!",
            ],
            200,
        );
    }
}
