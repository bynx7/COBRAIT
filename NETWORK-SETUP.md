# Network Mode

## O que o outro computador precisa

- Apenas um browser.
- Nao precisa de instalar Node, npm, Postgres ou Docker.

## O que o PC host precisa

- Este projeto.
- Node.js instalado.
- A base de dados/configuracao local do projeto a funcionar como ja usas normalmente.

## Arrancar em rede local

Na raiz do projeto:

```powershell
.\start-network.cmd
```

Ou, se preferires o PowerShell diretamente:

```powershell
.\start-network.ps1
```

O script:

- abre a Web em `0.0.0.0`
- arranca a API em rede local
- reinicia a API em `0.0.0.0` se ela ja estiver presa a `localhost`
- tenta abrir as portas `5500` e `4000` no Firewall do Windows
- mostra os URLs para aceder a partir de outros computadores da mesma rede

## URLs

Exemplo:

```text
http://192.168.1.23:5500/
http://192.168.1.23:5500/admin.html
http://192.168.1.23:4000/api/health
```

## Nota sobre o admin/CMS

O `admin.html` e o CMS publico passam a usar automaticamente o IP atual da maquina para falar com a API em `:4000`, o que permite editar o site a partir de outro computador da rede.
