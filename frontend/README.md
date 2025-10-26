# Frontend (Next.js) — Instruções de execução

Este repositório contém o frontend em Next.js. Abaixo estão os passos para instalar, rodar em desenvolvimento, gerar build e informações úteis sobre a estrutura de arquivos. Usa pnpm como gerenciador de pacotes.

## Requisitos
- Node.js (recomenda-se 18.x ou superior)
- pnpm (v7+)
- Git (opcional)

Instalar pnpm (se não tiver):
```
npm install -g pnpm
```

## Instalação
1. No diretório do projeto:
```
pnpm install
```

## Rodar em desenvolvimento
Inicia o servidor de desenvolvimento com hot reload:
```
pnpm run dev
```
Por padrão o Next roda em http://localhost:3000. Para mudar a porta:
```
PORT=4000 pnpm dev
```
(Windows PowerShell: `$env:PORT=4000; pnpm run dev`)

## Build e executar em produção
Gerar build otimizado:
```
pnpm build
```
Executar a aplicação produzida:
```
pnpm start
```
Ou executar em modo estático/preview:
```
pnpm --filter . start
```
(Algumas configurações de hospedagem exigem variáveis adicionais; veja seção de ambiente.)

Reinicie o servidor após editar variáveis.

## Estrutura sugerida de arquivos
Exemplo de árvore típica do projeto:
```
/
├─ public/
│  └─ assets/
├─ src/
│  ├─ app/ or pages/        # rota/app router (Next.js 13+ usa /app)
│  ├─ components/
│  ├─ lib/                  # utilitários e clients (ex: api client)
├─ .env.local
├─ next.config.js
├─ package.json
├─ pnpm-lock.yaml
├─ tsconfig.json (opcional)
└─ README.md
```
Se estiver usando o App Router (Next 13+), a pasta `src/app/` é a principal; caso contrário, `src/pages/`.

## Scripts úteis (package.json)
- pnpm dev — desenvolvedor
- pnpm build — build de produção
- pnpm start — iniciar produção
- pnpm lint — rodar linter (se configurado)
- pnpm format — formatar código (se configurado)
- pnpm test — executar testes (se houver)

Verifique `package.json` para confirmar os scripts exatos.

## Dicas e resolução de problemas
- Erro de versão do Node: ajuste o Node ou use nvm para trocar a versão.
- Dependências faltando: rodar `pnpm install --frozen-lockfile` para reproduzir lockfile.
- Ambiente diferente (Docker/Vercel): configure variáveis de ambiente na plataforma.
- CORS/API: verifique `NEXT_PUBLIC_API_URL` e endpoints no backend.

Se precisar que eu gere um `.env.local.example` ou adapte o README para um projeto TypeScript/Monorepo, diga qual configuração específica você usa (app router vs pages, TypeScript, monorepo pnpm workspace etc.).


## VARIÁVEIS DE AMBIENTE
- Existe um arquivo oculto ```.secrets.txt```, que não é seguro mas que possui as variáveis de ambiente necessárias para comunicação com API
- Crie um arquivo ```.env``` ou ```.env.local``` e coloque lá as variáveis e rode o app