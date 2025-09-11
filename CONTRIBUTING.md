# Contributing to Discord AI SDK

Thank you for your interest in contributing! This guide explains how to propose changes and collaborate effectively.

## Code of Conduct

By participating, you agree to uphold our Code of Conduct. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Before You Start

- For new features or behavior changes, please open an Issue or Discussion first to align on scope and design.
- For bug reports, include reproduction steps, expected vs actual behavior, and environment info (OS, Node, package versions).
- Security issues: do not open a public issue. Please report privately (see SECURITY.md).

## Development Setup

Requirements: Node 18.17+ or 20+, pnpm.

```bash
# clone your fork
git clone https://github.com/<you>/discord-ai-sdk.git
cd discord-ai-sdk

# install dependencies
pnpm install

# typecheck / lint / test / build
pnpm run typecheck
pnpm run lint
pnpm run test      # watch
pnpm run test:run  # CI mode
pnpm run build
```

## Project Conventions

- Package manager: pnpm
- Language: TypeScript (strict). Do not use `any`; prefer `unknown` + narrowing.
- Linting: ESLint v9 flat config; follow existing rules.
- Formatting: Prettier (run `pnpm run format`).
- Paths: use `@/` alias for imports from `src` when possible.
- Commits: Prefer Conventional Commits (e.g., `feat: ...`, `fix: ...`, `docs: ...`).

## Tests

- Runner: Vitest
- Location: `tests/` (unit under `tests/unit/**`, integration under `tests/integration/**`).
- Add/adjust tests for changed logic. Docs-only or config-only PRs can skip tests.
- Keep tests fast and focused; use typed fakes/mocks (see `tests/utils/*`).

## Documentation

- Update README or inline TSDoc for new public APIs.
- If you change developer workflows or environment variables, update README accordingly.

## Pull Request Guidelines

- Keep PRs focused and reasonably small.
- Include a clear description and reference related issues (e.g., `Fixes #123`).
- Ensure these pass locally before submitting:
  - `pnpm run typecheck`
  - `pnpm run lint`
  - `pnpm run test:run`
  - `pnpm run build`
- If adding features or changing behavior, add/adjust tests and docs.

### PR Checklist

- [ ] Issue/Discussion exists for non-trivial changes
- [ ] Typecheck, lint, tests, build pass
- [ ] Tests added/updated (if applicable)
- [ ] README/docs updated (if applicable)

## License

By contributing, you agree that your contributions are licensed under the project’s MIT License (see [LICENSE](LICENSE)).
