import {useState} from 'react';
import {Link} from 'react-router';
import {useI18n} from '../i18n/i18n';
import {useAnalyticsConsent} from './consent';
import './consent.css';

export function AnalyticsConsentBanner(){
  const {decision,allow,deny}=useAnalyticsConsent(),{t}=useI18n(),[busy,setBusy]=useState(false);
  if(decision!==null)return null;
  async function choose(action:()=>Promise<boolean>){if(busy)return;setBusy(true);try{await action();}finally{setBusy(false);}}
  return <aside className="ds-analytics-consent" aria-labelledby="analytics-consent-title">
    <div><h2 id="analytics-consent-title">{t('analyticsConsent.title')}</h2><p>{t('analyticsConsent.body')}</p><Link to="/privacy">{t('analyticsConsent.learnMore')}</Link></div>
    <div className="ds-analytics-consent-actions"><button className="ds-button" disabled={busy} onClick={()=>void choose(allow)}>{t('analyticsConsent.allow')}</button><button className="ds-button" disabled={busy} onClick={()=>void choose(deny)}>{t('analyticsConsent.decline')}</button></div>
  </aside>;
}
