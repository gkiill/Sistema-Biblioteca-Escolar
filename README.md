# Sistema de Gestão de Biblioteca Escolar

Projeto desenvolvido para a disciplina de **Desenvolvimento Web II** — **FATEC**.  
Professor: **DonThom42**

---

## 🎯 Status da 1ª Entrega (29/09) — 100% dos Requisitos Atendidos

| Requisito | Descrição | Status | Detalhes |
|---|---|:---:|---|
| **1. Ambiente Docker** | Ambiente de desenvolvimento local multi-container configurado e documentado | ✅ **Concluído** | Docker Compose com Nginx (Front), PHP 8.4 Laravel (Back) e PostgreSQL 16 (DB) |
| **2. Modelagem (DER)** | Modelagem do Banco de Dados relacional finalizada e normalizada | ✅ **Concluído** | 8 tabelas em 3NF documentadas com diagrama Mermaid em [DER.md](./DER.md) |
| **3. CRUDs Eloquent** | CRUD com Eloquent funcional para as entidades primárias | ✅ **Concluído** | Operações completas para Livros, Autores, Categorias, Usuários e Empréstimos |
| **4. Rotas e Controllers** | Rotas da API organizadas e Controllers padronizados | ✅ **Concluído** | Versionamento semântico sob o prefixo `/api/v1/...` com Form Requests e validações |
| **5. Sessão e Cookies** | Controle de sessão e cookies com login e logout | ✅ **Concluído** | Autenticação stateful com cookies HTTP criptografados, sessão no PostgreSQL e CORS |
| **6. API Pública de Livros**| Consumo de API pública de livros integrada ao projeto | ✅ **Concluído** | Pipeline resiliente (Google Books + Open Library + BrasilAPI) com busca por ISBN na interface |

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução.

### 1. Subir os Containers
Na raiz do repositório, execute:
```bash
docker compose up -d
```

O Docker iniciará automaticamente 3 serviços isolados:
* **`frontend` (Nginx Alpine)**: Servindo a interface na porta **`8080`**.
* **`backend` (PHP 8.4 Alpine + Laravel 12)**: Servindo a API RESTful na porta **`8000`**.
* **`db` (PostgreSQL 16 Alpine)**: Banco de dados relacional na porta **`5432`**.

### 2. Executar as Migrations e Seeds
Para criar a estrutura das tabelas e popular o banco com registros iniciais de teste:
```bash
docker compose exec backend php artisan migrate:fresh --seed
```

---

## 🖥️ Acesso à Aplicação

* **Tela de Login**: [http://localhost:8080/html/login.html](http://localhost:8080/html/login.html)
* **Cadastro de Livros (com busca na API externa)**: [http://localhost:8080/html/cadastroLivros.html](http://localhost:8080/html/cadastroLivros.html)
* **Catálogo de Livros**: [http://localhost:8080/html/catalago.html](http://localhost:8080/html/catalago.html)
* **Painel do Administrador**: [http://localhost:8080/html/homeADMIN.html](http://localhost:8080/html/homeADMIN.html)

### 🔑 Credenciais de Teste
* **E-mail**: `admin@fatec.sp.gov.br`
* **Senha**: `admin123`

---

## 📡 Endpoints Principais da API (`/api/v1`)

### Autenticação & Sessão (Requisito 5)
* `POST /api/v1/login` — Autentica e inicia sessão persistida com cookie criptografado.
* `POST /api/v1/logout` — Destrói a sessão e invalida o token.
* `GET  /api/v1/me` — Retorna os dados do usuário autenticado na sessão.

### Integração com APIs Públicas Externas (Requisito 6)
* `GET  /api/v1/livros/externo/isbn/{isbn}` — Consulta dados bibliográficos e capa via Google Books, Open Library e BrasilAPI.
* `GET  /api/v1/livros/externo/buscar?q={termo}&limit={qtd}` — Busca em tempo real no acervo mundial da Open Library API por título, autor ou assunto.
* `POST /api/v1/livros/externo/importar` — Importa e persiste automaticamente obras da Open Library no PostgreSQL.

### Comandos de Carga Automática via API
```bash
# Carga em massa por temas pré-definidos (Tecnologia, Literatura, Ficção, Fantasia, História)
docker compose exec backend php artisan biblioteca:importar-api --tudo

# Carga personalizada por termo
docker compose exec backend php artisan biblioteca:importar-api --termo="inteligencia artificial" --categoria="Engenharia de Software" --limite=8
```

### CRUDs Eloquent (Requisitos 3 e 4)
* `GET|POST /api/v1/livros` — Listagem com filtros / Cadastro de livro.
* `GET|PUT|DELETE /api/v1/livros/{id}` — Visualização, atualização e exclusão de livro.
* `GET|POST|PUT|DELETE /api/v1/autores` — CRUD completo de autores.
* `GET|POST|PUT|DELETE /api/v1/categorias` — CRUD completo de categorias de livros.
* `GET|POST|PUT|DELETE /api/v1/usuarios` — CRUD completo de leitores (alunos e professores).
* `GET|POST /api/v1/emprestimos` — Listagem e registro de empréstimos.
* `PATCH /api/v1/emprestimos/{id}/devolucao` — Registro de devolução e baixa no estoque.

---

## 📁 Estrutura de Diretórios

```text
Sistema-Biblioteca-Escolar/
├── Back/                       # Backend Laravel 12 (API RESTful & Eloquent)
│   ├── app/
│   │   ├── Http/Controllers/Api/  # Auth, Livros, Autores, Categorias, Usuários, etc.
│   │   ├── Models/                # Entidades Eloquent
│   │   └── Services/              # GoogleBooksService (com fallback Open Library/BrasilAPI)
│   ├── database/migrations/       # 10 migrations com integridade referencial
│   └── routes/api.php             # Rotas versionadas sob /api/v1
├── Front/                      # Frontend Web (HTML, CSS e JavaScript)
│   ├── css/                    # Estilos das páginas
│   ├── html/                   # Telas (login, cadastroLivros, catálogo, etc.)
│   └── javaScripit/            # Scripts assíncronos (Fetch API, cookies, ISBN lookup)
├── DER.md                      # Diagrama Entidade-Relacionamento e Dicionário de Dados
├── docker-compose.yml          # Orquestração dos 3 containers (Front, Back, DB)
└── README.md                   # Documentação do projeto
```

---

## 🛑 Parar os Containers
```bash
docker compose down
```
*(Para reiniciar apagando os dados do banco e reexecutar do zero: `docker compose down -v`)*
