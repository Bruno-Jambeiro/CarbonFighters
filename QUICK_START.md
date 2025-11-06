# 🚀 Carbon Fighters - Guia Rápido para a Equipe

## TL;DR (Muito Longo; Não Li)

**Configuração completa em 30 segundos:**

### Windows
```cmd
git clone https://github.com/Bruno-Jambeiro/CarbonFighters.git
cd CarbonFighters
setup.bat
```

### Mac/Linux
```bash
git clone https://github.com/Bruno-Jambeiro/CarbonFighters.git
cd CarbonFighters
./setup.sh
```

---

## O que eu preciso instalar?

### APENAS Docker Desktop (uma única vez)

**Windows/Mac:**
1. Baixe o [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Instale e abra o Docker Desktop
3. Pronto! Você já pode usar o projeto

**Linux (Ubuntu/Debian/Mint):**
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Clone o projeto

```bash
git clone https://github.com/Bruno-Jambeiro/CarbonFighters.git
cd CarbonFighters
```

### 3. ⚠️ IMPORTANTE: Crie os arquivos .env

**Estes arquivos NÃO estão no GitHub (segurança). Você DEVE criá-los:**

```bash
cd backend
cp .env.example .env
cp .env.example .env.test
cd ..
```

**Por que preciso disso?**
- `.env` = configuração de desenvolvimento
- `.env.test` = configuração dos testes
- Sem eles, o backend NÃO conecta ao banco de dados ❌

### 4. Inicie os bancos de dados

```bash
docker-compose up -d
```

Aguarde 10 segundos e verifique:
```bash
docker-compose ps
```

Deve mostrar:
```
carbonfighters-db       Up (healthy)
carbonfighters-db-test  Up (healthy)
```

### 5. Instale as dependências

```bash
# Backend
cd backend
npm install

# Frontend (nova aba do terminal)
cd ../frontend
npm install
```

---

## ✅ Verificar que funciona

```bash
# 1. Verificação automática
./verify-setup.sh

# 2. Teste o backend
cd backend
npm run dev
# Deve mostrar: "Server is running on http://localhost:3000"

# 3. Teste os tests
npm test
# Deve mostrar: "30 passed"

# 4. Teste o frontend (nova aba)
cd ../frontend
npm run dev
# Abra: http://localhost:5173
```

---

## 🔄 Uso Diário

### Começar a trabalhar

```bash
# Iniciar bancos de dados (se estiverem parados)
docker-compose start

# Backend (terminal 1)
cd backend && npm run dev

# Frontend (terminal 2)
cd frontend && npm run dev
```

### Terminar o dia

```bash
# Opcional: parar bancos de dados
docker-compose stop

# Ou deixe rodando (usa pouca memória)
```

---

## 🐛 Problemas Comuns

### ❌ "Cannot connect to Docker daemon"
**Solução:** Abra o Docker Desktop e espere estar rodando

### ❌ Backend diz "Cannot connect to database"
**Causa:** Você esqueceu de criar os arquivos `.env`

**Solução:**
```bash
cd backend
ls -la .env .env.test  # Verifica se existem

# Se não existem:
cp .env.example .env
cp .env.example .env.test
```

### ❌ Tests falham com "password authentication failed for user 'carbon'"
**Causa:** `.env.test` tem credenciais antigas

**Solução:**
```bash
cd backend
rm .env.test
cp .env.example .env.test
npm test
```

### ❌ "Port 5432 is already allocated"
**Causa:** PostgreSQL local está rodando

**Solução:**
```bash
# Linux: sudo systemctl stop postgresql
# Mac: brew services stop postgresql
# Windows: Parar serviço PostgreSQL
```

### ❌ Tabelas não existem
**Solução:**
```bash
docker-compose down -v
docker-compose up -d
```

---

## 📚 Estrutura do Projeto

```
CarbonFighters/
├── docker-compose.yml       # 2 bancos PostgreSQL (dev + test)
├── setup.sh / setup.bat     # Scripts automáticos
├── verify-setup.sh          # Verifica se está tudo ok
│
├── backend/
│   ├── .env                 # ⚠️ VOCÊ cria isso (NÃO está no Git)
│   ├── .env.test            # ⚠️ VOCÊ cria isso (NÃO está no Git)
│   ├── .env.example         # ✅ Template (está no Git)
│   └── src/                 # Código TypeScript
│
└── frontend/
    └── src/                 # Código React
```

---

## ⚡ Comandos Úteis

```bash
# Docker
docker-compose ps              # Ver status dos bancos
docker-compose start           # Iniciar
docker-compose stop            # Parar
docker-compose restart         # Reiniciar
docker logs carbonfighters-db  # Ver logs

# Desenvolvimento
cd backend && npm run dev      # Backend (porta 3000)
cd frontend && npm run dev     # Frontend (porta 5173)
cd backend && npm test         # Rodar tests

# Resetar tudo
docker-compose down -v         # Apaga bancos
docker-compose up -d           # Recria tudo
```

---

## 🎯 Checklist de Sucesso

Antes de começar a codar, confirme:

- [ ] Docker Desktop rodando
- [ ] `docker-compose ps` mostra 2 containers "Up (healthy)"
- [ ] Arquivo `backend/.env` existe
- [ ] Arquivo `backend/.env.test` existe
- [ ] `npm run dev` funciona (backend)
- [ ] `npm test` passa 30 testes
- [ ] `npm run dev` funciona (frontend)

**Se todos ✅ = Você está pronto!** 🎉

---

**Tempo total: ~5 minutos** (depois de instalar Docker)

**Precisa de ajuda?** Pergunte no grupo! 💬

## Algo não funciona? Resolução de Problemas

### ❌ "Cannot connect to Docker daemon"
**Solução:** Abra o Docker Desktop e espere até iniciar completamente

### ❌ "Port 5432 is already allocated"
**Causa:** Você já tem PostgreSQL rodando na sua máquina

**Solução 1 (Recomendada):** Pare seu PostgreSQL local
```bash
# Windows: Serviços > PostgreSQL > Parar
# Mac: brew services stop postgresql
# Linux: sudo systemctl stop postgresql
```

**Solução 2:** Mude a porta no `docker-compose.yml`
```yaml
ports:
  - "5434:5432"  # Mude 5432 para 5434
```

### ❌ Backend não conecta ao banco de dados
**Solução:** Verifique se o `.env` tem estes valores:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=carbonfighters_user
DB_PASSWORD=carbonfighters_pass
DB_NAME=carbonfighters
```

### ❌ As tabelas não existem no banco de dados
**Solução:** Recrie os containers:
```bash
docker-compose down -v
docker-compose up -d
```

---

## O que cada coisa faz?

### Arquivos importantes

```
CarbonFighters/
├── docker-compose.yml      # Configuração do Docker (2 bancos de dados)
├── setup.sh / setup.bat    # Scripts de instalação automática
├── DOCKER_SETUP.md         # Guia detalhado do Docker (inglês)
│
├── backend/
│   ├── .env               # Variáveis de ambiente (NÃO subir no Git)
│   ├── .env.example       # Template de variáveis de ambiente
│   └── data/
│       └── create_tables.sql  # Script que cria as tabelas automaticamente
│
└── frontend/
    └── (código React)
```

### Quais bancos de dados eu tenho?

Docker cria **2 bancos de dados** automaticamente:

1. **carbonfighters** (Porta 5432)
   - Para desenvolvimento e testes manuais
   - Usado pelo `npm run dev`

2. **carbonfighters_test** (Porta 5433)
   - Para testes automatizados
   - Usado pelo `npm test`

Ambos têm as mesmas tabelas (criadas a partir do `create_tables.sql`).

---

## Fluxo de trabalho recomendado

### Quando você começa a trabalhar:
```bash
# 1. Pull das mudanças da equipe
git pull

# 2. Iniciar bancos de dados
docker-compose start

# 3. Iniciar backend
cd backend && npm run dev

# 4. Iniciar frontend (novo terminal)
cd frontend && npm run dev
```

### Quando você termina de trabalhar:
```bash
# 1. Parar bancos de dados
docker-compose stop

# 2. Commit suas mudanças
git add .
git commit -m "feat: descrição da sua mudança"
git push
```

### Antes de fazer um Pull Request:
```bash
# 1. Verificar se os testes passam
cd backend && npm test

# 2. Verificar se o código compila
cd frontend && npm run build
```

---

## Vantagens de usar Docker

### Antes (PostgreSQL tradicional):
❌ Instalar PostgreSQL (30 min)  
❌ Criar usuário e senha  
❌ Criar banco de dados  
❌ Criar todas as tabelas manualmente  
❌ Problemas de versões diferentes  
❌ Problemas de permissões  
❌ "Na minha máquina funciona" 🤷  
**Total: 1-2 horas por pessoa** 😫

### Depois (com Docker):
✅ Instalar Docker (15 min, uma única vez)  
✅ `docker-compose up -d`  
✅ Tudo funciona igual em todas as máquinas  
✅ Fácil de limpar e reiniciar  
**Total: 30 segundos** 🎉

---

## Precisa de mais ajuda?

1. **Guia detalhado do Docker:** Leia [DOCKER_SETUP.md](./DOCKER_SETUP.md) (em inglês)
2. **README completo:** Leia [README.md](./README.md)
3. **Pergunte no grupo:** Todos nós já passamos por isso 😊

---

## Resumo: Comandos essenciais

```bash
# SETUP (primeira vez)
git clone https://github.com/Bruno-Jambeiro/CarbonFighters.git
cd CarbonFighters
./setup.sh          # Mac/Linux
# ou
setup.bat           # Windows

# TRABALHO DIÁRIO
docker-compose start                  # Iniciar bancos de dados
cd backend && npm run dev            # Backend
cd frontend && npm run dev           # Frontend (novo terminal)

# AO TERMINAR
docker-compose stop                  # Parar bancos de dados

# SE ALGO FALHAR (reset completo)
docker-compose down -v               # Apagar tudo
docker-compose up -d                 # Recriar tudo
```

---

**Pronto! Com isso você deve estar trabalhando em menos de 5 minutos.** 🚀

Se algo não funcionar, revise o [DOCKER_SETUP.md](./DOCKER_SETUP.md) ou pergunte no grupo.

**Bora codar!** 💚🌱
