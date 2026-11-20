<?php

namespace Database\Seeders;

use App\Models\Autor;
use App\Models\Categoria;
use App\Models\Emprestimo;
use App\Models\Livro;
use App\Models\User;
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
                'profile' => 'bibliotecario',
                'status' => 'ativo',
                'document' => '000000',
            ]
        );

        // 2. Categorias
        $catEngenharia = Categoria::firstOrCreate(['name' => 'Engenharia de Software'], [
            'description' => 'Livros sobre arquitetura, padrões de projeto e boas práticas.',
        ]);
        $catRedes = Categoria::firstOrCreate(['name' => 'Redes & Infraestrutura'], [
            'description' => 'Protocolos, sistemas operacionais e arquitetura de redes.',
        ]);
        $catLiteratura = Categoria::firstOrCreate(['name' => 'Literatura Brasileira'], [
            'description' => 'Grandes clássicos da literatura e ficção nacional.',
        ]);
        $catFiccao = Categoria::firstOrCreate(['name' => 'Ficção Científica & Distopia'], [
            'description' => 'Obras de ficção, futuros distópicos e universos fantásticos.',
        ]);
        $catFantasia = Categoria::firstOrCreate(['name' => 'Fantasia & Aventura'], [
            'description' => 'Sagas clássicas de magia, fantasia e mundos épicos.',
        ]);
        $catSuspense = Categoria::firstOrCreate(['name' => 'Suspense & Mistério'], [
            'description' => 'Livros de investigação, suspense psicológico e crimes.',
        ]);
        $catHistoria = Categoria::firstOrCreate(['name' => 'História & Filosofia'], [
            'description' => 'Ensaios históricos, desenvolvimento humano e filosofia.',
        ]);

        // 3. Autores
        $autorUncleBob = Autor::firstOrCreate(['name' => 'Robert C. Martin (Uncle Bob)'], [
            'biography' => 'Engenheiro de software e autor lendário, um dos signatários do Manifesto Ágil.',
        ]);
        $autorFowler = Autor::firstOrCreate(['name' => 'Martin Fowler'], [
            'biography' => 'Especialista em refatoração e arquitetura corporativa na ThoughtWorks.',
        ]);
        $autorTanenbaum = Autor::firstOrCreate(['name' => 'Andrew S. Tanenbaum'], [
            'biography' => 'Professor emérito de Ciência da Computação e autor de manuais de referência.',
        ]);
        $autorMachado = Autor::firstOrCreate(['name' => 'Machado de Assis'], [
            'biography' => 'Um dos maiores nomes da literatura brasileira e fundador da ABL.',
        ]);
        $autorOrwell = Autor::firstOrCreate(['name' => 'George Orwell'], [
            'biography' => 'Escritor e jornalista britânico célebre por suas críticas ao totalitarismo.',
        ]);
        $autorRowling = Autor::firstOrCreate(['name' => 'J. K. Rowling'], [
            'biography' => 'Escritora britânica criadora da mundialmente aclamada saga de Harry Potter.',
        ]);
        $autorTolkien = Autor::firstOrCreate(['name' => 'J. R. R. Tolkien'], [
            'biography' => 'Filólogo e professor britânico, autor de O Hobbit e O Senhor dos Anéis.',
        ]);
        $autorExupery = Autor::firstOrCreate(['name' => 'Antoine de Saint-Exupéry'], [
            'biography' => 'Escritor e ilustrador francês, mundialmente conhecido por O Pequeno Príncipe.',
        ]);
        $autorMontes = Autor::firstOrCreate(['name' => 'Raphael Montes'], [
            'biography' => 'Escritor e roteirista brasileiro consagrado de literatura policial e suspense.',
        ]);
        $autorSaramago = Autor::firstOrCreate(['name' => 'José Saramago'], [
            'biography' => 'Escritor português vencedor do Prêmio Nobel de Literatura de 1998.',
        ]);
        $autorClarice = Autor::firstOrCreate(['name' => 'Clarice Lispector'], [
            'biography' => 'Uma das mais influentes escritoras brasileiras do século XX.',
        ]);
        $autorHarari = Autor::firstOrCreate(['name' => 'Yuval Noah Harari'], [
            'biography' => 'Historiador e professor israelense, autor de best-sellers globais sobre a humanidade.',
        ]);
        $autorHerbert = Autor::firstOrCreate(['name' => 'Frank Herbert'], [
            'biography' => 'Autor americano da aclamada e monumental saga de ficção científica Duna.',
        ]);
        $autorHunt = Autor::firstOrCreate(['name' => 'Andrew Hunt & David Thomas'], [
            'biography' => 'Autores do clássico O Programador Pragmático e pioneiros em desenvolvimento ágil.',
        ]);

        // 4. Catálogo Completo de Livros
        $livrosData = [
            [
                'isbn' => '9788576082675',
                'title' => 'Código Limpo: Habilidades Práticas do Agile Software',
                'year' => 2009,
                'synopsis' => 'Mesmo um código ruim pode funcionar. Mas se ele não for limpo, pode acabar com uma empresa de desenvolvimento.',
                'amount' => 4,
                'author_id' => $autorUncleBob->id,
                'categoria' => $catEngenharia,
            ],
            [
                'isbn' => '9788550804606',
                'title' => 'Arquitetura Limpa: O Guia do Artesão para Estrutura e Design de Software',
                'year' => 2019,
                'synopsis' => 'Regras universais de arquitetura de software para aumentar a produtividade e sustentabilidade.',
                'amount' => 3,
                'author_id' => $autorUncleBob->id,
                'categoria' => $catEngenharia,
            ],
            [
                'isbn' => '9788575227244',
                'title' => 'Refatoração: Aperfeiçoando o Design de Códigos Existentes',
                'year' => 2020,
                'synopsis' => 'Guia definitivo para melhorar a estrutura interna do código sem alterar seu comportamento observável.',
                'amount' => 2,
                'author_id' => $autorFowler->id,
                'categoria' => $catEngenharia,
            ],
            [
                'isbn' => '9788576088011',
                'title' => 'O Programador Pragmático: Sua Jornada para a Maestria',
                'year' => 2010,
                'synopsis' => 'Abordagem prática com lições intemporais sobre excelência técnica e desenvolvimento pessoal.',
                'amount' => 3,
                'author_id' => $autorHunt->id,
                'categoria' => $catEngenharia,
            ],
            [
                'isbn' => '9788543005850',
                'title' => 'Redes de Computadores',
                'year' => 2011,
                'synopsis' => 'Princípios fundamentais de sistemas de telecomunicação, camadas OSI e Internet moderna.',
                'amount' => 4,
                'author_id' => $autorTanenbaum->id,
                'categoria' => $catRedes,
            ],
            [
                'isbn' => '9788594318602',
                'title' => 'Dom Casmurro',
                'year' => 1899,
                'synopsis' => 'A história de Bento Santiago e a clássica dúvida sobre Capitu.',
                'amount' => 5,
                'author_id' => $autorMachado->id,
                'categoria' => $catLiteratura,
            ],
            [
                'isbn' => '9788532508126',
                'title' => 'A Hora da Estrela',
                'year' => 1977,
                'synopsis' => 'A comovente trajetória de Macabéa, uma jovem alagoana que tenta sobreviver na grande metrópole do Rio de Janeiro.',
                'amount' => 3,
                'author_id' => $autorClarice->id,
                'categoria' => $catLiteratura,
            ],
            [
                'isbn' => '9788532511010',
                'title' => 'Harry Potter e a Pedra Filosofal',
                'year' => 1997,
                'synopsis' => 'Harry descobre que é um bruxo no seu 11º aniversário e é convidado para ingressar em Hogwarts.',
                'amount' => 5,
                'author_id' => $autorRowling->id,
                'categoria' => $catFantasia,
            ],
            [
                'isbn' => '9788532511973',
                'title' => 'Harry Potter e a Câmara Secreta',
                'year' => 1998,
                'synopsis' => 'Em seu segundo ano letivo em Hogwarts, Harry investiga mistérios e ataques aos alunos da escola.',
                'amount' => 4,
                'author_id' => $autorRowling->id,
                'categoria' => $catFantasia,
            ],
            [
                'isbn' => '9788532512062',
                'title' => 'Harry Potter e o Prisioneiro de Azkaban',
                'year' => 1999,
                'synopsis' => 'Sirius Black escapa da prisão de Azkaban e os dementadores cercam a escola de Hogwarts.',
                'amount' => 3,
                'author_id' => $autorRowling->id,
                'categoria' => $catFantasia,
            ],
            [
                'isbn' => '9788532520807',
                'title' => 'O Hobbit',
                'year' => 1937,
                'synopsis' => 'Bilbo Bolseiro é arrastado para uma expedição inesperada na companhia do mago Gandalf e treze anões.',
                'amount' => 4,
                'author_id' => $autorTolkien->id,
                'categoria' => $catFantasia,
            ],
            [
                'isbn' => '9788532514332',
                'title' => 'O Senhor dos Anéis: A Sociedade do Anel',
                'year' => 1954,
                'synopsis' => 'O jovem hobbit Frodo Bolseiro recebe uma herança perigosa: o Um Anel forjado pelo Senhor do Escuro.',
                'amount' => 3,
                'author_id' => $autorTolkien->id,
                'categoria' => $catFantasia,
            ],
            [
                'isbn' => '9788535914849',
                'title' => '1984',
                'year' => 1949,
                'synopsis' => 'Uma das distopias mais influentes do mundo: o Grande Irmão tudo vigia através da teletela.',
                'amount' => 5,
                'author_id' => $autorOrwell->id,
                'categoria' => $catFiccao,
            ],
            [
                'isbn' => '9788535909555',
                'title' => 'A Revolução dos Bichos',
                'year' => 1945,
                'synopsis' => 'Uma alegoria brilhante sobre o poder, a corrupção e os ideais de uma revolução traída.',
                'amount' => 4,
                'author_id' => $autorOrwell->id,
                'categoria' => $catFiccao,
            ],
            [
                'isbn' => '9788576572008',
                'title' => 'Duna',
                'year' => 1965,
                'synopsis' => 'No planeta desértico de Arrakis, a especiaria é o recurso mais cobiçado de todo o universo.',
                'amount' => 3,
                'author_id' => $autorHerbert->id,
                'categoria' => $catFiccao,
            ],
            [
                'isbn' => '9788520933114',
                'title' => 'O Pequeno Príncipe',
                'year' => 1943,
                'synopsis' => 'Um piloto cai no deserto do Saara e encontra um menino extraordinário vindo de outro asteroide.',
                'amount' => 6,
                'author_id' => $autorExupery->id,
                'categoria' => $catLiteratura,
            ],
            [
                'isbn' => '9788535928356',
                'title' => 'Jantar Secreto',
                'year' => 2016,
                'synopsis' => 'Jovens universitários no Rio de Janeiro se envolvem em uma espiral sombria de crimes e eventos chocantes.',
                'amount' => 3,
                'author_id' => $autorMontes->id,
                'categoria' => $catSuspense,
            ],
            [
                'isbn' => '9788535911664',
                'title' => 'Ensaio Sobre a Cegueira',
                'year' => 1995,
                'synopsis' => 'Uma misteriosa epidemia de cegueira branca atinge uma cidade e expõe a essência da condição humana.',
                'amount' => 3,
                'author_id' => $autorSaramago->id,
                'categoria' => $catFiccao,
            ],
            [
                'isbn' => '9788525432162',
                'title' => 'Sapiens: Uma Breve História da Humanidade',
                'year' => 2014,
                'synopsis' => 'Como uma espécie insignificante de macacos se tornou a força dominante do planeta Terra.',
                'amount' => 4,
                'author_id' => $autorHarari->id,
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
        $aluno1 = User::firstOrCreate(
            ['email' => 'murilo@fatec.sp.gov.br'],
            [
                'name' => 'Murilo Silva',
                'password' => bcrypt('senha123'),
                'profile' => 'aluno',
                'status' => 'ativo',
                'document' => '123456',
            ]
        );

        $aluno2 = User::firstOrCreate(
            ['email' => 'lucas.mendes@fatec.sp.gov.br'],
            [
                'name' => 'Lucas Mendes',
                'password' => bcrypt('senha123'),
                'profile' => 'aluno',
                'status' => 'ativo',
                'document' => '654321',
            ]
        );

        User::firstOrCreate(
            ['email' => 'ana.tourinho@fatec.sp.gov.br'],
            [
                'name' => 'Profa. Dra. Ana Lúcia Tourinho',
                'password' => bcrypt('senha123'),
                'profile' => 'professor',
                'status' => 'ativo',
                'document' => '00000000000',
            ]
        );

        // 6. Empréstimos Iniciais
        if (Emprestimo::count() === 0) {
            $livroClean = Livro::where('isbn', '9788576082675')->first();
            $livroDom = Livro::where('isbn', '9788594318602')->first();

            if ($livroClean && $aluno1) {
                Emprestimo::create([
                    'book_id' => $livroClean->id,
                    'user_id' => $aluno1->id,
                    'loan_date' => now()->subDays(3)->toDateString(),
                    'expected_return_date' => now()->addDays(11)->toDateString(),
                    'status' => 'ativo',
                ]);
            }

            if ($livroDom && $aluno2) {
                Emprestimo::create([
                    'book_id' => $livroDom->id,
                    'user_id' => $aluno2->id,
                    'loan_date' => now()->subDays(20)->toDateString(),
                    'expected_return_date' => now()->subDays(6)->toDateString(),
                    'return_date' => now()->subDays(7)->toDateString(),
                    'status' => 'devolvido',
                ]);
            }
        }
    }
}
