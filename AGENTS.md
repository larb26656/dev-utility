# AGENTS.md

## Dev Utility — Developer Tool Application

### Commands

```bash
npm run dev        # Start dev server on port 3000
npm run build      # vite build && tsc (both run together)
npm run preview    # Preview production build
npm run test       # Vitest (jsdom environment)
npm run lint       # ESLint via @tanstack/eslint-config
npm run format     # Prettier write
npm run check      # prettier --write . && eslint --fix
```

### Pre-commit Hook

Lefthook runs `npm run lint && npm run build` on `*.{js,ts,tsx}` files. Lint must pass before commit.

### Architecture

- **Routing**: TanStack Router with file-based routing. `routeTree.gen.ts` is auto-generated — do not edit manually.
- **Tools**: Registry pattern in `src/lib/extensions/tools/register.ts`. Tool categories: `Hash`, `Typo`, `Converter`, `Snippet`.
- **Tool types**: Generator (one-way content creation), Transformer (OneWay/TwoWay/NWay conversions), FreeStyle (custom UI), Snippet.
- **Entry point**: `src/main.tsx` creates router from `routeTree.gen.ts`.

### Adding a New Tool

1. Create tool in `src/lib/extensions/tools/<category>/<name>.ts` using factory functions
2. Export from category `index.ts`
3. Import and `registry.register()` in `src/lib/extensions/tools/register.ts`
4. If new category, add to `ToolCategory` type in `src/lib/tools/types.ts`

### Testing

- Place test files **co-located** next to the implementation: `<name>.test.ts` beside `<name>.ts`
- Example: `docker-cli-to-compose.ts` and `docker-cli-to-compose.test.ts` in the same directory
- Run tests: `npm run test`

### Build & Deploy

- Build output: `dist/` (gitignored)
- Cloudflare Pages deployment via `wrangler.jsonc` — serves `dist/` as SPA
- `.tanstack/` is gitignored (router codegen artifact)

### Key Constraints

- TypeScript strict mode, `noUnusedLocals`, `noUnusedParameters` enabled
- `verbatimModuleSyntax` — use `import type` for type-only imports
- Tests use jsdom via Vitest
