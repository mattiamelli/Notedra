import { Link } from 'react-router';
import { PageHeading } from '../shell/PageParts';
export function NotFoundPage() {
  return <div className="ds-not-found"><PageHeading eyebrow="404" title="Page not found"><p>This page isn’t part of Notedra. Return to your dashboard to choose a course.</p></PageHeading><Link to="/" className="ds-button ds-button-primary">Back to Dashboard</Link></div>;
}
