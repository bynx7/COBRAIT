# COBRAIT Admin API

Backend minimo para autenticacao do painel admin e gestao de utilizadores em Postgres.

## O que faz

- autentica utilizadores com `email + password`
- guarda utilizadores em `admin_users`
- guarda leads em `contact_requests`
- guarda pedidos de agendamento em `call_bookings`
- expõe um assistente público em `POST /api/chat`
- expoe rotas `/api/auth/*` e `/api/users`
- cria um admin inicial automaticamente se `ADMIN_EMAIL` e `ADMIN_PASSWORD` estiverem definidos

## Arranque rapido

1. Se quiseres correr tudo sem Docker, usa na raiz do projeto:

```powershell
.\start-dev.cmd
```

Isto arranca:

- API em `http://localhost:4000/api/health`
- site estatico em `http://localhost:5500/`
- admin em `http://localhost:5500/admin.html`

Por defeito, o projeto usa `STORAGE_MODE=file` e guarda os dados locais em `server/data/local-storage.json`.

2. Se quiseres correr tudo com Docker, usa na raiz do projeto:

```powershell
docker compose up --build
```

Depois abre `http://localhost:5500/admin.html`.

3. Se preferires correr so a base de dados com Docker, sobe o Postgres:

```powershell
docker compose up -d postgres
```

4. Ajusta o `.env` da raiz se precisares de mudar portas, credenciais do admin ou ativar Postgres.

5. Se estiveres a usar uma base criada manualmente no pgAdmin, executa tambem:

```text
server/sql/001_init.sql
server/sql/002_site_operations.sql
server/sql/003_call_booking_sources.sql
```

6. Instala dependencias:

```powershell
cd server
npm install
```

7. Inicia a API:

```powershell
npm start
```

8. Serve os HTML do projeto noutra consola:

```powershell
.\serve-local.ps1 -Port 5500
```

9. Abre `http://localhost:5500/admin.html`.

## Modos de storage

- `STORAGE_MODE=file`: nao precisa de Docker nem PostgreSQL. Guarda tudo em `server/data/local-storage.json`.
- `STORAGE_MODE=postgres`: usa PostgreSQL com `DATABASE_URL` ou `POSTGRES_*`.

Por defeito, o `admin.html` tenta usar `http://localhost:4000/api` quando e aberto localmente.

O `index.html` envia o formulario principal para `POST /api/contact-requests` e o `book-a-call.html` envia para `POST /api/call-bookings`.

Se definires `OPENAI_API_KEY`, o assistente do site usa a OpenAI para responder com contexto da Cobrait. Sem essa chave, o widget continua a funcionar com respostas locais para perguntas simples e FAQs base.

## Rotas principais

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id`
- `POST /api/contact-requests`
- `GET /api/contact-requests`
- `PATCH /api/contact-requests/:id`
- `POST /api/call-bookings`
- `POST /api/chat`
- `GET /api/call-bookings`
- `PATCH /api/call-bookings/:id`
