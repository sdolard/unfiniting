# Repository Guidelines

This short contributor guide explains the project's conventions and common workflows for `unfiniting`.

## Project Structure & Module Organization

- `src/` — TypeScript sources (main entry: `src/cli.ts`).
- `dist/` — compiled CommonJS output (`pnpm run build`).
- `tests/` — Vitest tests (`*.test.ts`, e.g. `tests/cli.test.ts`).
- `scripts/` — helper scripts (e.g., `scripts/add-shebang.js`).

## Build, Test, and Development Commands

- `corepack enable && pnpm install` — install dependencies.
- `pnpm dev` — run the REPL with `ts-node` for development.
- `pnpm build` — compile TypeScript to `dist/` and run `postbuild` (adds shebang).
- `pnpm start` — run compiled CLI (`node dist/cli.js`).
- `pnpm test` — run unit tests (Vitest); `pnpm test:watch` for watch mode.
- `pnpm lint` / `pnpm lint:fix` — run ESLint; `pnpm format` — run Prettier.

## Coding Style & Naming Conventions

- Language: TypeScript (Node >= 18). Target: CommonJS output.
- Indentation: 2 spaces. Line endings: LF.
- Prettier: `printWidth: 100`, `semi: true`, `singleQuote: true`, `trailingComma: 'all'`.
- Naming: files use `kebab-case.ts`, tests `*.test.ts`, functions `lowerCamelCase`, types `PascalCase`, constants `UPPER_SNAKE_CASE`.

## Testing Guidelines

- Framework: Vitest. Put tests under `tests/` mirroring features.
- Prefer black‑box tests of exported handlers (e.g., `handleCommand`).
- Keep assertions and user-facing strings in English for stability.
- Run tests: `pnpm test` (CI uses `pnpm test --run`).

## Commit & Pull Request Guidelines

- Use conventional commit prefixes: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.
- Before opening a PR run: `pnpm lint`, `pnpm format`, `pnpm test`, `pnpm build`.
- PRs should include a summary, rationale, linked issue(s), and tests for new behavior.

## Security & Configuration Tips

- Never commit secrets. Use `.env` locally; `.env.example` is provided. `.env` is ignored.
- Respect `engines.node: ">=18"` and prefer Corepack-managed `pnpm`.

If in doubt, open an issue or ask for review on your PR.

