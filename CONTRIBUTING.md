# Contributing

DelftStudy is a personal academic and portfolio project. Contributions and review suggestions are welcome when they preserve the documented product boundaries.

Before opening a pull request:

1. Install with `pnpm install --frozen-lockfile`.
2. Run `pnpm typecheck`, `pnpm test` and `pnpm build`.
3. Describe user-visible changes, validation performed and any known limitation.
4. Keep content-pack and generated projections consistent with their validation scripts.

Use small, focused commits. From now on, prefer Conventional Commit prefixes: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:` and `ci:`. Existing history is retained as authored.

Do not commit environment files, credentials, learner personal data or production configuration. Supabase migrations, authentication and deployment changes require explicit scope and review.
