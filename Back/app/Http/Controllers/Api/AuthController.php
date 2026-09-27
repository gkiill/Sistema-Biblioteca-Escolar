<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
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

            return response()->json([
                "mensagem" => "Login realizado com sucesso!",
                "usuario" => [
                    "id" => $user->id,
                    "name" => $user->name,
                    "email" => $user->email,
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

        return response()->json([
            "autenticado" => true,
            "usuario" => [
                "id" => $user->id,
                "name" => $user->name,
                "email" => $user->email,
            ],
        ]);
    }
}
