# Anonymous retention analytics: consent-first decision implemented

## Owner decision

The owner selected the conservative consent-first route. PostHog is not initialized and no PostHog identifier is stored until a learner chooses **Allow analytics**. Refusal is equally available, does not reduce product functionality, and withdrawal is available in Account & Settings.

Consent is stored as one separate `granted` or `denied` preference. Withdrawal disables the analytics sink and clears only PostHog's dedicated local/session storage namespace, including the legacy pre-consent namespace. It does not clear Notedra study data, account data, language, appearance, Assembly preferences or other product storage.

Official guidance treats local storage and similar technologies as storage/access technologies, not only cookies. The EDPB states that terminal-device storage/access generally requires informed consent, while the ICO documents both consent requirements and a limited statistical-purpose exception with conditions:

- https://www.edpb.europa.eu/sme/find-practical-info/faq_en
- https://www.edpb.europa.eu/system/files/2023-11/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_en.pdf
- https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-storage-and-access-technologies/
- https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/how-do-we-manage-consent-in-practice/
- https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/

This document records the engineering decision and implementation, not a broad legal-compliance claim or legal advice.

## Privacy Policy wording

The application Privacy Policy now states:

> Anonymous product analytics are optional. If you choose “Allow analytics”, Notedra uses PostHog in the European Union and stores a random, pseudonymous identifier in localStorage so the same browser can be recognized across visits. This helps measure feature use and anonymous return activity, including 7-day and 30-day activity and D1/D3/D7 retention. The identifier is not derived from an account or Supabase ID and is not used for advertising tracking. Notedra does not send study answers, submitted code, free text, email addresses, display names, account or Supabase IDs, grades, detailed feedback, uploaded content, tokens, or full URLs. GeoIP processing, person profiles, identification, automatic page views, automatic interaction capture, session replay, performance capture, console capture, heatmaps, and analytics cookies are disabled. You can refuse analytics or withdraw consent at any time in Account & Settings without losing functionality. Withdrawal stops future analytics and removes only the PostHog analytics identifier from this browser. The hosting and authentication providers may use strictly necessary security or session cookies to deliver the site, limit automated abuse, and keep you signed in. Browser storage is also used for the functional purposes described above.
