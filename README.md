# Zoids Sleeper

Idle/clicker game set in the Zoids universe, built with Solid.js, TypeScript and Vite.

[Play Zoids Sleeper](https://elawdk.com/ZoidsSleeper/)

## Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) v22 or higher
- npm (included with Node.js)

## Installation and development

```bash
git clone git@github.com:TheCoreZi/ZoidsSleeper.git
cd ZoidsSleeper
npm install
npm run dev
```

The development server runs at [http://localhost:5173](http://localhost:5173).

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (dist/) |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests with Vitest |
| `npm run test:watch` | Tests in watch mode |
| `npm run lint` | ESLint on src/ |
| `npm run lint:fix` | ESLint with autofix |
| `npm run lint:css` | Stylelint on CSS files |
| `npm run lint:css:fix` | Stylelint with autofix |

## Code quality

### Pre-commit hooks

The project uses [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) to automatically validate on commit:

- **ESLint** and TypeScript type checking on `.ts` and `.tsx` files
- **Stylelint** on `.css` files

### CI on Pull Requests

Every PR runs a CI workflow that validates lint, tests and build. **PRs that fail CI will not be reviewed.**

### Editor setup

The project includes `.editorconfig` for consistency (indentation, line endings, encoding).

Recommended VS Code extensions:

- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)

## Tests

```bash
npm run test        # single run
npm run test:watch  # watch mode
```

Tests use [Vitest](https://vitest.dev/) with jsdom and are located in the `/test/` directory.

## Project structure

```
src/
  campaign/    # Campaigns and progression
  dungeon/     # Dungeons
  game/        # Game loop, battles, saving
  i18n/        # Internationalization (i18next)
  item/        # Items and shop
  landmark/    # Map landmarks
  map/         # World map
  models/      # Data models (Zoid, Pilot, etc.)
  npc/         # NPCs
  requirement/ # Requirements system
  reward/      # Rewards system
  store/       # Reactive stores (Solid.js signals)
  story/       # Narrative and dialogue
  ui/          # UI components
test/          # Unit tests
```

## How to contribute

1. Fork the repository and create a branch for your change.
2. Make sure `npm run lint`, `npm run lint:css` and `npm run test` pass locally.
3. Pre-commit hooks validate automatically, but verify before pushing.
4. Open a small, focused PR with a clear description of what it does and why.
5. CI validates every PR automatically — PRs that fail CI will not be reviewed.

## Deployment

Deployment to production is automatic via GitHub Actions on push to `master`. No manual action is required.
