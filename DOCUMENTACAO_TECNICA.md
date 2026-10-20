# Documentação Técnica do Sistema — Biblioteca

> **Documento de Handover Técnico**  
> **Finalidade**: Fornecer a base arquitetural, modelo de dados, fluxos de negócio e mapa de endpoints para a elaboração da documentação final e acadêmica do projeto.  
> **Instituição**: Faculdade de Tecnologia do Estado de São Paulo (FATEC)  
> **Disciplina**: Desenvolvimento Web II  

---

## 1. Visão Geral do Sistema

O **Sistema de Gestão de Biblioteca Escolar Paulo Freire** é uma aplicação web completa desenvolvida com arquitetura desacoplada (Frontend Web SPA/Multi-page + Backend API RESTful).  
O sistema gerencia o acervo literário e acadêmico da instituição, automatizando o controle de estoque, catalogação de títulos, empréstimos, devoluções e áreas personalizadas para **Alunos**, **Professores** e **Bibliotecários/Administradores**.

### Principais Destaques Implementados
* **230 livros reais cadastrados**: Obras completas populadas da API pública mundial da **Open Library** com capas em alta resolução, sinopses, autores, categorias e ISBNs autênticos.
* **Gestão de Estoque em Tempo Real**: Cálculo dinâmico de exemplares disponíveis (`estoque_disponivel = quantidade - emprestimos_ativos`). Métricas consolidadas de 920 exemplares totais.
* **Autenticação Segura & Perfis**:
  * **Aluno**: Identificado por RA numérico (limite de 12 dígitos) e e-mail institucional.
  * **Professor**: Identificado por CPF com máscara automática (`000.000.000-00`) e validação matemática oficial dos dois dígitos verificadores (algoritmo módulo 11).
  * **Bibliotecário / Admin**: Acesso exclusivo à área gerencial, inventário de estoque e cadastro de livros.
* **Resiliência na Importação de Livros**: Serviço em cascata integrando **Google Books API**, **Open Library API** e **BrasilAPI**.

---

## 2. Arquitetura da Solução & Stack Tecnológica

O sistema é 100% conteinerizado através do **Docker Compose**, composto por três serviços isolados:

```
                                  ┌──────────────────────────────┐
                                  │       Navegador Web          │
                                  │   (Chrome, Edge, Firefox)    │
                                  └──────────────┬───────────────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        │ Requisições HTTP (HTML/CSS/JS)                 │ Requisições AJAX (JSON)
                        │ Porta 8080                                     │ Porta 8000 + Cookies
                        ▼                                                ▼
         ┌──────────────────────────────┐                 ┌──────────────────────────────┐
         │     biblioteca_frontend      │                 │     biblioteca_backend       │
         │         Nginx Alpine         │                 │    PHP 8.3 / Laravel 13      │
         │   Porta Externa: 8080        │                 │     Porta Externa: 8000      │
         └──────────────────────────────┘                 └──────────────┬───────────────┘
                                                                         │
                                                                         │ Conexão TCP / Driver pgsql
                                                                         │ Porta Interna: 5432
                                                                         ▼
                                                          ┌──────────────────────────────┐
                                                          │     biblioteca_postgres      │
                                                          │        PostgreSQL 16         │
                                                          │     Porta Externa: 5432      │
                                                          │     Database: biblioteca     │
                                                          └──────────────────────────────┘
```

### Componentes de Software:
* **Frontend**:
  * HTML5 semântico e acessível (WCAG AA).
  * CSS3 moderno e modularizado por tela (`cadastro.css`, `catalago.css`, `inventario.css`, etc.).
  * JavaScript Vanilla com chamadas assíncronas via `fetch` API e controle de sessão (`credentials: 'include'`).
* **Backend**:
  * Framework **Laravel 13** (PHP 8.3) no padrão MVC e API RESTful.
  * Camada de Serviços desacoplada (`EmprestimoService`, `GoogleBooksService`).
  * Autenticação com sessão persistida no banco (`SESSION_DRIVER=database`).
  * Validações de requisição estritas via Form Requests (`StoreLivroRequest`, etc.).
* **Banco de Dados**:
  * **PostgreSQL 16**: Relacional, normalizado em 3ª Forma Normal (3NF), com chaves primárias, integridade referencial (`ON DELETE CASCADE` ou `RESTRICT`) e índices únicos.

---

## 3. Modelo de Dados & Dicionário de Tabelas

A modelagem de dados completa e o diagrama visual em Mermaid encontram-se no arquivo [`DER.md`](./DER.md). Abaixo estão resumidas as principais tabelas:

| Tabela | Finalidade | Principais Atributos |
|---|---|---|
| **`users`** | Contas de login do sistema (operadores, alunos e professores) | `id`, `name`, `email` (UNIQUE), `password` (Hash Bcrypt) |
| **`usuarios`** | Leitores da biblioteca e dados acadêmicos | `id`, `nome`, `email` (UNIQUE), `documento` (RA ou CPF), `perfil` (`aluno`/`professor`), `departamento`, `status` (`ativo`/`inativo`) |
| **`livros`** | Acervo de obras literárias e científicas | `id`, `titulo`, `isbn` (UNIQUE), `ano_publicacao`, `sinopse`, `capa_url`, `quantidade` (estoque total), `autor_id` (FK) |
| **`autores`** | Escritores das obras (1:N com livros) | `id`, `nome`, `biografia` |
| **`categorias`** | Gêneros e áreas do conhecimento | `id`, `nome`, `descricao` |
| **`categoria_livro`** | Tabela associativa pivot (N:N entre livros e categorias) | `livro_id` (FK), `categoria_id` (FK) |
| **`emprestimos`** | Registro de empréstimos e devoluções | `id`, `livro_id` (FK), `usuario_id` (FK), `data_emprestimo`, `data_devolucao_prevista`, `data_devolucao_real`, `status` (`ativo`/`devolvido`) |
| **`sessions`** | Sessões HTTP de autenticação no PostgreSQL | `id`, `user_id` (FK), `ip_address`, `user_agent`, `payload`, `last_activity` |

> [!NOTE]
> **Aviso sobre o Banco Local vs Supabase**:  
> O arquivo `Back/.env` aponta para o container PostgreSQL local (`DB_HOST=db`, porta 5432). Portanto, todos os cadastros e testes realizados no navegador em `http://localhost:8080` gravam no banco de dados local do Docker, e **não** no Supabase na nuvem.

---

## 4. Módulos Funcionais e Telas do Sistema

### 4.1. Módulo de Autenticação e Perfil
* **`login.html`** (`scriptLogin.js`):
  * Autenticação via `POST /api/v1/login`.
  * Normalização automática de e-mail (insensível a maiúsculas/minúsculas).
  * Redirecionamento condicional: Perfis `admin` vão para o painel gerencial (`homeADMIN.html`); alunos e professores vão para `home.html`.
* **`cadastro.html`** (`scriptCadastro.js`):
  * Alternador dinâmico de perfil (Aluno / Professor).
  * **Aluno**: Campo rotulado como "RA do Aluno", máscara que permite apenas dígitos numéricos até 12 caracteres.
  * **Professor**: Campo rotulado como "CPF do Docente", máscara dinâmica `000.000.000-00` e validação matemática de integridade do CPF (rejeita CPFs inválidos ou repetidos como `111.111.111-11`).
  * Bloqueio preventivo de e-mails já existentes no banco com feedback visual em tempo real.
* **`perfilAluno.html`** (`scriptPerfilAluno.js`):
  * Exibe nome real do usuário, RA/CPF, e-mail institucional e curso/departamento diretamente do banco de dados.
  * Upload e armazenamento local de foto de perfil.
  * Modais para atualização de dados complementares e senha.

### 4.2. Módulo de Catálogo e Leitura (Área do Estudante)
* **`home.html`** (`scriptHome.js`):
  * Dashboard inicial com saudação personalizada pelo nome do leitor.
  * Destaques de livros e acesso rápido ao catálogo e perfil.
* **`catalago.html`** (`scriptCatalago.js`):
  * Exibição dos **230 livros reais** carregados da Open Library.
  * Paginação inteligente com elipses (`[Anterior] 1 ... 14 15 16 ... 29 [Próximo]`).
  * Busca por título, autor e ISBN.
  * Filtro por categorias acadêmicas e literárias.
  * Interface limpa para os usuários comuns (botão de importação externa reservado para o administrador).
* **`pagLivro.html`** (`scriptPagLivro.js`):
  * Ficha catalográfica completa da obra selecionada.
  * Verificação de exemplares em estoque para reserva.
* **`historico.html`** (`scriptHistorico.js`):
  * Histórico de empréstimos passados e ativos do leitor autenticado.

### 4.3. Módulo Administrativo e Estoque (Área do Bibliotecário)
* **`homeADMIN.html`** (`scriptHomeADIMIN.js`):
  * Visão geral de novos empréstimos e notificações de devoluções.
* **`inventario.html`** (`scriptInventario.js` — **Gestão de Estoque**):
  * **Métricas Reais do Banco**:
    * Total do Estoque: 920 exemplares.
    * Títulos Cadastrados: 230 obras.
    * Já Disponíveis: 919 exemplares.
    * Atualmente em Empréstimo: 1 livro.
    * Em Atraso: 0 livros.
  * Tabela com paginação, capas dos livros, status em tempo real (`X de Y disponíveis` ou `Esgotado`) e filtros dinâmicos por categoria e disponibilidade.
* **`cadastroLivros.html`** (`scriptCadastroLivros.js`):
  * Cadastro manual de novos livros no banco.
  * **Integração com API Externa**: Busca automática por ISBN na Google Books/Open Library com preenchimento automático de título, autor, sinopse e capa.
* **`emprestimo.html`** (`scriptEmprestimo.js`):
  * Registro de novos empréstimos com controle de disponibilidade de estoque e cálculo de devolução prevista (14 dias).

---

## 5. Endpoints da API RESTful (`/api/v1`)

| Método | Endpoint | Descrição |
|---|---|---|
| **POST** | `/api/v1/register` | Cria novo usuário e leitor, com validação de CPF/RA e unicidade de e-mail |
| **POST** | `/api/v1/login` | Autentica o usuário, inicia sessão e devolve dados com perfil e documento |
| **POST** | `/api/v1/logout` | Encerra a sessão ativa e destrói o cookie de autenticação |
| **GET** | `/api/v1/me` | Retorna o usuário logado com RA/CPF e curso/departamento |
| **GET** | `/api/v1/inventario/metricas` | Retorna totais de estoque, disponíveis, emprestados e atrasados do banco |
| **GET** | `/api/v1/livros` | Listagem paginada com contagem de estoque ativo e filtros |
| **POST** | `/api/v1/livros` | Cadastra uma nova obra literária no banco de dados |
| **GET** | `/api/v1/livros/{id}` | Detalhes de um livro específico |
| **PUT/DELETE**| `/api/v1/livros/{id}` | Atualiza ou exclui um livro |
| **GET** | `/api/v1/categorias` | Lista todas as categorias cadastradas |
| **GET** | `/api/v1/autores` | Lista todos os autores cadastrados |
| **GET** | `/api/v1/emprestimos` | Lista todos os empréstimos registrados |
| **POST** | `/api/v1/emprestimos` | Registra novo empréstimo (valida estoque disponível) |
| **PATCH**| `/api/v1/emprestimos/{id}/devolucao` | Registra devolução e devolve o exemplar ao estoque |
| **GET** | `/api/v1/livros/externo/isbn/{isbn}` | Consulta dados de livros em APIs externas públicas |
| **GET** | `/api/v1/livros/externo/buscar` | Busca obras por termo na API da Open Library |
| **POST** | `/api/v1/livros/externo/importar` | Importa livros da Open Library direto para o banco de dados |

---

## 6. Credenciais de Teste Padrão

O seeder do banco de dados já inicializa o sistema com os seguintes usuários prontos para uso:

| Perfil | E-mail | Senha | RA / CPF | Destino após login |
|---|---|---|---|---|
| **Administrador / Bibliotecário** | `admin@fatec.sp.gov.br` | `admin123` | - | `homeADMIN.html` |
| **Aluno (Exemplo)** | `murilo@fatec.sp.gov.br` | `senha123` | 2024001 | `home.html` |
| **Aluno (Exemplo)** | `juliana.santos@aluno.fatec.sp.gov.br` | `senhaSegura123` | 2026112233 | `home.html` |
| **Professora (Exemplo)** | `ana.tourinho@fatec.sp.gov.br` | `senha123` | 529.982.247-25 | `home.html` |

---

## 7. Instruções para Execução e Testes

### 1. Iniciar os Containers Docker
```bash
docker compose up -d
```

### 2. Rodar as Migrações e Dados Iniciais
```bash
docker compose exec backend php artisan migrate --seed
```

### 3. Carga dos 230 Livros da Open Library (já executada)
Se for necessário recarregar os 230 livros a qualquer momento:
```bash
docker compose exec backend php artisan biblioteca:importar-api --tudo
```

### 4. Acesso no Navegador
* **Portal de Entrada / Login**: [http://localhost:8080/html/login.html](http://localhost:8080/html/login.html)
* **Gestão de Estoque (Inventário)**: [http://localhost:8080/html/inventario.html](http://localhost:8080/html/inventario.html)
* **Catálogo de Livros**: [http://localhost:8080/html/catalago.html](http://localhost:8080/html/catalago.html)

---

## 8. Guia para o Redator da Documentação Completa (Dicas de Conteúdo)

Para o colega de equipe encarregado de montar o relatório acadêmico final, sugerimos incluir as seguintes seções com base neste documento:

1. **Introdução & Objetivos**: Contextualizar a necessidade da biblioteca escolar de automatizar seu acervo e substituir registros manuais.
2. **Requisitos Funcionais (RF) e Não Funcionais (RNF)**:
   * *RF01*: Cadastro e autenticação com validação estrita de RA e CPF.
   * *RF02*: Catálogo com paginação responsiva e busca integrada.
   * *RF03*: Gestão de estoque com contagem automática de exemplares e empréstimos ativos.
   * *RF04*: Importação bibliográfica automática através de APIs públicas (Google Books / Open Library).
   * *RNF01*: Arquitetura de microsserviços/conteinerizada com Docker.
   * *RNF02*: Persistência relacional em PostgreSQL 16 com integridade referencial.
   * *RNF03*: Comunicação RESTful com JSON padronizado e códigos HTTP semânticos.
3. **Diagramas**:
   * Diagrama Entidade-Relacionamento (copiar o código Mermaid de [`DER.md`](./DER.md)).
   * Diagrama de Arquitetura em Camadas (Frontend -> Nginx -> Laravel API -> PostgreSQL).
4. **Casos de Teste e Evidências**:
   * Teste de bloqueio de e-mails duplicados (HTTP 422).
   * Teste do algoritmo verificador de CPF brasileiro.
   * Teste de cálculo de estoque dinâmico no inventário.
   * Teste de login e sincronização de perfil.
