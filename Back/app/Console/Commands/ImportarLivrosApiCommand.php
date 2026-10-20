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
                ['termo' => 'clean code', 'cat' => 'Engenharia de Software', 'qtd' => 12],
                ['termo' => 'design patterns', 'cat' => 'Engenharia de Software', 'qtd' => 12],
                ['termo' => 'computer networks', 'cat' => 'Redes & Infraestrutura', 'qtd' => 12],
                ['termo' => 'machado de assis', 'cat' => 'Literatura Brasileira', 'qtd' => 12],
                ['termo' => 'clarice lispector', 'cat' => 'Literatura Brasileira', 'qtd' => 12],
                ['termo' => 'jorge amado', 'cat' => 'Literatura Brasileira', 'qtd' => 12],
                ['termo' => 'dune frank herbert', 'cat' => 'Ficção Científica & Distopia', 'qtd' => 12],
                ['termo' => 'isaac asimov', 'cat' => 'Ficção Científica & Distopia', 'qtd' => 12],
                ['termo' => 'philip k dick', 'cat' => 'Ficção Científica & Distopia', 'qtd' => 12],
                ['termo' => 'lord of the rings', 'cat' => 'Fantasia & Aventura', 'qtd' => 12],
                ['termo' => 'harry potter', 'cat' => 'Fantasia & Aventura', 'qtd' => 12],
                ['termo' => 'percy jackson', 'cat' => 'Fantasia & Aventura', 'qtd' => 12],
                ['termo' => 'agatha christie', 'cat' => 'Suspense & Mistério', 'qtd' => 12],
                ['termo' => 'sherlock holmes', 'cat' => 'Suspense & Mistério', 'qtd' => 12],
                ['termo' => 'stephen king', 'cat' => 'Suspense & Mistério', 'qtd' => 12],
                ['termo' => 'sapiens harari', 'cat' => 'História & Filosofia', 'qtd' => 12],
                ['termo' => 'filosofia', 'cat' => 'História & Filosofia', 'qtd' => 12],
                ['termo' => 'psicologia', 'cat' => 'História & Filosofia', 'qtd' => 12],
            ];

            $totalGeral = 0;
            foreach ($temas as $t) {
                $this->line("Buscando livros sobre '{$t['termo']}'...");
                $count = $booksService->importarPorTermo($t['termo'], $t['cat'], $t['qtd']);
                $this->info(" -> {$count} livros importados para '{$t['cat']}'.");
                $totalGeral += $count;
                usleep(250000); // 250ms de cortesia para a API
            }

            $this->info("Importação em massa concluída! Total de livros adicionados nesta rodada: {$totalGeral}");
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
