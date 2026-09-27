<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GoogleBooksService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IntegracaoLivroController extends Controller
{
    public function __construct(protected GoogleBooksService $booksService) {}

    public function buscarPorIsbn(string $isbn): JsonResponse
    {
        $dados = $this->booksService->buscarPorIsbn($isbn);

        if (!$dados) {
            return response()->json(
                [
                    "mensagem" =>
                        "Nenhum livro encontrado para o ISBN informado na API pública.",
                ],
                404,
            );
        }

        return response()->json([
            "sucesso" => true,
            "dados" => $dados,
        ]);
    }

    public function buscarPorTexto(Request $request): JsonResponse
    {
        $termo = $request->query('q', '');
        $limit = min((int) $request->query('limit', 12), 30);

        if (empty(trim($termo))) {
            return response()->json([
                'sucesso' => true,
                'dados' => [],
            ]);
        }

        $dados = $this->booksService->buscarPorTexto($termo, $limit);

        return response()->json([
            'sucesso' => true,
            'termo' => $termo,
            'total' => count($dados),
            'dados' => $dados,
        ]);
    }

    public function importar(Request $request): JsonResponse
    {
        $termo = $request->input('termo', 'tecnologia');
        $categoria = $request->input('categoria', 'Geral');
        $limite = min((int) $request->input('limite', 10), 30);

        $totalImportados = $this->booksService->importarPorTermo($termo, $categoria, $limite);

        return response()->json([
            'sucesso' => true,
            'mensagem' => "{$totalImportados} livros foram importados com sucesso da API pública para o banco de dados.",
            'total_importados' => $totalImportados,
        ]);
    }
}
