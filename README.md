# unfiniting

unfiniting is a CLI tool to build training datasets intended for fine‑tuning large language models (LLMs) from a code repository or a folder of source files.

Brief: scan a repository or folder, identify relevant source artifacts, extract and annotate code snippets (AI-assisted + human review), generate prompt/completion pairs, and export SFT‑ready datasets.

Table of contents

- Quickstart
- Features
- CLI usage
- Execution plan / Roadmap
- Output formats & metadata
- Ethics, licensing & safety
- How to resume work in the next session (session guide)
- Prioritized next steps
- Contributing
- License

Quickstart
Requirements

- Node.js >= 18
- npm

Package manager note
This project uses pnpm as the package manager. We recommend enabling Corepack (available on modern Node versions) to get a reproducible pnpm:

# enable Corepack and prepare pnpm (recommended)

corepack enable
corepack prepare pnpm@latest --activate

Install dependencies:
pnpm install

If you prefer to install pnpm globally:
npm install -g pnpm

Install

1. Clone the repository:
   git clone <repo-url>
2. Install dependencies:
   pnpm install

Environment variables

- Copy `.env.example` to `.env` and set your OpenAI key: `CODEX_OPENAI_API_KEY=sk-...`.
- Load it before running the CLI: `set -a; source .env; set +a`.
- The CLI reads the key from the environment via `~/.codex/config.toml` where `[auth].api_key = "${CODEX_OPENAI_API_KEY}"` and uses the default model `openai/gpt-5-mini-2025-08-07`.
- `.env` is ignored by `.gitignore`; never commit real keys.

Run in development (TypeScript directly)
pnpm run dev

Build and run the compiled version
pnpm run build
pnpm start

Features (current & intended)

- Core current commands: setdir, showdir, cd (basic workspace management).
- Planned core pipeline commands: analyze, extract, annotate, export-sft, train.
- Persisted configuration (default: ~/.mycli_config.json).
- Extensible architecture (analyzers, extractors, annotators, exporters).

CLI usage (current and planned)

- setdir <path> — set working directory (persisted).
- showdir — show configured directory.
- cd <path> — change process working directory.
  Planned (to implement):
- analyze [options] — scan and score candidate files (respect .gitignore).
- extract [options] — copy and chunk selected files into a workspace.
- annotate [--auto|--interactive] — generate or review annotations (LLM-assisted).
- export-sft [--format=openai|hf] — export dataset in selected SFT format.
- train [--provider=openai|local] — run/prepare fine‑tuning (future).

Execution plan / Roadmap
Phase 0 — Preparations

- Ensure environment (Node >= 18), install deps, create local .env for secrets (do not commit).
- Verify current CLI runs (npm run dev).

Phase 1 — MVP (scan → extract → annotate → export)

- Implement `analyze`: list candidate files using heuristics and respect .gitignore.
- Implement `extract`: copy candidate files to workspace and split into snippets (functions, classes, docblocks) using heuristics or simple parsing.
- Implement `annotate` (auto): call an LLM to produce initial annotations (summary, intent).
- Implement `export`: produce JSONL SFT format `{ "prompt": "...", "completion": "..." }`.

Phase 2 — Improved extraction & annotation

- Use AST parsing (Babel / Tree‑sitter) for robust snippet extraction.
- Add richer metadata and scoring (path, language, start/end lines, commit hash, license).
- Provide an interactive human review UI for annotations.

Phase 3 — Safety, compliance, robustness

- Secrets/PII scanning and filtering before export.
- License checks and provenance tracking.
- Unit tests, CI, and validation workflows.

Phase 4 — Full training workflow

- Support export formats for targeted LLM providers (OpenAI, Hugging Face).
- Provide training wrappers (LoRA / PEFT) or prepare artifacts for external training.
- Add evaluation & benchmark loop for iterative improvement.

Output formats & metadata

- MVP export: JSONL (one JSON object per line) of SFT examples:
  `{ "prompt": "...", "completion": "..." }`
- Companion metadata file `metadata.jsonl` with provenance fields:
  `{ "path", "lang", "commit", "license", "score", "start_line", "end_line" }`
- Keep provenance (commit SHA, repo URL) to enable auditability.

Ethics, licensing & safety

- Respect upstream licenses: warn on restrictive licenses and require explicit consent to include third‑party code.
- Filter secrets and personal data before export (patterns + heuristics).
- Only process repositories you are authorized to use for training.

How to resume work in the next session (session guide)

- Define the session objective (e.g. "implement analyze and produce a candidate list").
- Preconditions:
  - `.env.local` contains necessary API keys for annotator tests (e.g. OPENAI_API_KEY).
  - A local sample repository or path to test against.
- Success criteria:
  - `analyze` lists candidate files with scores.
  - `extract` generates snippet artifacts in `workspace/` or `data/`.
  - `export` writes a valid JSONL SFT dataset.
- Deliverables:
  - Code for the implemented CLI commands, unit tests, and a small example dataset.

Prioritized next steps (recommended)

1. Implement `analyze` (scan + heuristics + .gitignore support) — high priority.
2. Implement `extract` (basic chunking by heuristics/regex) — high priority.
3. Implement minimal `annotator` wrapper (LLM calls for auto annotation) — medium.
4. Implement `export-sft` JSONL writer + validation — medium.
5. Add secrets scanning and license checks — medium.
6. Replace regex chunking with AST parsing for JS/TS — lower priority.

Contributing

- Please open issues or PRs for features/bugs.
- Add unit tests for new logic.
- Respect the code style (ESLint + Prettier configured in repo).

License
This project is licensed under the MIT License. See LICENSE for details.
