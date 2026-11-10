# Diagrama Entidade-Relacionamento (DER)
## Sistema de Gestão de Biblioteca Escolar — FATEC

Este documento formaliza a modelagem de dados do sistema, atendendo ao **Requisito 2 da 1ª Entrega Parcial**, baseado no banco de dados relacional **PostgreSQL 16** e mapeado via **Laravel Eloquent ORM**.

---

## 1. Diagrama Entidade-Relacionamento (Mermaid)

```mermaid
erDiagram
    USERS ||--o{ SESSIONS : "possui"
    AUTORES ||--o{ LIVROS : "escreve"
    LIVROS ||--|{ CATEGORIA_LIVRO : "possui"
    CATEGORIAS ||--|{ CATEGORIA_LIVRO : "contem"
    LIVROS ||--o{ EMPRESTIMOS : "alocado_em"
    USUARIOS ||--o{ EMPRESTIMOS : "solicita"

    USERS {
        bigint id PK "Identificador único do operador"
        string name "Nome do administrador ou bibliotecário"
        string email UK "E-mail de autenticação único"
        string password "Hash seguro da senha (Bcrypt/Argon2id)"
        timestamp created_at "Data de criação"
        timestamp updated_at "Data de atualização"
    }

    SESSIONS {
        string id PK "Identificador único da sessão (Cookie)"
        bigint user_id FK "Chave estrangeira para users (opcional)"
        string ip_address "Endereço IP do cliente"
        text user_agent "Navegador/Dispositivo utilizado"
        text payload "Dados serializados da sessão"
        integer last_activity "Timestamp da última atividade"
    }

    AUTORES {
        bigint id PK "Identificador único do autor"
        string nome "Nome completo do autor"
        text biografia "Biografia ou notas do autor (opcional)"
        timestamp created_at "Data de cadastro"
        timestamp updated_at "Data de alteração"
    }

    CATEGORIAS {
        bigint id PK "Identificador único do gênero/categoria"
        string nome "Nome da categoria (ex: Romance, Fantasia)"
        text descricao "Descrição da categoria (opcional)"
        timestamp created_at "Data de cadastro"
        timestamp updated_at "Data de alteração"
    }

    LIVROS {
        bigint id PK "Identificador único do livro"
        string titulo "Título da obra literária"
        string isbn UK "Código ISBN-10 ou ISBN-13 único"
        integer ano_publicacao "Ano de publicação"
        text sinopse "Sinopse completa do livro"
        string capa_url "URL ou caminho da imagem da capa"
        integer quantidade "Quantidade disponível em estoque"
        bigint autor_id FK "Chave estrangeira referenciando autores(id)"
        timestamp created_at "Data de registro"
        timestamp updated_at "Data de alteração"
    }

    CATEGORIA_LIVRO {
        bigint livro_id FK "Referência para livros(id)"
        bigint categoria_id FK "Referência para categorias(id)"
    }

    USUARIOS {
        bigint id PK "Identificador único do leitor"
        string nome "Nome do aluno, professor ou colaborador"
        string email UK "E-mail acadêmico único"
        string documento "RA do aluno ou CPF do docente"
        string perfil "Tipo de vínculo (aluno, professor, funcionário)"
        string departamento "Curso ou departamento institucional"
        string status "Situação cadastral (ativo, inativo)"
        timestamp created_at "Data de cadastro"
        timestamp updated_at "Data de alteração"
    }

    EMPRESTIMOS {
        bigint id PK "Identificador único do empréstimo"
        bigint livro_id FK "Referência para livros(id)"
        bigint usuario_id FK "Referência para usuarios(id)"
        date data_emprestimo "Data da retirada do exemplar"
        date data_devolucao_prevista "Data limite estipulada para devolução"
        date data_devolucao_real "Data em que a devolução ocorreu"
        string status "Estado (ativo, devolvido, atrasado)"
        timestamp created_at "Data de lançamento"
        timestamp updated_at "Data de atualização"
    }
```

---

## 2. Dicionário de Dados e Relacionamentos

### 2.1 Autores & Livros (1:N)
- Um **Autor** pode escrever múltiplos **Livros** (`hasMany`).
- Cada **Livro** pertence obrigatoriamente a um **Autor** (`belongsTo`).
- **Integridade Referencial**: `ON DELETE CASCADE`.

### 2.2 Livros & Categorias (N:N)
- Um **Livro** pode ter várias **Categorias** (ex: *Ficção Científica*, *Distopia*).
- Uma **Categoria** pode estar associada a múltiplos **Livros**.
- **Tabela Pivot**: `categoria_livro` com chaves estrangeiras compostas e exclusão em cascata.

### 2.3 Usuários, Livros & Empréstimos (1:N)
- Um **Usuário** (aluno/professor) pode realizar múltiplos **Empréstimos**.
- Cada **Empréstimo** está vinculado a um único **Livro** e um único **Usuário**.
- Possui controle temporal com `data_emprestimo`, `data_devolucao_prevista` e `data_devolucao_real`.

### 2.4 Usuários Administrativos & Sessões (1:N)
- A tabela `users` controla o acesso dos operadores do sistema (administradores e bibliotecários).
- A tabela `sessions` armazena as sessões HTTP criptografadas e persistidas no PostgreSQL para controle de autenticação stateful com cookies.

---

## 3. Conformidade com a 3ª Forma Normal (3NF)

1. **1ª Forma Normal (1NF)**: Todos os atributos contêm valores atômicos indivisíveis e não existem grupos repetidores. A relação N:N entre Livros e Categorias foi desacoplada na tabela intermediária `categoria_livro`.
2. **2ª Forma Normal (2NF)**: Todas as tabelas possuem chaves primárias bem definidas (`id`) e nenhum atributo não-chave depende de apenas uma parte de uma chave composta.
3. **3ª Forma Normal (3NF)**: Não existem dependências transitivas. Atributos como nome do autor ou descrição da categoria estão em suas tabelas de origem, evitando redundância e anomalias de atualização no cadastro de livros.
