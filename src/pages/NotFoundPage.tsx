import { Link } from 'react-router';
import { PageHeading } from '../shell/PageParts';
import {useI18n} from '../i18n/i18n';
export function NotFoundPage() {
  const {t}=useI18n();
  return <div className="ds-not-found"><PageHeading eyebrow="404" title={t('common.pageNotFound')}><p>{t('common.notFoundBody')}</p></PageHeading><Link to="/" className="ds-button ds-button-primary">{t('common.backDashboard')}</Link></div>;
}
