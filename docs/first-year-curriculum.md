# First-year curriculum architecture

## Scope and source authority

The eight additional course packs live in `src/curriculum`. They supplement the
original three-course content pack; they do not replace its identities or evidence.
The four trimester groups follow the owner's supplied course list. No CSE14C course
is inferred. Notedra is independent study support, not an official curriculum or
assessment service.

`curriculum-source-inventory.json` records relative filenames, byte counts and SHA-256
digests for all 400 supplied files. Inventory proves file identity, not semantic
review. Course-specific audit notes distinguish extracted text, visually inspected
pages, inherited material and unavailable sources. Each course exposes its coverage
limitations. Original authored lessons and exercises cite source sections; source
PDFs, textbooks and private filesystem paths are not shipped to the browser.

## Adding and validating content

- `types.ts` defines the shared course, topic, skill, source and exercise schema.
- `registry.ts` registers the eight authored JSON packs.
- `generate:curriculum` validates identities, ownership, references, prerequisites,
  response formats and required content, then writes slim navigation metadata and
  exercise bindings.
- `validate:curriculum` checks the same inputs without rewriting output. Direct Vite
  production builds also require this check, so stale metadata/bindings fail closed.
- `study.ts` adapts lessons, containment relationships and unscored recall prompts to
  the existing Learn, Mental Map and Flashcards surfaces.

Each new topic has a stable `_CORE` subtopic for its skill group. Topic prerequisites
are explicitly authored. Missing skill-level prerequisites are not inferred as
successful learning. The original academic projections retain their original counts,
bytes, identifiers and validators; additive references are merged at the runtime
boundary in `learning/references.ts`.

## Student evidence and compatibility

The student schema, IndexedDB schema and original content fingerprint are unchanged.
No migration rewrites existing attempts. Every new attempt uses the same repository
and submission lifecycle as existing practice, with a binding over its exercise,
course/topic ownership, source records and grader/adapter implementation. Changed or
unavailable bindings preserve the saved response but do not silently regrade it.

Choice grading accepts one declared option; integer grading accepts bounded decimal
integers without floating-point coercion or evaluating expressions. Open responses
are stored with feedback and a self-review rubric, never objective points. Valid
submitted open work may count as activity completion, but not as mastery evidence.
Only exact objective evidence feeds mastery and the Mistake Book. UNKNOWN remains
unknown, not an incorrect answer or a zero score.

The new course revision surfaces reuse authored problems and open reasoning. They
are explicitly not official or calibrated mock exams. The original three mock banks
remain unchanged. New-course normal practice does not become exam evidence, and
readiness remains unknown in the absence of eligible exam evidence.

## Service boundaries

The expansion does not change Supabase configuration, Auth, database schema, RLS,
PostHog configuration or event taxonomy. Existing bounded data validation and
optional sync remain the storage boundary. Older application versions may reject
new identifiers rather than reinterpret them; exporting a backup before returning
to an older frontend is therefore important.

## Release checks

Run source/content validation, curriculum integration tests, the full suite,
typecheck, production build, preservation/security checks, dependency audit and
whitespace checks. Inspect representative course, Learn, practice and revision views
for every new course, plus desktop/mobile trimester navigation. Publication requires
a normal push, successful CI and a matching Sites source/artifact provenance record.
