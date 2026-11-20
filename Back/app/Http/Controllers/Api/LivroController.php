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
                    $q->whereNull("return_date");
                },
            ]);

        if ($busca = $request->query("busca")) {
            $query->where(function ($q) use ($busca) {
                $q->where("title", "like", "%{$busca}%")
                    ->orWhere("isbn", "like", "%{$busca}%")
                    ->orWhereHas("autor", function ($sub) use ($busca) {
                        $sub->where("name", "like", "%{$busca}%");
                    });
            });
        }

        if ($categoriaId = $request->query("category_id")) {
            $query->whereHas("categorias", function ($q) use ($categoriaId) {
                $q->where("category.id", $categoriaId);
            });
        }

        if ($status = $request->query("status")) {
            if ($status === "disponivel") {
                $query->whereRaw("amount > (SELECT count(*) FROM loan WHERE loan.book_id = book.id AND return_date IS NULL)");
            } elseif ($status === "emprestado") {
                $query->whereRaw("(SELECT count(*) FROM loan WHERE loan.book_id = book.id AND return_date IS NULL) > 0");
            }
        }

        $campoOrdenacao = $request->query("ordenar", "title");
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
        $totalExemplares = (int) Livro::sum("amount");
        $totalTitulos = Livro::count();
        $emprestimosAtivos = \App\Models\Emprestimo::whereNull("return_date")->count();
        $atrasados = \App\Models\Emprestimo::whereNull("return_date")
            ->where("expected_return_date", "<", now()->toDateString())
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
        $categorias = $dados["categories"] ?? [];
        unset($dados["categories"]);

        // Se veio o nome do autor pela busca da API, localiza ou cria o autor no banco
        if (!empty($dados["author_name"]) && empty($dados["author_id"])) {
            $author = \App\Models\Autor::firstOrCreate([
                "name" => trim($dados["author_name"]),
            ]);
            $dados["author_id"] = $author->id;
        }
        unset($dados["author_name"]);

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

        if (array_key_exists("categories", $dados)) {
            $livro->categorias()->sync($dados["categories"] ?? []);
            unset($dados["categories"]);
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
