<?php

namespace App\Console\Commands;

use App\Services\GoogleBooksService;
use Illuminate\Console\Command;

class ImportarLivrosApiCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'biblioteca:importar-api 
                            {--termo= : Termo ou assunto para buscar na Open Library API}
                            {--categoria=Geral : Nome da categoria a vincular}
                            {--limite=10 : Quantidade máxima de livros a importar}
                            {--tudo : Importa um acervo completo de múltiplos temas padrão}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Importa livros automaticamente da API pública da Open Library para o banco de dados';

    /**
     * Execute the console command.
     */
    public function handle(GoogleBooksService $booksService): int
    {
        $this->info('Iniciando importação de livros via Open Library API...');

        if ($this->option('tudo')) {
            $temas = [
                ['termo' => 'software engineering', 'cat' => 'Engenharia de Software', 'qtd' => 6],
                ['termo' => 'literatura brasileira', 'cat' => 'Literatura Brasileira', 'qtd' => 6],
                ['termo' => 'science fiction', 'cat' => 'Ficção Científica & Distopia', 'qtd' => 6],
                ['termo' => 'fantasy', 'cat' => 'Fantasia & Aventura', 'qtd' => 6],
                ['termo' => 'history', 'cat' => 'História & Filosofia', 'qtd' => 6],
            ];

            $totalGeral = 0;
            foreach ($temas as $t) {
                $this->line("Buscando livros sobre '{$t['termo']}'...");
                $count = $booksService->importarPorTermo($t['termo'], $t['cat'], $t['qtd']);
                $this->info(" -> {$count} livros importados para '{$t['cat']}'.");
                $totalGeral += $count;
            }

            $this->info("Importação em massa concluída! Total de livros adicionados: {$totalGeral}");
            return Command::SUCCESS;
        }

        $termo = $this->option('termo') ?: 'computacao';
        $categoria = $this->option('categoria') ?: 'Tecnologia';
        $limite = (int) $this->option('limite');

        $this->line("Consultando Open Library para o termo: '{$termo}' (Limite: {$limite})...");
        $total = $booksService->importarPorTermo($termo, $categoria, $limite);

        $this->info("Sucesso! {$total} livros importados e persistidos no banco de dados.");
        return Command::SUCCESS;
    }
}
