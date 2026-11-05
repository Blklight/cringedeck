# tpl-ui

Template de front-end em **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4**, com a infraestrutura já montada (tema, data fetching, auth store, 71 componentes base-vega sobre Base UI, página de showcase e testes). Use como ponto de partida de novos projetos — só a infraestrutura, sem features de domínio.

## Techs

- **Framework:** Next.js 16 (App Router, React Compiler / `cacheComponents`), React 19
- **Linguagem:** TypeScript 5 (`strict`, alias `@/*`)
- **Estilo:** Tailwind v4 (via `@tailwindcss/turbopack`) + `tw-animate-css`
- **UI:** componentes shadcn no style `base-vega`, construídos sobre **Base UI** (`@base-ui/react`)
- **Estado/Data:** Zustand (`useAuthStore`) + TanStack Query
- **HTTP:** Axios (`apiClient` com interceptors de auth/refresh)
- **Tema:** `next-themes` (light/dark/system)
- **Formulários:** React Hook Form + Zod-ish (Field/Form) + `input-otp`, `react-day-picker`
- **Gráficos:** Recharts
- **Ícones:** lucide-react
- **Animação:** Motion (`motion/react`), `react-parallax-tilt`, `react-use-measure`
- **Testes:** Vitest + Testing Library (jsdom)
- **Lint/format:** Biome

## Requisitos

- Node.js 20+
- [Bun](https://bun.sh) (o projeto usa `bun@1.3.5` como package manager)

## Setup

```bash
# 1. Instalar dependências
bun install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# edite .env.local (NEXT_PUBLIC_API_URL)

# 3. Rodar o servidor em modo dev
bun run dev
```

App em `http://localhost:3000` e showcase de componentes em `http://localhost:3000/components`.

## Scripts

| Script | Descrição |
|---|---|
| `bun run dev` | Servidor de desenvolvimento (Turbopack) |
| `bun run build` | Build de produção |
| `bun run start` | Roda o build |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run lint` | `biome check` |
| `bun run format` | `biome format --write` |
| `bun run test` / `test:watch` / `test:coverage` | Vitest |

Sempre rode `bun run typecheck`, `bun run lint` e `bun run test` antes de finalizar uma tarefa.

## Estrutura

```
src/
├── app/
│   ├── layout.tsx          # providers (tema, query, tooltip, toaster) + fontes
│   ├── page.tsx            # home de exemplo
│   ├── globals.css         # tokens/tema Tailwind v4 + animações
│   └── components/page.tsx # showcase dos 71 componentes
├── assets/images/          # imagens estáticas (ruído/fundo)
├── components/
│   ├── layout-base.tsx     # shell visual (moldura/background)
│   ├── theme-provider.tsx  # wrapper do next-themes
│   ├── query-provider.tsx  # TanStack Query + devtools
│   ├── ui/                 # 71 componentes (base-vega / Base UI)
│   └── showcase/           # registry + demos da página /components
├── hooks/
│   ├── use-controllable-state.ts
│   └── use-mobile.ts
├── lib/
│   ├── api-client.ts       # Axios + interceptors (auth header, refresh 401)
│   ├── query-client.ts     # factory do QueryClient (retry/  staleTime)
│   ├── session.ts          # endSessionLocal / logout
│   └── utils.ts            # cn()
├── store/
│   └── useAuthStore.ts     # Zustand persistido (user, accessToken)
└── types/
    └── api.types.ts        # contrato da API (envelope, User, Item)
tests/
├── setup.ts                # jest-dom, cleanup, polyfills (matchMedia/PointerEvent)
├── components/             # testes de componentes
├── hooks/                  # testes de hooks
├── lib/                    # testes de utilitários
└── store/                  # testes da store
```

## Componentes

`src/components/ui/` traz 71 componentes no style `base-vega` (shadcn) sobre Base UI — formulários, overlays, menus, dados e um conjunto de componentes custom (HoloCard, TerminalAnimation, PollWidget, DitherShader, ...).

- Para adicionar um novo: `bunx shadcn@latest add <nome> --overwrite --yes`.
- A página `/components` renderiza um demo de cada componente. Para incluir um novo no showcase, crie o demo em `src/components/showcase/demos/<categoria>.tsx` e registre o item na categoria correspondente.

## Convenções

### API e sessão

- O `apiClient` (`src/lib/api-client.ts`) injeta `Authorization: Bearer <token>` a partir do `useAuthStore` e, em um `401` autenticado, tenta um `/auth/refresh` único (compartilhado entre requisições concorrentes) antes de refazer a chamada. Sem refresh bem-sucedido, limpa a sessão e redireciona para `/`.
- Nunca leia o token direto em componentes; use o `useAuthStore`.
- Toda resposta segue o envelope `{ data, error, message }` (`src/types/api.types.ts`).

### Data fetching

- Use `getQueryClient()` (singleton no browser) e TanStack Query. Os defaults ficam em `src/lib/query-client.ts` (staleTime 5 min; sem retry em `401`).
- O `QueryProvider` já envolve a árvore no `layout.tsx`.

### Estilo

- Classes utilitárias Tailwind v4; combine com `cn()` de `@/lib/utils`.
- Tokens de tema e animações ficam em `src/app/globals.css` (inclui as animações usadas pelos componentes, ex.: `animate-caret-blink`, `--animate-aurora`).
- Sempre respeite light/dark (`dark:`), usando os tokens semânticos (`bg-background`, `text-muted-foreground`, ...).

### Next.js 16 / `cacheComponents`

- `next.config.ts` habilita `cacheComponents: true`. Valores instáveis (`new Date()`, `Math.random()`) **não** podem ser usados no pré-render de Client Components. Envolva trechos que dependem de estado não-determinístico em `<Suspense>` (como em `src/app/components/page.tsx`).
- Consulte os guias em `node_modules/next/dist/docs/` antes de mexer em APIs do framework.

### Testes

- Testes em `tests/**/*.test.{ts,tsx}`; ambiente jsdom com Testing Library.
- `tests/setup.ts` registra jest-dom, faz `cleanup` automático e define polyfills de `matchMedia` e `PointerEvent` (necessário para os componentes Base UI).
- Prefira testar comportamento (papéis/`aria`) a classes CSS frágeis.

## Não faça

- Não adicione comentários óbvios ao código.
- Não leia `process.env` em componentes além de `NEXT_PUBLIC_*`.
- Não commite `.env*` (apenas `.env.example`).
- Não edite arquivos de `src/components/ui/` manualmente sem necessidade — eles são gerados pelo shadcn; mudanças tendem a ser sobrescritas em um novo `add`.
