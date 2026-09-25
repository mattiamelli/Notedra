# First-year expansion: local validation

Verified on 2026-09-25. This record describes local checks, not a claim of
production deployment or live security acceptance. GitHub CI and Sites publication
must be verified independently for the final commit.

## Content and compatibility

- Eight added courses: 105 topics, 236 skills, 820 original authored exercises.
- All eleven courses: 148 topics, 383 skills, 1,501 registered practice exercises.
- All 681 existing exercise bindings retained; original content identities and
  student schema 3 / IndexedDB schema 4 remain unchanged.
- All 400 supplied files inventoried by relative filename, byte size and SHA-256.
  Individual source-audit documents distinguish text review, visual samples and gaps.
- Independent reviews of all eight authored exercise banks completed. Clarified
  assumptions in normalization, linear algebra, statistics, graph algorithms,
  software engineering, HCI and networks before final validation.
- Missing current GenAI-prototyping materials and merged-course assessment rules
  remain explicitly disclosed. No invented official mock exams or CSE14C.

## Executed checks

- Content and generated curriculum bindings: PASS.
- Full serial suite: 130 files, 3,889 tests, zero failures.
- Typecheck and production frontend build: PASS.
- Hardening and final source/emitted-artifact secret scans: PASS.
- Dependency audit: zero reported vulnerabilities in the full graph.
- Whitespace/diff check: PASS.
- Isolated browser: every added course, Learn, revision, correct objective
  submission, persisted ungraded open response, Study Path and mobile overflow: PASS.
- All four dashboard trimesters visually inspected. Mobile course pages inspected
  for all eight courses. Existing CO/RL/IP, Assembly and practice search smoke: PASS.
- Supabase, Auth, RLS, database, analytics taxonomy and hosting policy unchanged.
  Existing production build variables reused without logging their values.

## Bundle accounting

Production-configured initial JavaScript: 470,852 bytes / 135,360 bytes gzip.
This remains under the existing 520,000 / 140,000 initial limits. The verified v24
Worker's entry was 440,461 / 125,853 bytes. The additional navigation/reference
metadata explains the initial increase; no new runtime dependency was introduced.

All eight authored course JSONs share one non-initial registry chunk:
760,695 bytes / 217,242 bytes gzip. Existing course, account/sync, exam, progress
and PostHog lazy-loading checks pass. Full emitted non-HTML bundle-collector assets
are 4,319,944 bytes; the growth is intentional authored content, not source PDFs.

The historical aggregate CSS and Patch-7 total-asset ceilings are not claimed as
passing: CSS was already 134,807 bytes in the verified v24 Worker versus the old
95,000-byte ceiling; current CSS is 137,626 bytes (+2,819). The old 2.3 MB total
budget predates later content releases and this eight-course expansion. Those
historical thresholds have not been weakened or relabelled as green. The current
bundle reports record actual output; `visual-bundle-report.json` is historical.

## Verification limits

Automated checks do not prove pedagogical effectiveness, current official syllabus
completeness, live RLS isolation or multi-device sync acceptance. Open answers are
self-reviewed, never objectively scored. New-course exam readiness remains unknown
without eligible assessment evidence. Existing browser-test warning messages about
React `act` and the PostHog sourcemap did not produce failed tests.
