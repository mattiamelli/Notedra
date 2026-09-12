# Maintenance Patch 8 validation

## Scope and starting state

- Branch: `maintenance/product-polish-personalization`
- Starting commit: `21a8072a13fe46e9388d5bf72426592861edd9db`
- Initial status: clean
- Scope: presentation, personalization, appearance, exam date interaction, and focused regression coverage only
- Exercise content, graders, Assembly semantics, Study Path logic, mastery/readiness formulas, migrations, RLS, CAS/PT409, Auth configuration, hosting, and SEO were not changed.

## Product decisions

- `System` is the default appearance. It follows `prefers-color-scheme`, updates while the app is open, and stores the preference locally for both anonymous and authenticated sessions. No learner or cloud schema was extended.
- The persisted theme is applied before React renders to reduce theme flash without adding an inline script or weakening CSP.
- The date picker uses accessible day, month, and year selects. Mobile browsers retain their native select interaction, including platform wheel controls where supplied by the device.
- Exam dates remain canonical date-only `YYYY-MM-DD` values. The UI displays `DD/MM/YYYY`; no timestamps or UTC conversions were introduced.
- Passwords remain handled by Supabase Auth and appear only as a fixed masked value for an authenticated user. The accepted product has no existing change/reset-password flow, so this patch does not invent one.
- Date of birth was not added because the accepted account model has no product need or canonical DOB field.
- The unused global Tailwind CSS import was replaced by its single used local font-weight rule. This keeps the unchanged CSS ceiling intact and adds no dependency.

## Automated evidence

- Focused personalization/date/account/auth tests: PASS.
- Full Vitest: 105 files, 2,387 tests PASS.
- TypeScript: PASS.
- Production build: PASS, 355 modules transformed.
- Production bundle: PASS.
  - Initial JS: 514,991 bytes.
  - Initial JS gzip: 136,562 bytes.
  - CSS: 87,536 bytes (limit 95,000).
  - Total assets: 2,249,780 bytes (limit 2,300,000).
  - Visual dependencies added: 0.
- Hardening static validation: PASS, 642 repository files and 148 runtime files checked.
- Final source/emitted-asset security: PASS, 228 emitted files checked; secret and artifact scan PASS.
- Auth boundary: PASS. Sync payload/schema boundary: PASS. Supabase policies: static PASS; remote enforcement was not rerun because Patch 8 changes no remote schema or policy.
- Academic/content validation: PASS; 90 documents, 43 topics, 147 skills, and 489 canonical questions remain intact.
- Java: PASS; 125 compiled fixtures, 11 trusted assignment references, 144 assertions.
- Assembly: PASS through 130 focused parser, maintenance, editor, and preservation tests plus Chromium workspace rendering.
- Patch 6: PASS; all 7 authored interactions at 1280 px and 375 px, including keyboard flow, validation, retry, reload, and 44 px controls.
- Patch 7: PASS through the full content/exercise suite; the 212 accepted exercises and their authored semantics were not modified.
- Study Path: PASS through focused session/adaptive tests, routing tests, and Chromium rendering.
- Upcoming Exams: PASS at 1280 px and 375 px for add, edit, delete, reload, keyboard focus, date-only persistence, and no overflow.

## Rendered acceptance

The final production preview was checked in Chromium across the Dashboard, Account, Upcoming Exams, Practice, Study Path, Progress, logical builder, Karnaugh map, and Assembly Visualizer.

- Light desktop, 1280 px: PASS.
- Dark desktop, 1280 px: PASS.
- Light mobile, 375 px: PASS.
- Dark mobile, 375 px: PASS.
- System, 768 px: PASS; resolved dark then light after an emulated OS preference change without reload.
- Horizontal overflow: none on the checked pages.
- Page/console errors: none.

Manual review confirmed stronger page/card separation, a restrained primary-action hierarchy, readable semantic states, clear focus treatment, usable mobile controls, and an intentionally dark Assembly workspace. The account page is necessarily long on a 375 px viewport because it preserves Sync & Backup and Data & Privacy, but it remains single-column, readable, and free of page-wide overflow.

## Preservation changes

Exact before/after hashes were added or updated only for the authorized UI, account, theme, auth-message, test, and global-CSS files changed by Patch 8. The existing preservation validator and all earlier accepted entries remain active; no directory or wildcard exemption was introduced.
