# Anonymous retention analytics: owner decision required

## Deployment gate

The implementation stores a random PostHog anonymous identifier in browser `localStorage` so the same browser can be measured across visits. It does not use cookies, call `identify`, create person profiles or connect the identifier to an account. This is still terminal-device storage for analytics, so it changes the published privacy representation and requires an owner-approved legal/consent route before deployment.

Choose and document one route:

1. **Consent-first (conservative recommendation):** do not initialize PostHog until the learner positively opts in; provide equally clear reject and later withdrawal controls; on withdrawal stop analytics and remove the PostHog localStorage identifier.
2. **Documented statistical-purpose exception:** use this only after jurisdiction-specific review confirms it applies to Notedra and implement the required clear information and simple objection mechanism. The implementation must not assume this route silently.

Official guidance treats local storage and similar technologies as storage/access technologies, not only cookies. The EDPB states that terminal-device storage/access generally requires informed consent, while the ICO documents both consent requirements and a limited statistical-purpose exception with conditions:

- https://www.edpb.europa.eu/sme/find-practical-info/faq_en
- https://www.edpb.europa.eu/system/files/2023-11/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_en.pdf
- https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-storage-and-access-technologies/
- https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/how-do-we-manage-consent-in-practice/
- https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/

This document records an engineering deployment gate, not legal advice.

## Exact Privacy Policy replacement after consent controls exist

Replace the current **Cookies and analytics** paragraph and update the effective date:

> Notedra uses PostHog in the European Union for limited product analytics only when you enable analytics. The browser then stores a random, pseudonymous PostHog identifier in localStorage so Notedra can recognize the same browser across visits and measure anonymous 7-day and 30-day activity, D1/D3/D7 retention, and feature adoption. The identifier is not derived from an account or Supabase ID and is not used to identify a person. Notedra does not send study answers, submitted code, free text, email addresses, display names, account or Supabase IDs, grades, detailed feedback, uploaded content, tokens, or full URLs. GeoIP processing, person profiles, identification, automatic page views, automatic interaction capture, session replay, performance capture, and analytics cookies are disabled. You can refuse or withdraw analytics without losing access to Notedra; withdrawing stops future analytics and removes the analytics identifier from this browser. The hosting and authentication providers may use strictly necessary security or session cookies to deliver the site, limit automated abuse, and keep you signed in. Browser storage is also used for the functional purposes described above. Contact Notedra below with privacy questions.

If the owner instead approves a documented statistical-purpose exception, legal review must supply replacement wording and the objection mechanism before release. Do not reuse the consent wording while no consent control exists.
