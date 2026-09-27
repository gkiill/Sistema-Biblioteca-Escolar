<?php

namespace Database\Seeders;

use App\Models\Autor;
use App\Models\Categoria;
use App\Models\Emprestimo;
use App\Models\Livro;
use App\Models\User;
use App\Models\Usuario;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Usuário Administrador
        User::firstOrCreate(
            ['email' => 'admin@fatec.sp.gov.br'],
            [
                'name' => 'Administrador da Biblioteca',
                'password' => bcrypt('admin123'),
            ]
        );

        // 2. Categorias
        $catEngenharia = Categoria::firstOrCreate(['nome' => 'Engenharia de Software'], [
            'descricao' => 'Livros sobre arquitetura, padrões de projeto e boas práticas.',
        ]);
        $catRedes = Categoria::firstOrCreate(['nome' => 'Redes & Infraestrutura'], [
            'descricao' => 'Protocolos, sistemas operacionais e arquitetura de redes.',
        ]);
        $catLiteratura = Categoria::firstOrCreate(['nome' => 'Literatura Brasileira'], [
            'descricao' => 'Grandes clássicos da literatura e ficção nacional.',
        ]);
        $catFiccao = Categoria::firstOrCreate(['nome' => 'Ficção Científica & Distopia'], [
            'descricao' => 'Obras de ficção, futuros distópicos e universos fantásticos.',
        ]);
        $catFantasia = Categoria::firstOrCreate(['nome' => 'Fantasia & Aventura'], [
            'descricao' => 'Sagas clássicas de magia, fantasia e mundos épicos.',
        ]);
        $catSuspense = Categoria::firstOrCreate(['nome' => 'Suspense & Mistério'], [
            'descricao' => 'Livros de investigação, suspense psicológico e crimes.',
        ]);
        $catHistoria = Categoria::firstOrCreate(['nome' => 'História & Filosofia'], [
            'descricao' => 'Ensaios históricos, desenvolvimento humano e filosofia.',
        ]);

        // 3. Autores
        $autorUncleBob = Autor::firstOrCreate(['nome' => 'Robert C. Martin (Uncle Bob)'], [
            'biografia' => 'Engenheiro de software e autor lendário, um dos signatários do Manifesto Ágil.',
        ]);
        $autorFowler = Autor::firstOrCreate(['nome' => 'Martin Fowler'], [
            'biografia' => 'Especialista em refatoração e arquitetura corporativa na ThoughtWorks.',
        ]);
        $autorTanenbaum = Autor::firstOrCreate(['nome' => 'Andrew S. Tanenbaum'], [
            'biografia' => 'Professor emérito de Ciência da Computação e autor de manuais de referência.',
        ]);
        $autorMachado = Autor::firstOrCreate(['nome' => 'Machado de Assis'], [
            'biografia' => 'Um dos maiores nomes da literatura brasileira e fundador da ABL.',
        ]);
        $autorOrwell = Autor::firstOrCreate(['nome' => 'George Orwell'], [
            'biografia' => 'Escritor e jornalista britânico célebre por suas críticas ao totalitarismo.',
        ]);
        $autorRowling = Autor::firstOrCreate(['nome' => 'J. K. Rowling'], [
            'biografia' => 'Escritora britânica criadora da mundialmente aclamada saga de Harry Potter.',
        ]);
        $autorTolkien = Autor::firstOrCreate(['nome' => 'J. R. R. Tolkien'], [
            'biografia' => 'Filólogo e professor britânico, autor de O Hobbit e O Senhor dos Anéis.',
        ]);
        $autorExupery = Autor::firstOrCreate(['nome' => 'Antoine de Saint-Exupéry'], [
            'biografia' => 'Escritor e ilustrador francês, mundialmente conhecido por O Pequeno Príncipe.',
        ]);
        $autorMontes = Autor::firstOrCreate(['nome' => 'Raphael Montes'], [
            'biografia' => 'Escritor e roteirista brasileiro consagrado de literatura policial e suspense.',
        ]);
        $autorSaramago = Autor::firstOrCreate(['nome' => 'José Saramago'], [
            'biografia' => 'Escritor português vencedor do Prêmio Nobel de Literatura de 1998.',
        ]);
        $autorClarice = Autor::firstOrCreate(['nome' => 'Clarice Lispector'], [
            'biografia' => 'Uma das mais influentes escritoras brasileiras do século XX.',
        ]);
        $autorHarari = Autor::firstOrCreate(['nome' => 'Yuval Noah Harari'], [
            'biografia' => 'Historiador e professor israelense, autor de best-sellers globais sobre a humanidade.',
        ]);
        $autorHerbert = Autor::firstOrCreate(['nome' => 'Frank Herbert'], [
            'biografia' => 'Autor americano da aclamada e monumental saga de ficção científica Duna.',
        ]);
        $autorHunt = Autor::firstOrCreate(['nome' => 'Andrew Hunt & David Thomas'], [
            'biografia' => 'Autores do clássico O Programador Pragmático e pioneiros em desenvolvimento ágil.',
        ]);

        // 4. Catálogo Completo de Livros
        $livrosData = [
            [
                'isbn' => '9788576082675',
                'titulo' => 'Código Limpo: Habilidades Práticas do Agile Software',
                'ano_publicacao' => 2009,
                'sinopse' => 'Mesmo um código ruim pode funcionar. Mas se ele não for limpo, pode acabar com uma empresa de desenvolvimento.',
                'capa_url' => 'https://m.media-amazon.com/images/I/71T7aD3EOTL._SL1500_.jpg',
                'quantidade' => 4,
                'autor_id' => $autorUncleBob->id,
                'categoria' => $catEngenharia,
            ],
            [
                'isbn' => '9788550804606',
                'titulo' => 'Arquitetura Limpa: O Guia do Artesão para Estrutura e Design de Software',
                'ano_publicacao' => 2019,
                'sinopse' => 'Regras universais de arquitetura de software para aumentar a produtividade e sustentabilidade.',
                'capa_url' => 'https://covers.openlibrary.org/b/id/13889303-L.jpg',
                'quantidade' => 3,
                'autor_id' => $autorUncleBob->id,
                'categoria' => $catEngenharia,
            ],
            [
                'isbn' => '9788575227244',
                'titulo' => 'Refatoração: Aperfeiçoando o Design de Códigos Existentes',
                'ano_publicacao' => 2020,
                'sinopse' => 'Guia definitivo para melhorar a estrutura interna do código sem alterar seu comportamento observável.',
                'capa_url' => 'https://covers.openlibrary.org/b/id/7087623-L.jpg',
                'quantidade' => 2,
                'autor_id' => $autorFowler->id,
                'categoria' => $catEngenharia,
            ],
            [
                'isbn' => '9788576088011',
                'titulo' => 'O Programador Pragmático: Sua Jornada para a Maestria',
                'ano_publicacao' => 2010,
                'sinopse' => 'Abordagem prática com lições intemporais sobre excelência técnica e desenvolvimento pessoal.',
                'capa_url' => 'https://covers.openlibrary.org/b/id/12975971-L.jpg',
                'quantidade' => 3,
                'autor_id' => $autorHunt->id,
                'categoria' => $catEngenharia,
            ],
            [
                'isbn' => '9788543005850',
                'titulo' => 'Redes de Computadores',
                'ano_publicacao' => 2011,
                'sinopse' => 'Princípios fundamentais de sistemas de telecomunicação, camadas OSI e Internet moderna.',
                'capa_url' => 'https://covers.openlibrary.org/b/id/9378629-L.jpg',
                'quantidade' => 4,
                'autor_id' => $autorTanenbaum->id,
                'categoria' => $catRedes,
            ],
            [
                'isbn' => '9788594318602',
                'titulo' => 'Dom Casmurro',
                'ano_publicacao' => 1899,
                'sinopse' => 'A história de Bento Santiago e a clássica dúvida sobre Capitu.',
                'capa_url' => 'https://covers.openlibrary.org/b/id/647501-L.jpg',
                'quantidade' => 5,
                'autor_id' => $autorMachado->id,
                'categoria' => $catLiteratura,
            ],
            [
                'isbn' => '9788532508126',
                'titulo' => 'A Hora da Estrela',
                'ano_publicacao' => 1977,
                'sinopse' => 'A comovente trajetória de Macabéa, uma jovem alagoana que tenta sobreviver na grande metrópole do Rio de Janeiro.',
                'capa_url' => 'https://covers.openlibrary.org/b/id/14652230-L.jpg',
                'quantidade' => 3,
                'autor_id' => $autorClarice->id,
                'categoria' => $catLiteratura,
            ],
            [
                'isbn' => '9788532511010',
                'titulo' => 'Harry Potter e a Pedra Filosofal',
                'ano_publicacao' => 1997,
                'sinopse' => 'Harry descobre que é um bruxo no seu 11º aniversário e é convidado para ingressar em Hogwarts.',
                'capa_url' => 'https://covers.openlibrary.org/b/id/15155833-L.jpg',
                'quantidade' => 5,
                'autor_id' => $autorRowling->id,
                'categoria' => $catFantasia,
            ],
            [
                'isbn' => '9788532511973',
                'titulo' => 'Harry Potter e a Câmara Secreta',
                'ano_publicacao' => 1998,
                'sinopse' => 'Em seu segundo ano letivo em Hogwarts, Harry investiga mistérios e ataques aos alunos da escola.',
                'capa_url' => 'https://covers.openlibrary.org/b/id/14878347-L.jpg',
                'quantidade' => 4,
                'autor_id' => $autorRowling->id,
                'categoria' => $catFantasia,
            ],
            [
                'isbn' => '9788532512062',
                'titulo' => 'Harry Potter e o Prisioneiro de Azkaban',
                'ano_publicacao' => 1999,
                'sinopse' => 'Sirius Black escapa da prisão de Azkaban e os dementadores cercam a escola de Hogwarts.',
                'capa_url' => 'https://covers.openlibrary.org/b/id/15158656-L.jpg',
                'quantidade' => 3,
                'autor_id' => $autorRowling->id,
                'categoria' => $catFantasia,
            ],
            [
                'isbn' => '9788532520807',
                'titulo' => 'O Hobbit',
                'ano_publicacao' => 1937,
                'sinopse' => 'Bilbo Bolseiro é arrastado para uma expedição inesperada na companhia do mago Gandalf e treze anões.',
                'capa_url' => 'https://covers.openlibrary.org/b/id/14856950-L.jpg',
                'quantidade' => 4,
                'autor_id' => $autorTolkien->id,
                'categoria' => $catFantasia,
            ],
            [
                'isbn' => '9788532514332',
                'titulo' => 'O Senhor dos Anéis: A Sociedade do Anel',
                'ano_publicacao' => 1954,
                'sinopse' => 'O jovem hobbit Frodo Bolseiro recebe uma herança perigosa: o Um Anel forjado pelo Senhor do Escuro.',
                'capa_url' => 'https://covers.openlibrary.org/b/id/14856952-L.jpg',
                'quantidade' => 3,
                'autor_id' => $autorTolkien->id,
                'categoria' => $catFantasia,
            ],
            [
                'isbn' => '9788535914849',
                'titulo' => '1984',
                'ano_publicacao' => 1949,
                'sinopse' => 'Uma das distopias mais influentes do mundo: o Grande Irmão tudo vigia através da teletela.',
                'capa_url' => 'https://covers.openlibrary.org/b/id/14624442-L.jpg',
                'quantidade' => 5,
                'autor_id' => $autorOrwell->id,
                'categoria' => $catFiccao,
            ],
            [
                'isbn' => '9788535909555',
                'titulo' => 'A Revolução dos Bichos',
                'ano_publicacao' => 1945,
                'sinopse' => 'Uma alegoria brilhante sobre o poder, a corrupção e os ideais de uma revolução traída.',
                'capa_url' => 'https://covers.openlibrary.org/b/id/14548483-L.jpg',
                'quantidade' => 4,
                'autor_id' => $autorOrwell->id,
                'categoria' => $catFiccao,
            ],
            [
                'isbn' => '9788576572008',
                'titulo' => 'Duna',
                'ano_publicacao' => 1965,
                'sinopse' => 'No planeta desértico de Arrakis, a especiaria é o recurso mais cobiçado de todo o universo.',
                'capa_url' => 'https://covers.openlibrary.org/b/id/14652431-L.jpg',
                'quantidade' => 3,
                'autor_id' => $autorHerbert->id,
                'categoria' => $catFiccao,
            ],
            [
                'isbn' => '9788520933114',
                'titulo' => 'O Pequeno Príncipe',
                'ano_publicacao' => 1943,
                'sinopse' => 'Um piloto cai no deserto do Saara e encontra um menino extraordinário vindo de outro asteroide.',
                'capa_url' => 'https://covers.openlibrary.org/b/id/15112117-L.jpg',
                'quantidade' => 6,
                'autor_id' => $autorExupery->id,
                'categoria' => $catLiteratura,
            ],
            [
                'isbn' => '9788535928356',
                'titulo' => 'Jantar Secreto',
                'ano_publicacao' => 2016,
                'sinopse' => 'Jovens universitários no Rio de Janeiro se envolvem em uma espiral sombria de crimes e eventos chocantes.',
                'capa_url' => 'https://covers.openlibrary.org/b/id/14878348-L.jpg',
                'quantidade' => 3,
                'autor_id' => $autorMontes->id,
                'categoria' => $catSuspense,
            ],
            [
                'isbn' => '9788535911664',
                'titulo' => 'Ensaio Sobre a Cegueira',
                'ano_publicacao' => 1995,
                'sinopse' => 'Uma misteriosa epidemia de cegueira branca atinge uma cidade e expõe a essência da condição humana.',
                'capa_url' => 'https://covers.openlibrary.org/b/id/14603411-L.jpg',
                'quantidade' => 3,
                'autor_id' => $autorSaramago->id,
                'categoria' => $catFiccao,
            ],
            [
                'isbn' => '9788525432162',
                'titulo' => 'Sapiens: Uma Breve História da Humanidade',
                'ano_publicacao' => 2014,
                'sinopse' => 'Como uma espécie insignificante de macacos se tornou a força dominante do planeta Terra.',
                'capa_url' => 'https://covers.openlibrary.org/b/id/14878350-L.jpg',
                'quantidade' => 4,
                'autor_id' => $autorHarari->id,
                'categoria' => $catHistoria,
            ],
        ];

        foreach ($livrosData as $d) {
            $cat = $d['categoria'];
            unset($d['categoria']);

            $livro = Livro::updateOrCreate(
                ['isbn' => $d['isbn']],
                $d
            );
            $livro->categorias()->syncWithoutDetaching([$cat->id]);
        }

        // 5. Leitores Acadêmicos
        $aluno1 = Usuario::firstOrCreate(
            ['email' => 'murilo@fatec.sp.gov.br'],
            [
                'nome' => 'Murilo Silva',
                'perfil' => 'aluno',
                'status' => 'ativo',
            ]
        );

        $aluno2 = Usuario::firstOrCreate(
            ['email' => 'lucas.mendes@fatec.sp.gov.br'],
            [
                'nome' => 'Lucas Mendes',
                'perfil' => 'aluno',
                'status' => 'ativo',
            ]
        );

        Usuario::firstOrCreate(
            ['email' => 'ana.tourinho@fatec.sp.gov.br'],
            [
                'nome' => 'Profa. Dra. Ana Lúcia Tourinho',
                'perfil' => 'professor',
                'status' => 'ativo',
            ]
        );

        // 6. Empréstimos Iniciais
        if (Emprestimo::count() === 0) {
            $livroClean = Livro::where('isbn', '9788576082675')->first();
            $livroDom = Livro::where('isbn', '9788594318602')->first();

            if ($livroClean && $aluno1) {
                Emprestimo::create([
                    'livro_id' => $livroClean->id,
                    'usuario_id' => $aluno1->id,
                    'data_emprestimo' => now()->subDays(3)->toDateString(),
                    'data_devolucao_prevista' => now()->addDays(11)->toDateString(),
                    'status' => 'ativo',
                ]);
            }

            if ($livroDom && $aluno2) {
                Emprestimo::create([
                    'livro_id' => $livroDom->id,
                    'usuario_id' => $aluno2->id,
                    'data_emprestimo' => now()->subDays(20)->toDateString(),
                    'data_devolucao_prevista' => now()->subDays(6)->toDateString(),
                    'data_devolucao_real' => now()->subDays(7)->toDateString(),
                    'status' => 'devolvido',
                ]);
            }
        }
    }
}