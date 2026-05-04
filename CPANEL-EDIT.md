# Edicao Pelo cPanel

Este site ficou preparado para edicoes simples em modo estatico.

Para publicar ou reiniciar a aplicacao Node no cPanel, ver `CPANEL-DEPLOY.md`.

O ficheiro principal para alterar textos e contactos e:

- `assets/data/site-content.json`

## O que pode ser editado la

Dentro desse ficheiro podes mudar:

- email principal do site
- email que recebe o formulario
- link e nome do Instagram
- texto do footer
- textos principais da `index.html`
- textos principais da `about-us.html`
- textos principais da `tech.html`
- textos principais da `book-a-call.html`

## Como editar no cPanel

1. Entrar no `cPanel`
2. Abrir `File Manager`
3. Ir para a pasta do site
4. Abrir `assets/data/site-content.json`
5. Carregar em `Edit`
6. Alterar apenas o texto entre aspas `"..."` depois dos `:`
7. Carregar em `Save Changes`
8. Atualizar o site no browser

## Regras importantes

- Nao apagar `{ } [ ] , :`
- Nao apagar as aspas das chaves, por exemplo `"email"`
- Se o texto tiver aspas no meio, usar `\"`
- Em textos com quebra de linha no site, o ficheiro pode usar `<br>`

## Exemplos

Mudar o email:

```json
"email": "novoemail@empresa.pt"
```

Mudar o email que recebe o formulario:

```json
"formRecipientEmail": "comercial@empresa.pt"
```

Mudar um titulo da home:

```json
"titleLine1": {
  "pt": "Novo titulo em portugues",
  "en": "New title in english",
  "es": "Nuevo titulo en espanol"
}
```

## Quando editar imagens

As imagens continuam a ser trocadas manualmente no `File Manager`.

Exemplo:

- substituir ficheiros dentro de `assets/images/`

Se quiserem trocar uma imagem e manter o mesmo nome do ficheiro, normalmente o site atualiza sem precisar mexer no HTML.
