import {Link} from 'react-router';
import {PUBLIC_LEGAL_CONTACT} from '../legal/contact';

type LegalKind='privacy'|'terms';

const effectiveDate='12 September 2026';

export function LegalPage({kind}:{kind:LegalKind}) {
  if(kind==='privacy')return <article className="ds-legal">
    <header className="ds-page-heading"><p className="ds-eyebrow">LEGAL</p><h1>Privacy Policy</h1><p>Effective {effectiveDate}. This page explains what Notedra stores and why.</p></header>
    <section><h2>Information Notedra handles</h2><p>You need an account to enter the study app during the public beta. Supabase Auth handles your email address and login session, and Notedra stores your display name and synchronized learner snapshot under your account ID. Browser storage may still hold local preferences and saved work for the active profile.</p></section>
    <section><h2>Study records</h2><p>Your records can include exercise attempts, mistake reviews, mock-exam sessions and reviews, and upcoming exams. They are used to restore your progress and generate the study views you request. Course content and derived readiness or mastery summaries are not advertising profiles.</p></section>
    <section><h2>Local storage, cloud sync, and backups</h2><p>Notedra uses browser storage for account separation, appearance preferences and saved work. Signed-in learners can synchronize supported records with Supabase. You can export a JSON backup from Account &amp; Settings. Importing a backup replaces the current local profile after an explicit confirmation and keeps a local recovery copy.</p></section>
    <section><h2>Cookies and analytics</h2><p>Notedra does not add analytics, advertising, or marketing trackers. The hosting and authentication providers may use strictly necessary security or session cookies to deliver the site, limit automated abuse, and keep you signed in. Browser storage is also used for the functional purposes described above.</p></section>
    <section><h2>Sharing and retention</h2><p>Notedra does not sell learner data. Supabase processes account and synchronized data, and the hosting provider processes technical request data needed to deliver and protect the service. Local records remain until you clear them or your browser data. Cloud account and learner records remain until they are deleted under the service’s operational process; no shorter retention period is promised here.</p></section>
    <section><h2>Your choices</h2><p>You can sign out, export your records, clear browser data, and choose whether to keep using an account. You may request access, correction, export, or deletion of account data through the contact method below. Identity verification may be required before an account request is completed.</p></section>
    <section><h2>Contact</h2><p>For privacy and account-data requests, email <a href={`mailto:${PUBLIC_LEGAL_CONTACT}`}>{PUBLIC_LEGAL_CONTACT}</a>.</p></section>
    <p className="ds-legal-back"><Link to="/">Return to Notedra</Link></p>
  </article>;
  return <article className="ds-legal">
    <header className="ds-page-heading"><p className="ds-eyebrow">LEGAL</p><h1>Terms of Use</h1><p>Effective {effectiveDate}. Please use Notedra responsibly.</p></header>
    <section><h2>Independent study support</h2><p>Notedra is an independent educational platform and is not an official service of any university. Subject names identify the material being studied and do not imply endorsement.</p></section>
    <section><h2>No result guarantee</h2><p>Explanations, practice, readiness indicators, and study plans support learning. They do not guarantee correctness, admission, credit, grades, or exam results. You remain responsible for checking official course information and doing your own work.</p></section>
    <section><h2>Accounts and acceptable use</h2><p>Provide accurate account information, keep access credentials secure, and use only accounts you are authorized to use. Do not attempt to disrupt the service, automate abusive account creation, bypass access controls, access another learner’s records, or upload malicious or unlawful material.</p></section>
    <section><h2>Content and intellectual property</h2><p>Notedra respects the ownership of course sources and other referenced material. Access to the platform does not transfer rights in Notedra, source material, university marks, or third-party content. Use study material within the permissions that apply to it.</p></section>
    <section><h2>Availability and changes</h2><p>The service may be unavailable, changed, or discontinued. Saved local data can be lost if browser storage is cleared or a device fails, so export a backup when the records matter to you. Terms may be updated when the product or its operation changes.</p></section>
    <section><h2>Contact</h2><p>For questions about these terms, email <a href={`mailto:${PUBLIC_LEGAL_CONTACT}`}>{PUBLIC_LEGAL_CONTACT}</a>.</p></section>
    <p className="ds-legal-back"><Link to="/">Return to Notedra</Link></p>
  </article>;
}
