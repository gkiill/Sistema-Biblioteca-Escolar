<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    public function index(): JsonResponse
    {
        $usuarios = Usuario::orderBy("nome")->get();
        return response()->json($usuarios);
    }

    public function store(Request $request): JsonResponse
    {
        $dados = $request->validate([
            "nome" => "required|string|max:255",
            "email" => "required|email|unique:usuarios,email",
            "perfil" => "nullable|string|in:aluno,professor,comunidade",
            "status" => "nullable|string|in:ativo,suspenso",
        ]);

        $usuario = Usuario::create($dados);

        return response()->json(
            [
                "mensagem" => "Usuário cadastrado com sucesso!",
                "dados" => $usuario,
            ],
            201,
        );
    }

    public function show(int $id): JsonResponse
    {
        $usuario = Usuario::with("emprestimos.livro")->findOrFail($id);
        return response()->json($usuario);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $usuario = Usuario::findOrFail($id);
        $dados = $request->validate([
            "nome" => "sometimes|required|string|max:255",
            "email" => "sometimes|required|email|unique:usuarios,email," . $id,
            "perfil" => "nullable|string|in:aluno,professor,comunidade",
            "status" => "nullable|string|in:ativo,suspenso",
        ]);

        $usuario->update($dados);

        return response()->json([
            "mensagem" => "Usuário atualizado com sucesso!",
            "dados" => $usuario,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->delete();

        return response()->json(
            [
                "mensagem" => "Usuário removido com sucesso!",
            ],
            200,
        );
    }
}
