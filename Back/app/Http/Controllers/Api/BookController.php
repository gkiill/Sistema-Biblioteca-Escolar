<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Models\Author;
use App\Models\Book;
use App\Models\Category;
use App\Models\Loan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Book::with(["author", "categories"])
            ->withCount([
                "loans as emprestimos_ativos_count" => function ($q) {
                    $q->whereNull("return_date");
                },
            ]);

        if ($busca = $request->query("busca")) {
            $query->where(function ($q) use ($busca) {
                $q->where("title", "like", "%{$busca}%")
                    ->orWhere("isbn", "like", "%{$busca}%")
                    ->orWhereHas("author", function ($sub) use ($busca) {
                        $sub->where("name", "like", "%{$busca}%");
                    });
            });
        }

        if ($categoriaId = $request->query("category_id")) {
            $query->whereHas("categories", function ($q) use ($categoriaId) {
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

    public function metricasInventario(): JsonResponse
    {
        $totalExemplares = (int) Book::sum("amount");
        $totalTitulos = Book::count();
        $emprestimosAtivos = Loan::whereNull("return_date")->count();
        $atrasados = Loan::whereNull("return_date")
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

    public function store(StoreBookRequest $request): JsonResponse
    {
        $dados = $request->validated();
        $categorias = $dados["categories"] ?? [];
        $categoryName = $dados["category"] ?? null;
        unset($dados["categories"], $dados["category"]);

        if (!empty($categoryName)) {
            $cat = Category::firstOrCreate(["name" => trim($categoryName)]);
            $categorias[] = $cat->id;
        }

        if (!empty($dados["author_name"]) && empty($dados["author_id"])) {
            $author = Author::firstOrCreate([
                "name" => trim($dados["author_name"]),
            ]);
            $dados["author_id"] = $author->id;
        }
        unset($dados["author_name"]);

        $livro = Book::create($dados);

        if (!empty($categorias)) {
            $livro->categories()->sync(array_unique($categorias));
        }

        $livro->load(["author", "categories"]);

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
        $livro = Book::with([
            "author",
            "categories",
            "loans.user",
        ])->findOrFail($id);

        return response()->json($livro);
    }

    public function update(UpdateBookRequest $request, int $id): JsonResponse
    {
        $livro = Book::findOrFail($id);
        $dados = $request->validated();

        if (array_key_exists("categories", $dados)) {
            $livro->categories()->sync($dados["categories"] ?? []);
            unset($dados["categories"]);
        }

        $livro->update($dados);
        $livro->load(["author", "categories"]);

        return response()->json([
            "mensagem" => "Livro atualizado com sucesso!",
            "dados" => $livro,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $livro = Book::findOrFail($id);
        $livro->delete();

        return response()->json(
            [
                "mensagem" => "Livro removido com sucesso!",
            ],
            200,
        );
    }
}
