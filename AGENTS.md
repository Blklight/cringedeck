<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

Guia curto para agentes/IA trabalhando neste projeto (template `tpl-ui`).

## Stack

Next.js 16 (App Router) + React 19 + TypeScript (strict, alias `@/*`) + Tailwind v4 + Base UI (componentes shadcn style `base-vega`) + TanStack Query + Zustand + Vitest. Bun como package manager.

## Comandos

- `bun run dev` — servidor com Turbopack
- `bun run build` — build de produção
- `bun run typecheck` — `tsc --noEmit`
- `bun run lint` — `biome check`
- `bun run test` — Vitest (jsdom)

Sempre rode `bun run typecheck`, `bun run lint` e `bun run test` antes de finalizar uma tarefa.

## Convenções

- **Componentes de UI:** vivem em `src/components/ui/` e são gerados pelo shadcn (style `base-vega`, sobre Base UI). Adicione com `bunx shadcn@latest add <nome> --overwrite --yes`. Evite editar esses arquivos à mão — mudanças podem ser sobrescritas.
- **Diferenças Base UI:** use a prop `render` no lugar de `asChild`; `useRender`/`mergeProps` no lugar de `Slot`; atributos `data-horizontal`/`data-vertical` no lugar de `data-[orientation=*]`.
- **Showcase:** `/components` renderiza um demo por componente. Novos demos vão em `src/components/showcase/demos/<categoria>.tsx` e são registrados na categoria correspondente em `registry.ts`.
- **Estilo:** Tailwind v4 com tokens semânticos + `cn()` de `@/lib/utils`. Animações/tokens em `src/app/globals.css`. Respeite sempre light/dark.
- **API:** use `apiClient` (`src/lib/api-client.ts`) — ele injeta o Bearer do `useAuthStore` e trata refresh em `401`. Envelope de resposta `{ data, error, message }`.
- **Data fetching:** TanStack Query via `getQueryClient()` (`src/lib/query-client.ts`); o `QueryProvider` já está no `layout.tsx`.
- **Auth:** estado em `src/store/useAuthStore.ts` (Zustand persistido). Não leia o token direto em componentes.
- **`cacheComponents: true`:** valores instáveis (`new Date()`, `Math.random()`) não podem rodar no pré-render de Client Components — envolva em `<Suspense>`. Leia `node_modules/next/dist/docs/` antes de mexer em APIs do Next.
- **Testes:** `tests/**/*.test.{ts,tsx}` (jsdom). `tests/setup.ts` já traz jest-dom, `cleanup` e polyfills de `matchMedia`/`PointerEvent`. Teste comportamento via papéis/`aria`.

## Não faça

- Não adicione comentários óbvios ao código.
- Não acesse `process.env` em componentes além de `NEXT_PUBLIC_*`.
- Não commite `.env*` (apenas `.env.example`).
- Não edite `src/components/ui/` manualmente sem necessidade (gerado pelo shadcn).
