# Deploy no cPanel com Setup Node.js App

## Ficheiros a enviar

Envia a raiz deste projeto para a pasta da aplicacao Node no cPanel. A raiz tem de conter:

- `app.js`
- `package.json`
- `package-lock.json`
- ficheiros `.html`
- `assets/`
- `servicos/`
- `server/`

Nao envies `node_modules/`. O cPanel instala isso com `Run NPM Install`.

## Setup Node.js App

No cPanel, cria a aplicacao com estes valores:

- Node.js version: 18 ou superior
- Application root: pasta onde enviaste este projeto
- Application URL: dominio ou subdominio pretendido
- Application startup file: `app.js`

Depois carrega em:

1. `Create`
2. `Run NPM Install`
3. `Restart`

## Variaveis de ambiente

Configura no cPanel as variaveis do ficheiro `.env.example`.

Obrigatorias:

- `NODE_ENV=production`
- `STORAGE_MODE=mysql`
- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_DATABASE`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `JWT_SECRET`
- `SESSION_COOKIE_SECURE=true`
- `CORS_ORIGINS=https://teu-dominio.pt`

O cPanel injeta normalmente o `PORT`. Se existir campo para variaveis, nao precisas de fixar o `PORT` manualmente.

## Base de dados MySQL

Cria a base de dados e o utilizador em `MySQL Databases` no cPanel. Depois importa:

```text
server/sql/mysql/001_init.sql
```

Se quiseres criar o primeiro administrador automaticamente, define tambem:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`

Depois do primeiro arranque podes remover `ADMIN_PASSWORD` das variaveis, desde que o utilizador ja exista.

## URLs de teste

- Site: `https://teu-dominio.pt/`
- API health: `https://teu-dominio.pt/api/health`
- Admin: `https://teu-dominio.pt/admin.html`
