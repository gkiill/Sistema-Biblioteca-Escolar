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
        // Normaliza o e-mail em minúsculas e sem espaços
        $email = strtolower(trim((string) $request->input("email", "")));
        $request->merge(["email" => $email]);

        // Verifica unicidade antes mesmo das outras validações para mensagem amigável
        if (\App\Models\User::whereRaw("LOWER(email) = ?", [$email])->exists()) {
            return response()->json(
                [
                    "message" => "Este e-mail institucional já está cadastrado no sistema. Faça login com suas credenciais ou use outro e-mail.",
                    "errors" => ["email" => ["Este e-mail já está cadastrado no sistema."]],
                ],
                422,
            );
        }

        $dados = $request->validate([
            "name" => "required|string|max:255",
            "email" => "required|email|max:255|unique:users,email",
            "password" => "required|string|min:6",
            "role" => "nullable|string|in:aluno,professor",
            "documento" => "required|string|max:50",
        ]);

        $role = $dados["role"] ?? "aluno";
        $documento = trim($dados["documento"]);

        // Validação e formatação específica por perfil (CPF para professor, RA para aluno)
        if ($role === "professor") {
            $cpfLimpo = preg_replace("/\D/", "", $documento);
            if (!$this->validarCpf($cpfLimpo)) {
                return response()->json(
                    [
                        "message" => "O CPF informado é inválido. Digite um CPF válido com 11 dígitos.",
                        "errors" => ["documento" => ["CPF inválido."]],
                    ],
                    422,
                );
            }
            $documento = $this->formatarCpf($cpfLimpo);
        } else {
            // Aluno: RA numérico ou alfanumérico
            if (strlen($documento) < 3 || strlen($documento) > 20) {
                return response()->json(
                    [
                        "message" => "O RA informado é inválido. Digite um RA válido com no mínimo 3 dígitos.",
                        "errors" => ["documento" => ["RA inválido."]],
                    ],
                    422,
                );
            }
        }

        $user = \App\Models\User::create([
            "name" => trim($dados["name"]),
            "email" => $email,
            "password" => bcrypt($dados["password"]),
        ]);

        // Vincula ou atualiza na tabela usuarios (leitores da biblioteca)
        \App\Models\Usuario::updateOrCreate(
            ["email" => $email],
            [
                "nome" => trim($dados["name"]),
                "perfil" => $role,
                "status" => "ativo",
            ],
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
                    "role" => $role,
                    "documento" => $documento,
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
        $email = strtolower(trim((string) $request->input("email", "")));
        $request->merge(["email" => $email]);

        $credenciais = $request->validate([
            "email" => "required|email",
            "password" => "required|string",
        ]);

        if (Auth::attempt(["email" => $email, "password" => $credenciais["password"]], $request->boolean("remember", true))) {
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

    /**
     * Valida o algoritmo de dígitos verificadores do CPF brasileiro.
     */
    private function validarCpf(string $cpf): bool
    {
        $cpf = preg_replace("/\D/", "", $cpf);

        if (strlen($cpf) !== 11 || preg_match("/^(\d)\\1{10}$/", $cpf)) {
            return false;
        }

        for ($t = 9; $t < 11; $t++) {
            $d = 0;
            for ($c = 0; $c < $t; $c++) {
                $d += (int) $cpf[$c] * (($t + 1) - $c);
            }
            $d = ((10 * $d) % 11) % 10;
            if ((int) $cpf[$c] !== $d) {
                return false;
            }
        }

        return true;
    }

    /**
     * Formata CPF no padrão 000.000.000-00.
     */
    private function formatarCpf(string $cpf): string
    {
        $cpf = preg_replace("/\D/", "", $cpf);
        return preg_replace("/(\d{3})(\d{3})(\d{3})(\d{2})/", "$1.$2.$3-$4", $cpf);
    }
}
