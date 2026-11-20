<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $usuarios = User::orderBy("name")->get();
        return response()->json($usuarios);
    }

    public function show(int $id): JsonResponse
    {
        $usuario = User::with("emprestimos.livro")->findOrFail($id);
        return response()->json($usuario);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $usuario = User::findOrFail($id);
        
        $dados = $request->validate([
            "name" => "sometimes|required|string|max:255",
            "email" => "sometimes|required|email|unique:users,email," . $id,
            "profile" => "nullable|string|in:aluno,professor,bibliotecario",
            "status" => "nullable|string|in:ativo,inativo",
            "document" => "nullable|string|max:50",
        ]);

        $usuario->update($dados);

        return response()->json([
            "mensagem" => "Usuário atualizado com sucesso!",
            "dados" => $usuario,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $usuario = User::findOrFail($id);
        $usuario->delete();

        return response()->json(
            [
                "mensagem" => "Usuário removido com sucesso!",
            ],
            200,
        );
    }
}
