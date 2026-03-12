# Docker Setup

## O que esta configurado

O projeto pode agora arrancar com um unico comando:

- `postgres` para a base de dados
- `api` para o backend Node/Express
- `web` para servir os ficheiros HTML/CSS/JS

## Passo a passo

1. Instala o Docker Desktop e confirma que esta a correr.

2. Na raiz do projeto, cria um ficheiro `.env` com base no exemplo:

```powershell
Copy-Item .env.docker.example .env
```

3. Se quiseres, abre o `.env` e altera:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `JWT_SECRET`
- `WEB_PORT`
- `API_PORT`

4. Arranca tudo:

```powershell
docker compose up --build
```

5. Abre o site:

```text
http://localhost:5500
```

6. Abre o painel admin:

```text
http://localhost:5500/admin.html
```

7. Se quiseres confirmar que a API esta viva:

```text
http://localhost:4000/api/health
```

## Comandos uteis

Arrancar em background:

```powershell
docker compose up -d --build
```

Ver logs:

```powershell
docker compose logs -f
```

Ver so os logs da API:

```powershell
docker compose logs -f api
```

Parar tudo:

```powershell
docker compose down
```

Apagar tambem a base de dados local:

```powershell
docker compose down -v
```

Reconstruir apenas o frontend:

```powershell
docker compose up -d --build web
```

Reconstruir apenas a API:

```powershell
docker compose up -d --build api
```

## Porque isto ajuda

### 1. Backend + Postgres + site com um unico comando

Nao precisas de abrir varias janelas para:

- ligar Postgres
- arrancar `npm start`
- correr o servidor local dos HTML

O `docker compose up --build` faz isso por ti.

### 2. Deploy mais facil

Estas a aproximar o projeto de um formato de deploy real:

- o backend corre numa imagem
- o site corre noutra imagem
- a base de dados corre separada

Mais tarde podes reutilizar esta estrutura num VPS, staging ou cloud.

### 3. Ambientes de teste e staging

Podes ter ficheiros `.env` diferentes para:

- local
- staging
- producao

Ou usar o mesmo `docker compose` com valores diferentes.

### 4. Entregar o projeto a outra pessoa

Outra pessoa deixa de precisar de configurar manualmente:

- PostgreSQL
- variaveis do backend
- servidor local para o frontend

Basta instalar Docker e correr o compose.
