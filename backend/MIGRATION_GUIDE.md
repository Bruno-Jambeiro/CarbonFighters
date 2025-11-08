# 🔄 Guia de Migração: SQLite para PostgreSQL

## ⚠️ IMPORTANTE - LEIA ISTO PRIMEIRO

Este projeto foi migrado de **SQLite** para **PostgreSQL**. Se você já tinha o projeto configurado anteriormente, siga estes passos para atualizar seu ambiente local.

## 📋 Principais Mudanças

### Banco de Dados
- ✅ **Antes:** SQLite (arquivo local)
- ✅ **Agora:** PostgreSQL (servidor de banco de dados)

### Modelo de Usuário
Novos campos foram adicionados ao modelo `User`:
- `cpf` (obrigatório) - Documento de identificação
- `phone` (opcional) - Telefone
- `birthday` (opcional) - Data de nascimento
- `id` foi alterado para `id_user`

### Testes
- ✅ Os testes agora usam um banco de dados PostgreSQL separado
- ✅ São executados automaticamente no GitHub Actions

## 🚀 Passos para Migrar seu Ambiente Local

### 1. Atualize as dependências

```bash
cd backend
npm install
```

**Nota:** Foi instalado o `pg` (driver do PostgreSQL) e a dependência do SQLite foi removida.

### 2. Instale o PostgreSQL (se você não tiver)

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Windows
Baixe e instale em: https://www.postgresql.org/download/windows/

### 3. Crie os bancos de dados

```bash
# Banco de dados de desenvolvimento
psql -U postgres -c "CREATE DATABASE carbonfighters;"

# Banco de dados de testes
psql -U postgres -c "CREATE DATABASE carbonfighters_test;"
```

**Nota:** Se seu usuário PostgreSQL não for `postgres`, use seu usuário correspondente.

### 4. Execute o script de criação de tabelas

```bash
# Para desenvolvimento
psql -U postgres -d carbonfighters -f data/create_tables.sql

# Para testes
psql -U postgres -d carbonfighters_test -f data/create_tables.sql
```

### 5. Configure seus arquivos de ambiente

#### Arquivo `.env` (Desenvolvimento)

```bash
cp .env.example .env
```

Depois edite `.env` e configure sua senha do PostgreSQL:

```env
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=carbonfighters
DB_PASSWORD=sua_senha_real_aqui  # ⬅️ MUDE ISTO
DB_PORT=5432
PORT=3000
TOKEN_SECRET=um-segredo-longo-e-aleatorio
```

#### Arquivo `.env.test` (Testes)

```bash
cp .env.test.example .env.test
```

Depois edite `.env.test` e configure sua senha do PostgreSQL:

```env
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=carbonfighters_test
DB_PASSWORD=sua_senha_real_aqui  # ⬅️ MUDE ISTO
DB_PORT=5432
PORT=3001
TOKEN_SECRET=test-secret-key
```

### 6. Verifique se tudo funciona

#### Execute o servidor
```bash
npm run dev
```

Você deverá ver:
```
Server is running on http://localhost:3000
```

#### Execute os testes
```bash
npm test
```

Você deverá ver:
```
Test Suites: 2 passed, 2 total
Tests:       30 passed, 30 total
```

## 🔍 Verificar a instalação do PostgreSQL

### Ver bancos de dados criados
```bash
psql -U postgres -l
```

### Conectar-se a um banco de dados
```bash
psql -U postgres -d carbonfighters
```

### Ver as tabelas
```sql
\dt
```

### Sair do psql
```sql
\q
```

## 🆕 Novas Validações

### Registro de Usuário
Agora o endpoint `POST /auth/register` requer:

**Campos obrigatórios:**
- `firstName`
- `lastName`
- `cpf` (11 dígitos)
- `password` (mínimo 8 caracteres, maiúsculas, minúsculas, números e caracteres especiais)

**Campos opcionais:**
- `email`
- `phone`
- `birthday` (formato: `YYYY-MM-DD`)

### Exemplo com Thunder Client / Postman

```json
{
  "firstName": "João",
  "lastName": "Silva",
  "cpf": "12345678901",
  "email": "joao@exemplo.com",
  "phone": "11999999999",
  "birthday": "2000-01-15",
  "password": "MinhaSenha123!"
}
```

## 🐛 Problemas Comuns

### Erro: "password authentication failed"
- Verifique se a senha no `.env` está correta
- Certifique-se de que o usuário tenha permissões no PostgreSQL

### Erro: "database does not exist"
- Execute os comandos CREATE DATABASE do passo 3

### Erro: "relation does not exist"
- Execute o script `create_tables.sql` do passo 4

### Os testes falham com erro de conexão
- Verifique se o `.env.test` está configurado corretamente
- Certifique-se de que o banco de dados `carbonfighters_test` existe

## 📞 Precisa de ajuda?

Se você tiver problemas com a migração:
1. Revise o arquivo `backend/README.md` para mais detalhes
2. Verifique os logs de erro
3. Pergunte no canal da equipe

## ✅ Checklist de Migração

- [ ] PostgreSQL instalado e rodando
- [ ] Bancos de dados `carbonfighters` e `carbonfighters_test` criados
- [ ] Tabelas criadas com `create_tables.sql`
- [ ] Arquivo `.env` configurado com credenciais corretas
- [ ] Arquivo `.env.test` configurado
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor roda sem erros (`npm run dev`)
- [ ] Testes passam (`npm test`)

Pronto! 🎉
