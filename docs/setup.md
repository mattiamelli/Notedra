# Local setup

Use Node.js 22.13 or newer and pnpm 10. Clone with full history because the hardening checks compare selected files with a pinned historical baseline.

```bash
git clone https://github.com/mattiamelli/DelftStudy.git
cd DelftStudy
pnpm install --frozen-lockfile
pnpm dev
```

The local-only experience needs no environment variables. To enable optional account and cloud sync, copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. These values are exposed to browser code; never use a service-role key, database password or other administrative credential.

Run the validation gates with `pnpm typecheck`, `pnpm test` and `pnpm build`. Java verification scripts additionally accept `DELFTSTUDY_JAVA_HOME` or `JAVA_HOME` when a local JDK is installed.
