# Contributing to unfiniting

Thank you for contributing! This document explains how to set up the development environment and the project's preferred package manager (pnpm).

Package manager (pnpm) and Corepack

- This repository standardizes on pnpm for dependency installation and reproducible lockfiles.
- Preferred method (recommended):

  1. Enable Corepack (if not already enabled):
     corepack enable
     corepack prepare pnpm@latest --activate
  2. Install dependencies:
     pnpm install

- Alternative: install pnpm globally:
  npm install -g pnpm
  pnpm install

Why pnpm?

- More disk efficient and faster installs using a global store.
- Strict node_modules layout reduces subtle issues caused by hoisting.
- Reproducible installs via pnpm-lock.yaml.

Local workflow

- Run the development CLI:
  pnpm run dev

- Build:
  pnpm run build

- Format (typescript):
  pnpm run format

- Format Markdown:
  pnpm run format:md

Testing & CI

- CI uses Corepack + pnpm. If you run CI jobs locally, enable Corepack as shown above.
- If tests are added, run them with:
  pnpm test

Committing

- After adding/changing dependencies, run:
  pnpm install
  git add pnpm-lock.yaml package.json
  git commit -m "deps: update dependencies"

Code style
 
- This repo uses ESLint and Prettier. Please run linters/formatters before committing:
  pnpm run lint
  pnpm run format

User-facing strings

- All text that will be shown to end users must be written in English. This includes:
  - console output from the CLI (help, prompts, error messages),
  - example commands shown in README or docs,
  - messages/assertions in tests that describe CLI behaviour.
- Reason: a single language for user-facing strings improves accessibility, testing and CI stability.
- Quick checklist before commit:
  1. Search for non-English strings in source files: grep -R --line-number -n 'Bienvenue\\|Répertoire\\|Préfixez\\|Impossible\\|Le chemin' src || true
  2. Run tests and inspect any failing tests that may assume English text.
  3. Update tests if you intentionally change wording.

If you introduce new CLI output, add/update unit tests that assert the English strings so regressions are prevented.

Commit instructions
- git add src/cli.ts CONTRIBUTING.md
- git commit -m "chore(i18n): require English for all user-facing strings and document policy"

Opening PRs

- Create a feature branch from main.
- Include tests for new logic where appropriate.
- Describe the change and any migration steps in the PR description.

Thanks for contributing!
