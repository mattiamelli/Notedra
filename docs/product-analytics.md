# Notedra product analytics contract

## NOW

Events are typed and validated against an explicit allowlist. Development and tests use the volatile in-memory sink. Production uses the lazy PostHog sink only when both `VITE_POSTHOG_KEY` and the approved EU host `VITE_POSTHOG_HOST=https://eu.i.posthog.com` are configured; otherwise analytics is a safe no-op. Events describe product interactions, never academic responses.

The PostHog boundary disables autocapture, automatic pageviews/page-leave, session replay, surveys, flags, heatmaps, performance and exception capture, person profiles and device-model enrichment. It never calls `identify`. A final `before_send` filter rejects unknown events and removes unapproved properties, including full URLs and browser/device metadata. The SDK stores its random anonymous `distinct_id` in `localStorage`, without analytics cookies, so the same browser can be recognized across visits. Notedra does not derive this identifier from or correlate it with an account or learner record. Clearing site storage, changing browser/profile or changing device creates a new anonymous analytics identity.

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
| `mistake_book_opened` | Mistake Book or a topic-scoped Mistake Book opens | surface | course/topic IDs | Mistake Book adoption | Canonical IDs only |
| `review_started` | A retry draft is successfully created from Mistake Book | course/topic IDs, activity, surface | None | Review follow-through | No answer, score or mistake details |
| `exam_started` | Exam session is successfully saved | course ID, exam type, duration bucket, surface | None | Exam use | No seed, item or response |
| `exam_completed` | Exam submission is successfully saved | course ID, exam type, duration bucket, status, surface | None | Exam completion | No answers or grades |
| `next_action_shown` | Stable ready recommendation is rendered | activity, surface | None | Recommendation CTR | No reason, title or learner evidence |
| `next_action_opened` | CTA is selected | activity, surface | None | Recommendation CTR | No destination history |
| `course_opened` | Canonical course page opens | course ID, activity, surface | None | Content discovery | No user identity |
| `topic_opened` | Canonical topic page opens | course/topic IDs, activity, surface | None | Content discovery | No reading telemetry |

## Derived metrics

- **7/30-day activity:** unique anonymous `distinct_id` values with at least one allowlisted activity event in the selected window.
- **D1/D3/D7 retention:** unique anonymous browsers with a qualifying event on day 1, 3 or 7 after their first qualifying event. Qualifying events are practice, course/topic, Study Path, Mistake Book/review, exam and opened next-action events; impressions alone are excluded.
- **Study Path adoption:** unique anonymous browsers with `study_path_generated`, with follow-through measured by `study_path_activity_opened`.
- **Mistake Book adoption:** unique anonymous browsers with `mistake_book_opened`, with follow-through measured by `review_started`.
- **Recommendation CTR:** `next_action_opened` / `next_action_shown` within the same analysis window.
- **Practice completion:** `practice_completed` / `practice_started` for the same analysis window.
- **Most-used content:** event counts and unique anonymous browsers grouped only by canonical `course_id` and `topic_id`.

These are browser-level product metrics, not people or account metrics. They do not connect activity across devices and undercount users who clear storage.

## FUTURE

- Owner-approved consent or documented jurisdiction-specific exception, plus matching refusal/withdrawal controls, before deployment.
- Clear provider retention period, environment controls and provider approval.
- A first usable-session event if a separate activation denominator or time-to-value metric is later required.

## DO NOT TRACK

Answer text, submitted code, uploaded document content, email, name, account IDs, Supabase IDs, account/access tokens, manually collected IP addresses, free-form prompts, health or sensitive data, grades, feedback text, recommendation prose, exact navigation history, full URLs and browser/device fingerprints.

## Final SDK privacy boundary

The pinned 1.434.0 integration loads the official `dist/module.slim.no-external` entrypoint. Optional replay, console-log, metrics and feature-flag extensions are absent, external dependency loading is disabled, and explicit SDK options disable each optional product. Configuration is checked against the installed SDK types; the unsupported `disable_device_id_rotation` option is not used.

`before_send` retains the event UUID/timestamp, project ingestion token and random persistent `distinct_id`, plus approved event properties. It strips top-level person updates and other enrichment, forces `$process_person_profile: false`, and sets `$geoip_disable: true`. No device or session identifiers are transmitted separately. The `ip` option is deprecated and ineffective in this SDK and is deliberately not used. Network connections necessarily expose an IP to the receiving infrastructure; the owner's reported IP-anonymization setting governs server-side storage and has not been independently verified here.

Targeted tests run the actual SDK up to an intercepted transport dispatch, verify allowed capture and automatic-event rejection, and create independent instances to prove the same random anonymous ID survives a reload through `localStorage` without setting a cookie. They do not verify live ingestion.
