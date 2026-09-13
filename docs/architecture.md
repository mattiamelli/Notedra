# Architecture

DelftStudy is a client-side React application. Routes and the application shell live in `src/App.tsx` and `src/shell/`; course modules are grouped by subject under `src/co`, `src/rl`, `src/ip` and related feature folders.

The versioned content pack under `content-pack/` is validated before projections are generated into `src/generated/`. Practice, exam, progress and adaptive-learning features build on the local learner repository in `src/learning/`, which uses versioned IndexedDB records and transactional backups.

The Assembly workbench (`src/AssemblyWorkbench.tsx` and `src/engine/`) uses a bounded deterministic x86-64 teaching model. It is intentionally separate from the course content and does not execute arbitrary code.

Account and cloud-sync code under `src/accounts/` and `src/cloud/` is optional. Local learning remains available when Supabase is unconfigured or unavailable. Database migrations in `supabase/` define the server-side sync boundary; they are not applied by the frontend build.

Build and preservation checks are implemented in `scripts/` and wired into Vite and the package scripts. The GitHub Actions workflow runs the same typecheck, test and build gates on pushes and pull requests.
