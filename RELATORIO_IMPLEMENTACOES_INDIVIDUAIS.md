# Relatorio de Contribuicoes e Implementacoes Tecnicas

Documento de registro das atividades, correcoes, funcionalidades e refatoracoes desenvolvidas individualmente no projeto Sistema de Gestao de Biblioteca Escolar.

Instituicao: Faculdade de Tecnologia do Estado de Sao Paulo (FATEC)  
Disciplina: Desenvolvimento Web II  
Ambiente: PHP 8.3 / Laravel 13 / PostgreSQL 16 / Nginx / Docker  

---

## 1. Resumo Executivo das Entregas Realizadas

Este relatorio documenta as funcionalidades, correcoes estruturais de banco de dados, servicos de backend e interfaces de usuario que foram implementadas individualmente nesta etapa do projeto.

As contribuicoes abrangeram seis areas principais:
1. Auditoria e higienizacao de segredos no repositorio.
2. Integracao com API externa e carga em massa do catalogo com 230 livros reais.
3. Refatoracao do catalogo para usuarios comuns com paginacao dinamica responsiva.
4. Modulo de cadastro, normalizacao de dados e validacao matematica de CPF / RA.
5. Correcao estrutural de modelagem no banco de dados e sincronizacao do perfil do usuario.
6. Integracao completa da Gestao de Estoque e Inventario com metricas reais do PostgreSQL.

---

## 2. Detalhamento das Implementacoes por Modulo

### 2.1. Seguranca e Configuracao do Ambiente
* **Auditoria de credenciais**: Verificacao de todo o historico de commits para garantir que senhas privadas, chaves de criptografia e o arquivo de ambiente local (`Back/.env`) nao fossem rastreados pelo controle de versao.
* **Configuracao do `.gitignore`**: Padronizacao das regras para ignorar arquivos de ambiente, banco de dados SQLite temporario, dependencias (`vendor/`, `node_modules/`), logs e sessoes em disco.
* **Higienizacao do `.env.example`**: Atualizacao do template de configuracao com os dados do container PostgreSQL local (`pgsql`, porta 5432, database `biblioteca`) utilizando placeholders seguros para quem for clonar o repositorio.

### 2.2. Carga e Populacao do Acervo Real (230 Livros)
* **Desenvolvimento do comando artisan de importacao**: Criacao e execucao do comando `php artisan biblioteca:importar-api --tudo`, integrando o backend a API publica mundial da Open Library.
* **Persistencia relacional no PostgreSQL**: Criacao de 230 obras literarias completas com titulo, sinopse, capa em alta resolucao, ISBN autentico, autores vinculados e associacao com categorias tematicas.
* **Consistencia de estoque**: Atribuicao de 4 exemplares para cada obra, totalizando um acervo inicial de 920 livros fisicos cadastrados no banco de dados.

### 2.3. Catalogo de Livros para Usuarios Comuns
* **Remocao da busca externa na area publica**: Eliminacao do botao de consulta global na tela `catalago.html` e no `scriptCatalago.js`, mantendo a importacao de obras como funcionalidade restrita ao perfil de bibliotecario.
* **Paginacao inteligente**: Implementacao de algoritmo de paginacao com exibicao de elipses (`[Anterior] 1 ... 14 15 16 ... 29 [Próximo]`), permitindo navegacao fluida e sem travamentos pelos 230 registros do banco.
* **Filtros e busca**: Conexao dos filtros de busca textual (titulo, autor, ISBN) e por categoria diretamente ao endpoint `GET /api/v1/livros`.

### 2.4. Modulo de Cadastro de Usuarios e Validacao Estrita
* **Endpoint de Registro (`POST /api/v1/register`)**: Desenvolvimento da rota e logica no `AuthController.php` para criacao do usuario na tabela de autenticacao (`users`) e na tabela de leitores (`usuarios`), com login imediato na sessao.
* **Normalizacao de e-mail e unicidade**: Conversao automatica de e-mails para letras minusculas e remocao de espacos nas pontas (`strtolower(trim(...))`), prevenindo duplicidades case-sensitive e retornando erro HTTP 422 em portugues caso o e-mail ja esteja em uso.
* **Validacao matematica de CPF**: Implementacao do algoritmo oficial de validacao por modulo 11 para o perfil Professor no backend (`AuthController::validarCpf`) e no frontend (`validarCPF` em `scriptCadastro.js`). O algoritmo rejeita codigos com tamanho incorreto, sequencias repetidas (como `111.111.111-11`) ou digitos verificadores invalidos.
* **Mascara e controle de RA**: Inclusao de mascara automatica `000.000.000-00` limitada a 11 digitos numericos para o perfil Professor, e restricao estrita a caracteres numericos com limite de 12 digitos para o RA do perfil Aluno.
* **Feedback nativo na interface**: Criacao de container de feedback visual em `cadastro.html` para exibicao de alertas de sucesso ou erro diretamente no formulario, sem depender de janelas pop-up (`alert`) do navegador.

### 2.5. Correcao Estrutural no Banco de Dados e Sincronizacao de Perfil
* **Diagnostico de ausencia de colunas**: Identificacao de que as tabelas `users` e `usuarios` nao possuiam colunas para salvar o documento (RA/CPF) e o curso/departamento, gerando perda do dado no cadastro e retorno vazio no login.
* **Criacao e execucao de Migration**:
  * Arquivo: `Back/database/migrations/2026_09_27_220000_add_documento_to_usuarios_table.php`.
  * Adicao das colunas `documento` (string 50, nullable) e `departamento` (string 150, nullable) na tabela `usuarios`.
* **Atualizacao de Models e Controllers**:
  * Atualizacao do atributo `$fillable` no model `Usuario.php`.
  * Atualizacao dos metodos `register`, `login` e `me` no `AuthController.php` para persistir e devolver os campos `documento` e `departamento`.
* **Sincronizacao do Perfil do Aluno**:
  * Atualizacao de `scriptLogin.js` e `scriptPerfilAluno.js` para gravar os dados reais no armazenamento local e consultar o endpoint `GET /api/v1/me`.
  * Substituicao dos textos estaticos anteriores ("Estudante" e "2024001") pelo nome real, RA e curso recuperados do banco de dados na tela `perfilAluno.html`.
* **Sincronizacao de usuarios de teste**: Criacao dos registros correspondentes na tabela `users` para os usuarios pre-existentes do seeder (`murilo@fatec.sp.gov.br`, `lucas.mendes@...`, `ana.tourinho@...`), permitindo login imediato com a senha padrao.

### 2.6. Integracao Real da Gestao de Estoque e Inventario
* **Diagnostico do inventario mockado**: Identificacao de que a tela `inventario.html` estava isolada, utilizando uma lista fixa de apenas 11 livros ficticios no arquivo `scriptInventário.js`.
* **Endpoint de Metricas Consolidadas (`GET /api/v1/inventario/metricas`)**:
  * Implementacao do metodo `LivroController::metricasInventario`.
  * Consulta em tempo real das seguintes metricas do PostgreSQL:
    * Total do estoque: soma de exemplares de todas as obras (`Livro::sum('quantidade')` = 920 exemplares).
    * Total de titulos cadastrados: contagem total de livros (`Livro::count()` = 230 titulos).
    * Exemplares disponiveis: estoque total menos emprestimos em aberto (919 disponiveis).
    * Emprestimos ativos: contagem de emprestimos com `data_devolucao_real IS NULL` (1 emprestimo ativo).
    * Emprestimos atrasados: contagem de emprestimos com prazo vencido (0 atrasados).
* **Calculo dinamico de disponibilidade por livro**:
  * Atualizacao do metodo `LivroController::index` utilizando `withCount` de emprestimos ativos.
  * O inventario agora exibe a contagem real de estoque para cada livro (exemplo: "4 de 4 disponiveis" ou "Esgotado").
* **Novo script de inventario (`scriptInventario.js`)**:
  * Criacao do script substituindo o arquivo anterior com acento no nome para garantir compatibilidade com Nginx e ambientes Linux.
  * Integracao com a API de categorias (`/api/v1/categorias`) para preenchimento dinamico do seletor.
  * Busca em tempo real com debounce, integrando filtros de status (Disponivel / Emprestado) e paginacao conectada ao banco de dados.

### 2.7. Controle de Cache de Navegador (Cache-Busting)
* Atualizacao de todas as referencias de script nas tags HTML (`cadastro.html`, `login.html`, `perfilAluno.html`, `catalago.html`, `home.html`, `historico.html` e `inventario.html`) com parametros de versao (`?v=20260927_05`).
* Essa medida forca os navegadores a descartarem arquivos antigos em cache e executarem o codigo JavaScript mais recente.

---

## 3. Relacao de Arquivos Criados ou Modificados

### Arquivos Criados:
* `Back/database/migrations/2026_09_27_220000_add_documento_to_usuarios_table.php` (Migration de colunas no banco)
* `Front/javaScripit/scriptInventario.js` (Logica do inventario conectada a API)
* `DOCUMENTACAO_TECNICA.md` (Documentacao geral do projeto para a equipe)
* `RELATORIO_IMPLEMENTACOES_INDIVIDUAIS.md` (Este documento de registro individual)

### Arquivos Modificados:
* `Back/app/Http/Controllers/Api/AuthController.php` (Validacao de CPF, unicidade de email e persistencia de documento)
* `Back/app/Http/Controllers/Api/LivroController.php` (Endpoint de metricas e contagem de estoque por livro)
* `Back/app/Models/Usuario.php` (Inclusao de documento e departamento no fillable)
* `Back/database/seeders/DatabaseSeeder.php` (Sincronizacao de usuarios sementes na tabela users)
* `Back/routes/api.php` (Inclusao da rota inventario/metricas)
* `Back/.env.example` (Padronizacao de variaveis de exemplo para PostgreSQL)
* `Front/html/cadastro.html` (Caixa de feedback, mascara e limite de caracteres)
* `Front/html/login.html` (Normalizacao de email e atualizacao de cache de script)
* `Front/html/perfilAluno.html` (Sincronizacao dos dados reais do usuario autenticado)
* `Front/html/inventario.html` (Conexao ao novo script de inventario e metricas reais)
* `Front/html/catalago.html` (Limpeza da busca externa e atualizacao de cache de script)
* `Front/html/home.html` (Atualizacao de cache de script)
* `Front/html/historico.html` (Atualizacao de cache de script)
* `Front/javaScripit/scriptCadastro.js` (Algoritmo de CPF, mascaras e comunicacao com API)
* `Front/javaScripit/scriptLogin.js` (Normalizacao de email e persistencia de dados do banco)
* `Front/javaScripit/scriptPerfilAluno.js` (Leitura de dados do banco e exibicao no perfil)
* `Front/javaScripit/scriptCatalago.js` (Paginacao responsiva e remocao de busca externa)
* `DER.md` (Atualizacao do diagrama e dicionario da entidade usuarios)
* `README.md` (Correcao da versao do Laravel 13 e documentacao de endpoints)

---

## 4. Evidencias de Funcionamento e Testes

Todas as funcionalidades implementadas foram testadas com sucesso no ambiente local:

1. **Tentativa de cadastro com email duplicado**: Retornou HTTP 422 com a mensagem "Este e-mail institucional ja esta cadastrado no sistema. Faca login com suas credenciais ou use outro e-mail."
2. **Tentativa de cadastro com CPF invalido (`111.111.111-11` ou digitos verificadores incorretos)**: Retornou HTTP 422 com a mensagem "O CPF informado e invalido. Digite um CPF valido com 11 digitos."
3. **Cadastro com CPF autentico**: Retornou HTTP 201 Created, persistindo os dados nas tabelas `users` e `usuarios` e formatando o CPF com mascara no banco.
4. **Login imediato**: Retornou HTTP 200 OK com as credenciais cadastradas, devolvendo o documento, departamento e perfil corretos.
5. **Consulta de metricas do inventario**: Endpoint `/api/v1/inventario/metricas` retornou os totais reais consolidados do banco (920 exemplares, 230 titulos, 919 disponiveis, 1 emprestado).
6. **Listagem do catalogo e inventario**: Ambas as telas renderizam as 230 obras do banco de dados com paginacao funcional e sem erros de console.
