# Sistema de Gestão de Biblioteca Escolar

Projeto desenvolvido para a disciplina de Desenvolvimento Web II (FATEC).  
Stack: PHP 8.3, Laravel 13, PostgreSQL 16, Nginx, Docker Compose.

---

## O que foi implementado / feito

### 1. Carga e Acervo Real de Livros
- Comando `php artisan biblioteca:importar-api --tudo` para importação direta da API pública da Open Library.
- Cadastro e persistência de 230 livros reais no PostgreSQL com títulos, autores, sinopses, capas e categorias.
- Definição de 4 exemplares por obra, totalizando 920 livros físicos no acervo.

### 2. Catálogo de Livros (`catalago.html`)
- Remoção do botão de busca em API externa na área pública, mantendo o catálogo restrito ao acervo interno da biblioteca.
- Paginação dinâmica com elipses (`1 ... 14 15 16 ... 29`) para navegação entre os 230 registros.
- Filtros por título, autor, categoria e status integrados diretamente com a API (`GET /api/v1/livros`).

### 3. Cadastro e Autenticação de Usuários (`cadastro.html` e `login.html`)
- Endpoint `POST /api/v1/register` para criação simultânea em `users` e `usuarios` com autenticação imediata de sessão.
- Normalização de e-mail (minúsculas e sem espaços) e bloqueio de e-mails duplicados com mensagem em português.
- Validação matemática de CPF (módulo 11) no backend e no frontend com máscara automática para professores.
- Restrição numérica de até 12 dígitos para RA de alunos.
- Caixa de feedback visual nativa no formulário (sem pop-ups do tipo `alert`).

### 4. Banco de Dados e Perfil do Usuário (`perfilAluno.html`)
- Migration adicionando as colunas `documento` e `departamento` na tabela `usuarios`.
- Atualização dos models e rotas (`/register`, `/login`, `/me`) para persistir e devolver documento (RA/CPF) e departamento/curso.
- Sincronização da tela de perfil para exibir nome, RA e curso reais do banco de dados em vez de dados estáticos.
- Sincronização dos usuários de teste do seeder na tabela `users` para permitir login.

### 5. Gestão de Estoque e Inventário (`inventario.html`)
- Desacoplamento da lista fixa de 11 livros mocados.
- Rota `GET /api/v1/inventario/metricas` retornando contagens reais do PostgreSQL (total de exemplares, títulos, livros disponíveis, emprestados e atrasados).
- Cálculo dinâmico de disponibilidade de cada obra na tabela (`X de Y disponíveis` ou `Esgotado`).
- Criação do script `scriptInventario.js` com categorias dinâmicas, busca com debounce e filtros integrados ao banco.

### 6. Segurança e Ajustes no Repositório
- Remoção de senhas expostas no `docker-compose.yml` usando variáveis de ambiente (`${DB_PASSWORD:-secret}`).
- Atualização do arquivo `.env.example` com as configurações do PostgreSQL local.
- Remoção do arquivo README padrão do Laravel da pasta `Back/`.
- Aplicação de cache-busting (`?v=...`) nas chamadas de script das páginas HTML.

---

## Como Executar o Projeto

### 1. Iniciar os Containers
```bash
docker compose up -d
```

### 2. Rodar Migrations e Seeds
```bash
docker compose exec backend php artisan migrate:fresh --seed
```

### 3. Carga do Acervo da Open Library (opcional)
```bash
docker compose exec backend php artisan biblioteca:importar-api --tudo
```

---

## Acesso Local

- **Interface Web**: [http://localhost:8080/html/login.html](http://localhost:8080/html/login.html)
- **API REST**: [http://localhost:8000/api/v1](http://localhost:8000/api/v1)
- **Banco de Dados**: `localhost:5432` (PostgreSQL)

### Credenciais de Teste
- **E-mail**: `admin@fatec.sp.gov.br`
- **Senha**: `admin123`

---

## Parar os Containers

```bash
docker compose down
```
