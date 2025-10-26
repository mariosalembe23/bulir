# README — API (Node + Express + Prisma)

Este repositório contém uma API construída com Node.js, Express e Prisma. Abaixo estão os passos mínimos para rodar em desenvolvimento e produção usando pnpm.

## Requisitos

- Node.js (recomendado: 18+)
- pnpm instalado globalmente (npm i -g pnpm)
- Um banco de dados suportado pelo Prisma (Postgres, MySQL, SQLite, etc.)

## Instalação

1. Clonar o repositório
2. Instalar dependências:
   pnpm install

## Prisma — preparar o banco

1. Gerar o cliente Prisma:
   pnpm prisma generate
2. Criar/migrar o schema:
   pnpm prisma migrate dev --name init
   (ou, para produção: pnpm prisma migrate deploy)
3. Se houver seed definido no `prisma/seed` ou em package.json:
   pnpm prisma db seed
   (ou criar script: "prisma:seed": "prisma db seed" e executar pnpm run prisma:seed)

## Scripts sugeridos (package.json)

Exemplo de scripts úteis:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
```

(Adapte conforme uso de JavaScript ou TypeScript.)

## Rodando em desenvolvimento

1. Garantir .env configurado e banco acessível
2. Rodar migrações + gerar client:
   pnpm prisma generate
   pnpm prisma migrate dev --name init
3. Iniciar:
   pnpm run dev
   A API ficará disponível em http://localhost:3001/api.

## Rodando em produção

0. Rodar
   pnpm run dev
1. Build:
   pnpm run build
2. Aplicar migrações (se necessário):
   pnpm prisma migrate deploy

## Dicas e erros comuns

- Se ocorrer erro de conexão com o DB, verifique DATABASE_URL no .env.
- Ao mudar schema.prisma, rode `pnpm prisma generate` e as migrações novamente.
- Para logs de SQL, habilite log no cliente Prisma ou configure DEBUG.

## VARIÁVEIS DE AMBIENTE

- Existe um arquivo oculto `.secrets.txt`, que não é seguro mas que possui as variáveis de ambiente necessárias para comunicação com API
- Crie um arquivo `.env` ou `.env.local` e coloque lá as variáveis e rode o app

---

Este README é um guia básico. Ajuste comandos e scripts conforme a estrutura do projeto (JS/TS, localização dos fontes, seed etc.).
