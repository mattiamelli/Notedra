import { StudentDataPanel } from '../learning/StudentDataPanel';
import { Link } from 'react-router';
import { courses, type ProductArea } from '../academic/navigation';
import { EmptyState, PageHeading } from '../shell/PageParts';
import {useI18n} from '../i18n/i18n';
export function ProductAreaPage({area}: {area: ProductArea}) {
  const {t,lt}=useI18n();
  return <>
    <PageHeading eyebrow={t('common.study').toUpperCase()} title={lt(area.title)}><p>{lt(area.purpose)}</p></PageHeading>
    <EmptyState icon={area.icon} title={lt(area.emptyTitle)}><p>{lt(area.message)}</p><Link to="/dashboard" className="ds-button">{t('common.returnDashboard')}</Link></EmptyState>
    {area.path === '/progress' && <StudentDataPanel/>}
    <section className="ds-section" aria-labelledby="explore-title"><div className="ds-section-heading"><h2 id="explore-title">{t('common.exploreCourses')}</h2></div><div className="ds-course-links">{courses.map(course => <Link key={course.subject_id} to={course.path}><span>{course.compactName}</span>{course.publicName}</Link>)}</div></section>
  </>;
}
