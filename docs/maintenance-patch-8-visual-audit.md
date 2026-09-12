# Maintenance Patch 8 visual audit

Baseline: accepted Patch 7 commit `21a8072a13fe46e9388d5bf72426592861edd9db`.

The audit used a clean production build at 1280 px and 375 px. It covered the Dashboard, Upcoming Exams, Account, Practice, Study Path, Progress, and a representative interactive exercise.

## Findings before implementation

- Page and card surfaces are too close in value, which weakens grouping on the Dashboard and long study pages.
- Dashboard actions use nearly identical visual weight. The next study action and the add-exam action need a clear primary treatment.
- The Upcoming Exams form relies on the browser's generic date input and has no stable day/month/year interaction across desktop and mobile.
- Exam edit and delete controls compete with the countdown and have no quiet/destructive hierarchy.
- Account content is presented as one continuous section. Profile, appearance, security, sync, and data controls need distinct groups.
- Avatar initials use only the first code unit of the display name. Multi-word names and Unicode names are inconsistent across surfaces.
- The product has no explicit Light, Dark, or System appearance preference and no live response to an operating-system theme change.
- Existing interactive workspaces are functionally sound. Their controls need token-driven contrast in both product themes; the Assembly workbench must retain its accepted dark workspace.

## Root causes and bounded changes

- Add semantic dark tokens and keep existing course identities, layout, and dark Assembly workspace.
- Add one centralized appearance controller with local persistence and live `prefers-color-scheme` observation.
- Add one centralized initials helper and use it in the header, sidebar, and Account profile.
- Replace only the Dashboard exam date control with an accessible three-part picker that still writes the canonical `YYYY-MM-DD` contract.
- Recompose Account using the existing Auth and student-data operations. No learner schema, cloud contract, or Auth configuration changes are required.

