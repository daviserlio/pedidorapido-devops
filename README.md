# 🍔 PedidoRápido — Sistema de Pedidos Online

**Disciplina:** DevOps com Docker Compose e GitHub Actions  
**Professor:** Elias do Nascimento Melo Filho  
**Aluno:** Davi Serlio Lopes de Souza  
**Matrícula:** 2414290102  

---

## 🏗️ Arquitetura

```
Frontend (React + Nginx)  →  Backend (Node.js + Express)  →  PostgreSQL
      :3000                          :3001                       :5432
```

---

## 🚀 Como Executar

### Pré-requisitos
- Docker 24+
- Docker Compose v2

### 1. Clonar e configurar variáveis de ambiente

```bash
git clone https://github.com/daviserlio/pedidorapido-devops.git
cd pedidorapido-devops
cp .env.example .env
```

### 2. Subir todos os containers

```bash
docker compose up --build
```

Acesse:
- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001
- **Health:** http://localhost:3001/health

### 3. Parar os containers

```bash
docker compose down
```

---

## 🧪 Como Testar

### Testes automatizados

```bash
cd backend
npm install
npm test
```

### Testar API manualmente

```bash
curl http://localhost:3001/health
curl http://localhost:3001/api/pedidos
curl -X POST http://localhost:3001/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{"cliente":"João","item":"Pizza","quantidade":2}'
```

---

## 🐳 Como Subir os Containers

```bash
docker compose up --build
docker ps
docker logs pedidorapido-backend
docker compose down
```

---

## ⚙️ Como Executar a Pipeline

```bash
git add .
git commit -m "feat: descricao da mudanca"
git push origin main
```

Acompanhe em: https://github.com/daviserlio/pedidorapido-devops/actions

---

## 🐛 Correções Realizadas

| Problema | Causa | Solução |
|----------|-------|---------|
| Backend não conecta ao banco | `DB_HOST=localhost` dentro do container | Alterado para `DB_HOST=db` |
| Containers sobem fora de ordem | Sem `depends_on` | Adicionado `depends_on` com `condition: service_healthy` |
| Banco perde dados | Sem volume persistente | Adicionado volume `postgres-data` |
| Frontend não acessa API | URL hardcoded `localhost` | Uso de `REACT_APP_API_URL` via variável de ambiente |
| Variáveis sensíveis expostas | Senhas no código | Uso de `.env` e Secrets do GitHub |
| Build quebrando | Node version incompatível | Padronizado Node 20 LTS |
| Sem testes automatizados | — | Jest + Supertest implementados |
| Sem rollback | — | Healthcheck + rollback no workflow de deploy |

---

## 🔐 Segurança

- Senhas em `.env` (não commitado)
- Secrets do GitHub Actions para produção
- `.gitignore` ignora `.env` e `node_modules`
- Usuário sem privilégios root no container backend
- Imagens Docker baseadas em `alpine`

---

## 📁 Estrutura do Projeto

```
pedidorapido-devops/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── index.js
│   │   ├── app.js
│   │   ├── db.js
│   │   └── routes/
│   │       └── pedidos.js
│   └── tests/
│       └── api.test.js
├── database/
│   └── init.sql
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React + Nginx |
| Backend | Node.js + Express |
| Banco de Dados | PostgreSQL |
| Containers | Docker |
| Orquestração | Docker Compose |
| CI/CD | GitHub Actions |
| Testes | Jest + Supertest |