# Repository Guidelines

## Project Structure & Module Organization
- Root folders: `underscore_the_mound/` (Svelte + TypeScript + Vite app; source in `src`, shared pieces in `src/lib`, assets in `src/assets`, global styles in `src/app.css`), `engine/` (ES module prototypes for combat systems such as `combat_store.js`), `backups/engine/` (archived engine drafts; keep read-only unless migrating), `data/` (CSV reference tables like `blessings.csv`), and `tools/` (utility scripts like `blessing_prompter.py`).
- Add new UI code inside `underscore_the_mound/src/lib` with colocated styles; keep gameplay logic in `engine/` and keep modules small and single-purpose.

## Build, Test, and Development Commands
- `cd underscore_the_mound && npm install` — install dependencies (Node 18+ recommended).
- `npm run dev` — start the Vite dev server; append `-- --host` for LAN testing.
- `npm run build` — produce a production bundle in `underscore_the_mound/dist`.
- `npm run preview` — serve the built bundle locally.
- `npm run check` — run `svelte-check` and TypeScript; use before pushing.
- Engine scripts are plain ESM; run quick experiments with `node engine/<file>.js` or a REPL snippet before wiring into the UI.

## Coding Style & Naming Conventions
- Follow the existing template style: 2-space indentation, single quotes, and no trailing semicolons; group imports by path depth.
- Prefer TypeScript for Svelte components; type public props and store values explicitly.
- PascalCase for classes and Svelte components, camelCase for functions/variables, SCREAMING_SNAKE_CASE for constants.
- Keep UI and engine layers decoupled; exchange data via typed interfaces instead of direct cross-imports.

## Testing Guidelines
- There is no automated test suite yet; rely on `npm run check` for regressions.
- For UI behaviors, add component tests with Vite’s test runner or Playwright when introduced; name files `ComponentName.test.ts` inside `src/lib/__tests__`.
- For engine logic, add Node’s built-in `node --test` cases under `tests/engine/` mirroring module names (e.g., `tests/engine/combat_store.test.js`).

## Commit & Pull Request Guidelines
- History uses short, present-tense messages; keep commits small and imperative (e.g., `add combat state guard`), grouping related changes together.
- In PRs, state intent, key changes, and tests run; attach screenshots or clips for UI tweaks and link related TODOs/issues.
- Note any `data/` updates and document new commands or conventions in this guide when they appear.
