# Repository Guidelines

## Project Structure & Module Organization

- `src/` — TypeScript sources. Main entry: `src/cli.ts`.
- `dist/` — compiled JavaScript (`pnpm build`), published binary `dist/cli.js`.
- `tests/` — Vitest unit tests (`*.test.ts`), e.g. `tests/cli.test.ts`.
- `scripts/` — build/dev helpers (e.g., `add-shebang.js`).
- `.github/workflows/` — CI workflows (if present).

## Build, Test, and Development Commands

- Install (via Corepack + pnpm): `corepack enable && pnpm install`.
- Dev REPL (ts-node): `pnpm dev`.
- Build (tsc + shebang): `pnpm build` then run: `pnpm start`.
- Tests: `pnpm test` (once), `pnpm test:watch` (watch), coverage: `pnpm coverage`.
- Lint/format: `pnpm lint`, `pnpm lint:fix`, `pnpm format`, `pnpm format:md`.
- Clean: `pnpm clean`.

## Coding Style & Naming Conventions

- Language: TypeScript (Node >= 18). Target CommonJS output in `dist/`.
- Prettier: width 100, `semi: true`, `singleQuote: true`, trailing commas, LF line endings.
- Indentation: 2 spaces. Keep imports grouped/alphabetized (`eslint-plugin-import`).
- Naming: files `kebab-case.ts`; tests `*.test.ts`; functions `lowerCamelCase`; types/interfaces `PascalCase`; constants `UPPER_SNAKE_CASE`.
- User-facing strings (CLI output, tests) must be written in English.

## Testing Guidelines

- Framework: Vitest. Place tests under `tests/` mirroring feature names (e.g., `cli.test.ts`).
- Prefer black-box tests of CLI handlers (`handleCommand`).
- Keep assertions stable and in English. Check coverage with `pnpm coverage`.

## Commit & Pull Request Guidelines

- Commit style: concise, imperative; prefer conventional prefixes: `feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:` (e.g., `feat(cli): add /setdir validation`).
- Before opening a PR: run `pnpm lint`, `pnpm format`, `pnpm test`, and `pnpm build`.
- PRs should include: summary, rationale, usage notes or sample session, linked issue(s), and tests for new behavior.

## Security & Configuration Tips

- Do not commit secrets. Use local `.env` only for development.
- Respect `engines.node ">=18"`. Use Corepack-managed `pnpm` for reproducible installs.
