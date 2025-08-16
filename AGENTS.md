# Repository Guidelines

## Project Structure & Modules
- `apps/web/`: React + TypeScript + Vite app using Chakra UI. Entry: `index.html` → `src/main.tsx` → `src/App.tsx` → feature components (e.g., `TitleScreen.tsx`).
- `docs/`: Design notes and specifications (Markdown).
- `assets/`: Static assets (images, audio, etc.).

## Build, Test, and Development Commands
Run app commands in `apps/web`.
- `npm run dev`: Start Vite dev server with HMR.
- `npm run build`: Type-check (`tsc -b`) and create production build.
- `npm run preview`: Serve the production build locally.
- `npm run lint`: Lint project with ESLint.

Example:
```
cd apps/web
npm install
npm run dev
```

## Coding Style & Naming Conventions
- TypeScript, React function components; 2-space indentation.
- Files: PascalCase for components (`TitleScreen.tsx`), camelCase for variables/functions, kebab-case for assets.
- Imports: use relative paths within `src/`; keep component modules small and focused.
- Theming: centralize Chakra customization in `src/theme.ts`.
- Linting: ESLint configured via `eslint.config.js` (JS, TS, React Hooks, Vite refresh). Fix warnings before committing.

## Testing Guidelines
- No test runner configured yet. If adding tests, prefer Vitest + React Testing Library.
- Place tests alongside code as `*.test.ts(x)` or under `src/__tests__/`.
- Aim for component-level tests for UI and pure-function tests for utilities.

## Commit & Pull Request Guidelines
- Commits: clear, imperative messages; group related changes. Suggested pattern: `web: concise summary` or Conventional Commits (e.g., `feat(web): add title screen`).
- Pull Requests: include scope/goal, linked issues, and screenshots/GIFs for UI changes. Note any breaking changes and manual steps.
- Keep PRs focused and reasonably small for faster review.

## Security & Configuration Notes
- Do not commit secrets. Environment-specific config should use Vite env files (`.env.local`, not tracked).
- Node.js 18+ recommended. Use `npm ci` in CI to ensure deterministic installs.
