# Notedra product analytics contract

## NOW

Events are typed, validated against an allowlist and captured only by a volatile in-memory development/test sink. Production has no sink: no network requests, cookies, persistent analytics identity or provider integration. Events describe product interactions, never academic responses.

| Event | Trigger | Required properties | Optional | Metric | Privacy note |
| --- | --- | --- | --- | --- | --- |
| `product_tour_started` | Automatic or Settings launch succeeds | `source_surface` | None | Tour funnel | No identity or step copy |
| `product_tour_completed` | Finish | `source_surface` | None | Tour completion | No navigation history |
| `product_tour_skipped` | Skip or Escape | `source_surface` | None | Tour completion | No reason/free text |
| `first_practice_started` | First saved practice draft | course/topic IDs, activity, surface | None | Activation funnel | Derived from existing local attempts |
| `first_practice_completed` | First successfully saved submission | course/topic IDs, activity, status, surface | None | Activation, time to value | No answer or score |
| `practice_started` | Practice draft is successfully saved | course/topic IDs, activity, surface | None | Practice completion | No answer or exercise prompt |
| `practice_completed` | Submission is successfully saved | course/topic IDs, activity, status, surface | None | Practice completion | No answer, feedback or score |
| `study_method_recommended` | A meaningful method recommendation is rendered | `method_id`, `reason_code`, `duration_bucket`, `course_id`, `source_surface` | None | Recommendation impressions | Enum values only; no prose or identity |
| `study_method_selected` | A Study Path method is selected | `method_id`, `source_surface` | `selection_source`, `recommended_method_id` | Method adoption and override rate | Enumerated values only |
| `study_path_generated` | A valid Study Path is built | `course_id`, `activity_type`, `duration_bucket`, `source_surface`, `method_id` | `topic_id` | Study Path adoption | No generated content or evidence details |
| `study_path_activity_opened` | User opens a generated item | course/topic IDs, activity, surface | None | Path follow-through | Canonical IDs only |
| `exam_started` | Exam session is successfully saved | course ID, exam type, duration bucket, surface | None | Exam use | No seed, item or response |
| `exam_completed` | Exam submission is successfully saved | course ID, exam type, duration bucket, status, surface | None | Exam completion | No answers or grades |
| `next_action_shown` | Stable ready recommendation is rendered | activity, surface | None | Recommendation CTR | No reason, title or learner evidence |
| `next_action_opened` | CTA is selected | activity, surface | None | Recommendation CTR | No destination history |
| `course_opened` | Canonical course page opens | course ID, activity, surface | None | Content discovery | No user identity |
| `topic_opened` | Canonical topic page opens | course/topic IDs, activity, surface | None | Content discovery | No reading telemetry |

## Derived metrics

- **Activation:** distinct eligible local analytics sessions with `first_practice_completed` / distinct new usable local analytics sessions. A future session-start contract is required before reporting this externally.
- **Time to value:** timestamp of `first_practice_completed` minus first usable-session timestamp. The usable-session event is not yet implemented, so this is a future metric.
- **Study Path adoption:** distinct eligible sessions with `study_path_generated` / distinct eligible sessions.
- **Recommendation CTR:** `next_action_opened` / `next_action_shown`, deduplicated by the same session and impression contract.
- **Practice completion:** `practice_completed` / `practice_started` for the same analysis window.
- **Return measurement:** future D1 means a qualifying study event on calendar day 1 after first usable session; D7 means one on calendar day 7. Do not call either metric retention until consented durable identity and persistence make the denominator and return observable.

## FUTURE

- Explicit consent controls and a documented lawful basis before enabling any provider.
- A first-party, rotating analytics session ID separate from account and learner records.
- Clear deletion/export behavior, retention period, environment controls and provider approval.
- First usable-session event needed for activation denominators, time to value and D1/D7 return measurement.

## DO NOT TRACK

Answer text, submitted code, uploaded document content, email, name, account/access tokens, manually collected IP addresses, free-form prompts, health or sensitive data, grades, feedback text, recommendation reasons, exact navigation history and browser/device fingerprints.
