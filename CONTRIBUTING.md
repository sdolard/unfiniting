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

Opening PRs

- Create a feature branch from main.
- Include tests for new logic where appropriate.
- Describe the change and any migration steps in the PR description.

Thanks for contributing!
