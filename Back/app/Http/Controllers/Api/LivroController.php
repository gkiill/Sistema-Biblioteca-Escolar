<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLivroRequest;
use App\Http\Requests\UpdateLivroRequest;
use App\Models\Livro;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LivroController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Livro::with(["autor", "categorias"])
            ->withCount([
                "emprestimos as emprestimos_ativos_count" => function ($q) {
                    $q->whereNull("data_devolucao_real");
                },
            ]);

        if ($busca = $request->query("busca")) {
            $query->where(function ($q) use ($busca) {
                $q->where("titulo", "like", "%{$busca}%")
                    ->orWhere("isbn", "like", "%{$busca}%")
                    ->orWhereHas("autor", function ($sub) use ($busca) {
                        $sub->where("nome", "like", "%{$busca}%");
                    });
            });
        }

        if ($categoriaId = $request->query("categoria_id")) {
            $query->whereHas("categorias", function ($q) use ($categoriaId) {
                $q->where("categorias.id", $categoriaId);
            });
        }

        if ($status = $request->query("status")) {
            if ($status === "disponivel") {
                $query->whereRaw("quantidade > (SELECT count(*) FROM emprestimos WHERE emprestimos.livro_id = livros.id AND data_devolucao_real IS NULL)");
            } elseif ($status === "emprestado") {
                $query->whereRaw("(SELECT count(*) FROM emprestimos WHERE emprestimos.livro_id = livros.id AND data_devolucao_real IS NULL) > 0");
            }
        }

        $campoOrdenacao = $request->query("ordenar", "titulo");
        $direcao = $request->query("direcao", "asc");
        $query->orderBy($campoOrdenacao, $direcao);

        $livros = $query->paginate($request->query("per_page", 10));

        return response()->json($livros);
    }

    /**
     * Retorna métricas consolidadas do estoque para o inventário do bibliotecário.
     */
    public function metricasInventario(): JsonResponse
    {
        $totalExemplares = (int) Livro::sum("quantidade");
        $totalTitulos = Livro::count();
        $emprestimosAtivos = \App\Models\Emprestimo::whereNull("data_devolucao_real")->count();
        $atrasados = \App\Models\Emprestimo::whereNull("data_devolucao_real")
            ->where("data_devolucao_prevista", "<", now()->toDateString())
            ->count();
        $disponiveis = max(0, $totalExemplares - $emprestimosAtivos);
        $percentualDisponivel = $totalExemplares > 0 ? round(($disponiveis / $totalExemplares) * 100) : 0;

        return response()->json([
            "total_estoque" => $totalExemplares,
            "total_titulos" => $totalTitulos,
            "disponivel" => $disponiveis,
            "percentual_disponivel" => $percentualDisponivel,
            "emprestados" => $emprestimosAtivos,
            "atrasados" => $atrasados,
        ]);
    }

    public function store(StoreLivroRequest $request): JsonResponse
    {
        $dados = $request->validated();
        $categorias = $dados["categorias"] ?? [];
        unset($dados["categorias"]);

        // Se veio o nome do autor pela busca da API, localiza ou cria o autor no banco
        if (!empty($dados["autor_nome"]) && empty($dados["autor_id"])) {
            $autor = \App\Models\Autor::firstOrCreate([
                "nome" => trim($dados["autor_nome"]),
            ]);
            $dados["autor_id"] = $autor->id;
        }
        unset($dados["autor_nome"]);

        $livro = Livro::create($dados);

        if (!empty($categorias)) {
            $livro->categorias()->sync($categorias);
        }

        $livro->load(["autor", "categorias"]);

        return response()->json(
            [
                "mensagem" => "Livro cadastrado com sucesso!",
                "dados" => $livro,
            ],
            201,
        );
    }

    public function show(int $id): JsonResponse
    {
        $livro = Livro::with([
            "autor",
            "categorias",
            "emprestimos.usuario",
        ])->findOrFail($id);

        return response()->json($livro);
    }

    public function update(UpdateLivroRequest $request, int $id): JsonResponse
    {
        $livro = Livro::findOrFail($id);
        $dados = $request->validated();

        if (array_key_exists("categorias", $dados)) {
            $livro->categorias()->sync($dados["categorias"] ?? []);
            unset($dados["categorias"]);
        }

        $livro->update($dados);
        $livro->load(["autor", "categorias"]);

        return response()->json([
            "mensagem" => "Livro atualizado com sucesso!",
            "dados" => $livro,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $livro = Livro::findOrFail($id);
        $livro->delete();

        return response()->json(
            [
                "mensagem" => "Livro removido com sucesso!",
            ],
            200,
        );
    }
}
