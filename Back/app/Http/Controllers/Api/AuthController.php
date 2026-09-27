<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Cadastrar um novo usuário (aluno ou professor) e iniciar sessão.
     */
    public function register(Request $request): JsonResponse
    {
        $dados = $request->validate([
            "name" => "required|string|max:255",
            "email" => "required|email|max:255|unique:users,email",
            "password" => "required|string|min:6",
            "role" => "nullable|string|in:aluno,professor",
            "documento" => "nullable|string|max:50",
        ]);

        $user = \App\Models\User::create([
            "name" => $dados["name"],
            "email" => $dados["email"],
            "password" => bcrypt($dados["password"]),
        ]);

        // Vincula ou cria na tabela usuarios (leitores da biblioteca)
        $perfil = $dados["role"] ?? "aluno";
        \App\Models\Usuario::updateOrCreate(
            ["email" => $dados["email"]],
            [
                "nome" => $dados["name"],
                "perfil" => $perfil,
                "status" => "ativo",
            ]
        );

        // Autentica o usuário na sessão imediatamente
        Auth::login($user);
        $request->session()->regenerate();

        return response()->json(
            [
                "sucesso" => true,
                "mensagem" => "Cadastro realizado com sucesso!",
                "usuario" => [
                    "id" => $user->id,
                    "name" => $user->name,
                    "email" => $user->email,
                    "role" => $perfil,
                    "documento" => $dados["documento"] ?? "",
                ],
            ],
            201,
        );
    }

    /**
     * Autenticar usuário e iniciar sessão via cookies.
     */
    public function login(Request $request): JsonResponse
    {
        $credenciais = $request->validate([
            "email" => "required|email",
            "password" => "required|string",
        ]);

        if (Auth::attempt($credenciais, $request->boolean("remember", true))) {
            $request->session()->regenerate();
            $user = Auth::user();

            $usuarioLeitor = \App\Models\Usuario::where("email", $user->email)->first();
            $role = $usuarioLeitor->perfil ?? (str_contains($user->email, "admin") ? "admin" : "aluno");

            return response()->json([
                "mensagem" => "Login realizado com sucesso!",
                "usuario" => [
                    "id" => $user->id,
                    "name" => $user->name,
                    "email" => $user->email,
                    "role" => $role,
                    "documento" => "",
                ],
            ]);
        }

        return response()->json(
            [
                "mensagem" =>
                    "Credenciais inválidas. Verifique seu e-mail e senha.",
            ],
            401,
        );
    }

    /**
     * Encerrar a sessão do usuário e invalidar cookies.
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::guard("web")->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            "mensagem" => "Logout realizado com sucesso!",
        ]);
    }

    /**
     * Retornar o usuário atualmente autenticado na sessão.
     */
    public function me(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(
                [
                    "autenticado" => false,
                    "mensagem" => "Nenhum usuário autenticado na sessão.",
                ],
                401,
            );
        }

        $usuarioLeitor = \App\Models\Usuario::where("email", $user->email)->first();
        $role = $usuarioLeitor->perfil ?? (str_contains($user->email, "admin") ? "admin" : "aluno");

        return response()->json([
            "autenticado" => true,
            "usuario" => [
                "id" => $user->id,
                "name" => $user->name,
                "email" => $user->email,
                "role" => $role,
            ],
        ]);
    }
}
