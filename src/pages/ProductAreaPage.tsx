import { Link } from 'react-router';
import { courses, type ProductArea } from '../academic/navigation';
import { EmptyState, PageHeading } from '../shell/PageParts';
export function ProductAreaPage({area}: {area: ProductArea}) {
  return <>
    <PageHeading eyebrow="STUDY" title={area.title}><p>{area.purpose}</p></PageHeading>
    <EmptyState icon={area.icon} title={area.emptyTitle}><p>{area.message}</p><Link to="/" className="ds-button">Return to Dashboard</Link></EmptyState>
    <section className="ds-section" aria-labelledby="explore-title"><div className="ds-section-heading"><h2 id="explore-title">Explore your courses</h2></div><div className="ds-course-links">{courses.map(course => <Link key={course.subject_id} to={course.path}><span>{course.code}</span>{course.name}</Link>)}</div></section>
  </>;
}
