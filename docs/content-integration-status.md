# Content Pack v1.0.1 integration — Step 1

## Baseline

- Baseline commit: `c27e4cd`. Working tree was clean.
- 101 existing tests passed (4 files); strict TypeScript check passed; production build passed.
- Existing React/TypeScript/Vite/Tailwind/Vitest setup retained. No Assembly source changes are planned.
- No previous content pack was present in the repository.

## Completed checkpoint

1. Baseline inspected and verified.
2. All nine supplied v1.0.1 files extracted byte-for-byte to `content-pack/v1.0.1/`. Eight manifest checksums verified; the manifest intentionally omits its self-hash.
3. Development validator and 38 content integrity tests completed. The original 101 tests plus all 38 new tests pass (139 total), and strict TypeScript checking passes. The release files remain untouched. Ajv and tsx are development-only dependencies.

## Resume point

Next: gate production builds, document the academic source of truth, and complete final verification. Do not start product features or Step 2.

## Baseline production SHA-256

```json
{
  "dist/index.html": "a2088660f1846171161c89fe9a9f7b7fd42b475c0b5158e497d88f52ff1ce41b",
  "dist/favicon.svg": "23f7bf50a23828a272bf229eb2bbc429f650cad177f859fe79785770dbb35ac7",
  "dist/assets/index-B87OYk1C.css": "f16479e15fb4bc803b145e8ff541cba0233ece31e819f1d8a53c9e83f53fc6b3",
  "dist/assets/index-CJ4dIR_W.js": "6800ba3a7dafb0b2fdd49fd3cfbc431855ff01057c76a665c2df7f48406e944e"
}
```
