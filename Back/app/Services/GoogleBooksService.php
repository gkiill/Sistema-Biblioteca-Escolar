<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleBooksService
{
    /**
     * Busca dados do livro via Google Books API com fallback para Open Library e BrasilAPI.
     */
    public function buscarPorIsbn(string $isbn): ?array
    {
        $isbnLimpo = preg_replace("/[^0-9X]/i", "", $isbn);

        if (empty($isbnLimpo)) {
            return null;
        }

        // 1. Tentar Google Books API
        $dadosGoogle = $this->buscarGoogleBooks($isbnLimpo);
        if ($dadosGoogle) {
            return $dadosGoogle;
        }

        // 2. Fallback: Open Library API (Busca internacional)
        $dadosOpenLibrary = $this->buscarOpenLibrary($isbnLimpo);
        if ($dadosOpenLibrary) {
            return $dadosOpenLibrary;
        }

        // 3. Fallback: BrasilAPI (Catálogo de ISBNs e editoras brasileiras)
        return $this->buscarBrasilApi($isbnLimpo);
    }

    private function buscarGoogleBooks(string $isbn): ?array
    {
        try {
            $response = Http::timeout(5)->get(
                "https://www.googleapis.com/books/v1/volumes",
                [
                    "q" => "isbn:" . $isbn,
                    "maxResults" => 1,
                ],
            );

            if (!$response->successful()) {
                return null;
            }

            $body = $response->json();
            if (empty($body["items"][0]["volumeInfo"])) {
                return null;
            }

            $info = $body["items"][0]["volumeInfo"];

            $ano = null;
            if (!empty($info["publishedDate"])) {
                $ano = (int) substr($info["publishedDate"], 0, 4);
            }

            $capaUrl = null;
            if (!empty($info["imageLinks"])) {
                $capaUrl =
                    $info["imageLinks"]["thumbnail"] ??
                    ($info["imageLinks"]["smallThumbnail"] ?? null);
                if ($capaUrl) {
                    $capaUrl = str_replace("http://", "https://", $capaUrl);
                }
            }

            return [
                "origem" => "Google Books",
                "isbn" => $isbn,
                "titulo" => $info["title"] ?? "",
                "subtitulo" => $info["subtitle"] ?? null,
                "autor" => !empty($info["authors"])
                    ? implode(", ", $info["authors"])
                    : "Autor Desconhecido",
                "editora" => $info["publisher"] ?? null,
                "ano_publicacao" => $ano,
                "paginas" => $info["pageCount"] ?? null,
                "sinopse" => $info["description"] ?? null,
                "capa_url" => $capaUrl,
                "categorias" => $info["categories"] ?? [],
            ];
        } catch (\Throwable $e) {
            Log::warning(
                "Erro ao consultar Google Books API: " . $e->getMessage(),
            );
            return null;
        }
    }

    private function buscarOpenLibrary(string $isbn): ?array
    {
        try {
            $response = Http::timeout(6)
                ->retry(2, 300)
                ->withUserAgent('SistemaBibliotecaEscolarFatec/1.0 (fatec.sp.gov.br; contato@fatec.sp.gov.br)')
                ->get(
                    "https://openlibrary.org/search.json",
                    [
                        "isbn" => $isbn,
                    ],
                );

            if (!$response->successful()) {
                return null;
            }

            $body = $response->json();
            if (empty($body["docs"][0])) {
                return null;
            }

            $doc = $body["docs"][0];

            $capaUrl = null;
            if (!empty($doc["cover_i"])) {
                $capaUrl = "https://covers.openlibrary.org/b/id/{$doc["cover_i"]}-L.jpg";
            }

            return [
                "origem" => "Open Library",
                "isbn" => $isbn,
                "titulo" => $doc["title"] ?? "",
                "subtitulo" => null,
                "autor" => !empty($doc["author_name"])
                    ? implode(", ", $doc["author_name"])
                    : "Autor Desconhecido",
                "editora" => !empty($doc["publisher"])
                    ? $doc["publisher"][0]
                    : null,
                "ano_publicacao" => $doc["first_publish_year"] ?? null,
                "paginas" => $doc["number_of_pages_median"] ?? null,
                "sinopse" => null,
                "capa_url" => $capaUrl,
                "categorias" => $doc["subject"] ?? [],
            ];
        } catch (\Throwable $e) {
            Log::warning(
                "Erro ao consultar Open Library API: " . $e->getMessage(),
            );
            return null;
        }
    }

    private function buscarBrasilApi(string $isbn): ?array
    {
        try {
            $response = Http::timeout(5)->get(
                "https://brasilapi.com.br/api/isbn/v1/{$isbn}",
            );

            if (!$response->successful()) {
                return null;
            }

            $body = $response->json();
            if (empty($body["title"])) {
                return null;
            }

            return [
                "origem" => "BrasilAPI",
                "isbn" => $isbn,
                "titulo" => $body["title"],
                "subtitulo" => $body["subtitle"] ?? null,
                "autor" => !empty($body["authors"])
                    ? implode(", ", $body["authors"])
                    : "Autor Desconhecido",
                "editora" => $body["publisher"] ?? null,
                "ano_publicacao" => $body["year"] ?? null,
                "paginas" => $body["page_count"] ?? null,
                "sinopse" => $body["synopsis"] ?? null,
                "capa_url" => $body["cover_url"] ?? null,
                "categorias" => $body["subjects"] ?? [],
            ];
        } catch (\Throwable $e) {
            Log::warning("Erro ao consultar BrasilAPI: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Busca livros por termo ou assunto na Open Library API.
     */
    public function buscarPorTexto(string $termo, int $limit = 20): array
    {
        try {
            $response = Http::timeout(10)
                ->retry(2, 400)
                ->withUserAgent('SistemaBibliotecaEscolarFatec/1.0 (fatec.sp.gov.br; contato@fatec.sp.gov.br)')
                ->get('https://openlibrary.org/search.json', [
                    'q' => $termo,
                    'limit' => $limit,
                ]);

            if (!$response->successful()) {
                return [];
            }

            $body = $response->json();
            $docs = $body['docs'] ?? [];
            $resultados = [];

            foreach ($docs as $doc) {
                // Apenas importar livros que têm capa oficial disponível
                if (empty($doc['cover_i']) || empty($doc['title'])) {
                    continue;
                }

                $isbn = !empty($doc['isbn']) ? $doc['isbn'][0] : null;
                $capaUrl = "https://covers.openlibrary.org/b/id/{$doc['cover_i']}-L.jpg";
                $autor = !empty($doc['author_name'])
                    ? implode(', ', array_slice($doc['author_name'], 0, 2))
                    : 'Autor Desconhecido';
                $categoria = !empty($doc['subject']) ? $doc['subject'][0] : 'Geral';

                $resultados[] = [
                    'titulo' => $doc['title'],
                    'autor' => $autor,
                    'ano_publicacao' => $doc['first_publish_year'] ?? null,
                    'isbn' => $isbn,
                    'capa_url' => $capaUrl,
                    'categoria' => $categoria,
                    'editora' => !empty($doc['publisher']) ? $doc['publisher'][0] : null,
                ];
            }

            return $resultados;
        } catch (\Throwable $e) {
            Log::warning('Erro ao buscar livros por texto na Open Library: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Importa livros por termo diretamente para o banco de dados.
     */
    public function importarPorTermo(string $termo, string $categoriaNome = 'Geral', int $limit = 20): int
    {
        $livros = $this->buscarPorTexto($termo, $limit);
        $importados = 0;

        $categoria = \App\Models\Categoria::firstOrCreate(['nome' => $categoriaNome]);

        foreach ($livros as $item) {
            if (empty($item['titulo']) || empty($item['capa_url'])) {
                continue;
            }

            $autor = \App\Models\Autor::firstOrCreate(
                ['nome' => $item['autor']],
                ['biografia' => 'Autor importado via integração com Open Library API.']
            );

            $isbn = $item['isbn'] ?? ('978' . str_pad((string) abs(crc32($item['titulo'])), 10, '0', STR_PAD_LEFT));

            $livro = \App\Models\Livro::firstOrCreate(
                ['titulo' => $item['titulo']],
                [
                    'isbn' => $isbn,
                    'ano_publicacao' => $item['ano_publicacao'] ?? date('Y'),
                    'sinopse' => "Obra do acervo internacional sobre {$termo}.",
                    'capa_url' => $item['capa_url'],
                    'quantidade' => rand(2, 6),
                    'autor_id' => $autor->id,
                ]
            );

            if (!$livro->categorias()->where('categoria_id', $categoria->id)->exists()) {
                $livro->categorias()->attach($categoria->id);
            }

            $importados++;
        }

        return $importados;
    }
}
