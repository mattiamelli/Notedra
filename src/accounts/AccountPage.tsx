import {useEffect,useRef,useState,type FormEvent} from 'react';
import {useTheme,type ThemePreference} from '../appearance/theme';
import {StudentDataPanel} from '../learning/StudentDataPanel';
import {useAccount} from './context';
import {profileInitials} from './profile';
import './accounts.css';
import {languageOptions,useI18n} from '../i18n/i18n';
import type {MessageKey} from '../i18n/messages';
import {useAnalyticsConsent} from '../analytics/consent';

const syncStatusKeys:Record<string,MessageKey>={
  'Local only':'account.localOnly','Pending':'account.syncPending','Offline':'account.syncOffline','Syncing':'account.syncing','Synced':'account.synced','Sync error':'account.syncError','Conflict requires attention':'account.syncConflict',
};

export function AccountPage() {
  const account=useAccount(),theme=useTheme(),{language,setLanguage,t}=useI18n(),analytics=useAnalyticsConsent();
  const syncStatusKey=syncStatusKeys[account.syncStatus],syncStatusLabel=syncStatusKey?t(syncStatusKey):account.syncStatus;
  const themes: {value: ThemePreference; label: string; description: string}[] = [
    {value:'light',label:t('theme.light'),description:t('theme.lightDescription')},
    {value:'dark',label:t('theme.dark'),description:t('theme.darkDescription')},
    {value:'system',label:t('theme.system'),description:t('theme.systemDescription')},
  ];
  const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[displayName,setDisplayName]=useState(''),[editingName,setEditingName]=useState(false),[profileDraft,setProfileDraft]=useState(''),[creating,setCreating]=useState(false),[busy,setBusy]=useState(false),[analyticsBusy,setAnalyticsBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[consent,setConsent]=useState(false),[restoreConsent,setRestoreConsent]=useState(false);
  const feedback=useRef<HTMLParagraphElement>(null),user=account.state.user;
  useEffect(()=>{if(error)feedback.current?.focus();},[error]);
  useEffect(()=>{setProfileDraft(user?.displayName?.trim()??'');setEditingName(false);},[user?.id,user?.displayName]);
  async function action(work:()=>Promise<unknown>) {if(busy)return;setBusy(true);setError('');setNotice('');try{await work();}catch(e){setError(e instanceof Error?e.message:t('account.actionFailed'));}finally{setBusy(false);setPassword('');}}
  function submit(event:FormEvent){event.preventDefault();if(!account.auth)return;void action(async()=>{
    if(creating){if(!displayName.trim())throw Error(t('account.enterName'));const result=await account.auth!.signUp(email,password,displayName);setNotice(t(result.verificationRequired?'account.checkEmail':'account.sessionOpened'));setDisplayName('');}
    else await account.auth!.signIn(email,password);
  });}
  function updateName(event:FormEvent){event.preventDefault();if(!account.auth||!profileDraft.trim())return;void action(async()=>{await account.auth!.updateDisplayName(profileDraft);setEditingName(false);setNotice(t('account.nameUpdated'));});}

  return <div className="ds-account"><header className="ds-page-heading"><p className="ds-eyebrow">{t('account.studySpace')}</p><h1>{t('account.title')}</h1><p>{t('account.subtitle')}</p></header>
    <div className="ds-account-grid">
      <section className="ds-account-card ds-account-profile" aria-labelledby="profile-heading"><div className="ds-account-card-heading"><div><p className="ds-eyebrow">{t('account.identity')}</p><h2 id="profile-heading">{t('account.profile')}</h2></div>{user&&account.auth&&<button className="ds-button ds-button-quiet" type="button" onClick={()=>setEditingName(value=>!value)}>{t(editingName?'account.cancelEdit':'account.editProfile')}</button>}</div>
        <div className="ds-profile-summary"><span className="ds-avatar ds-avatar-large" aria-label={t('account.avatarInitials',{initials:profileInitials(user?.displayName)})}>{profileInitials(user?.displayName)}</span><div><strong>{user?.displayName?.trim()||t('account.anonymous')}</strong><p>{user?.email??t('account.noAccount')}</p></div></div>
        {editingName&&<form className="ds-profile-form" onSubmit={updateName}><label>{t('account.displayName')}<input required maxLength={80} autoComplete="name" value={profileDraft} onChange={event=>setProfileDraft(event.target.value)}/></label><div className="ds-form-actions"><button className="ds-button ds-button-quiet" type="button" disabled={busy} onClick={()=>{setEditingName(false);setProfileDraft(user?.displayName?.trim()??'');}}>{t('account.cancel')}</button><button className="ds-button ds-button-primary" type="submit" disabled={busy||!profileDraft.trim()}>{t(busy?'account.saving':'account.saveName')}</button></div></form>}
      </section>

      <section id="settings" className="ds-account-card" aria-labelledby="appearance-heading"><p className="ds-eyebrow">{t('account.personalization')}</p><h2 id="appearance-heading">{t('account.appearance')}</h2><p>{t('account.appearanceDescription')}</p>
        <fieldset className="ds-theme-picker"><legend>{t('account.theme')}</legend>{themes.map(option=><label key={option.value} className={theme.preference===option.value?'is-selected':''}><input type="radio" name="theme" value={option.value} checked={theme.preference===option.value} onChange={()=>theme.setPreference(option.value)}/><span><strong>{option.label}</strong><small>{option.description}</small></span></label>)}</fieldset>
        <p className="ds-account-meta">{t('theme.current',{theme:t(theme.resolved==='dark'?'theme.dark':'theme.light')})}</p>
        {user&&<div className="ds-account-tour"><div><h3>{t('tour.settingsTitle')}</h3><p>{t('tour.settingsBody')}</p></div><button className="ds-button ds-button-quiet" type="button" onClick={event=>window.dispatchEvent(new CustomEvent('notedra:tour:start',{detail:{opener:event.currentTarget}}))}>{t('tour.settingsAction')}</button></div>}
      </section>

      <section className="ds-account-card ds-account-language" aria-labelledby="language-heading"><p className="ds-eyebrow">{t('account.personalization')}</p><h2 id="language-heading">{t('language.title')}</h2><p>{t('language.description')}</p>
        <label className="ds-language-select">{t('language.label')}<select value={language} onChange={event=>setLanguage(event.target.value as typeof language)}>{languageOptions.map(option=><option key={option.value} value={option.value}>{option.nativeLabel}</option>)}</select></label>
        <p className="ds-account-meta">{t('language.saved')}</p>
      </section>

      <section className="ds-account-card" aria-labelledby="analytics-heading"><p className="ds-eyebrow">{t('analyticsConsent.privacy')}</p><h2 id="analytics-heading">{t('analyticsConsent.settingsTitle')}</h2><p>{t('analyticsConsent.settingsBody')}</p>
        <div className="ds-analytics-setting"><div><strong>{t(analytics.decision==='granted'?'analyticsConsent.enabled':'analyticsConsent.disabled')}</strong><p>{t('analyticsConsent.withdrawNote')}</p></div><label><input type="checkbox" checked={analytics.decision==='granted'} disabled={analyticsBusy} onChange={event=>{const enabled=event.target.checked;setAnalyticsBusy(true);void (enabled?analytics.allow():analytics.withdraw()).finally(()=>setAnalyticsBusy(false));}}/>{t('analyticsConsent.toggle')}</label></div>
      </section>

      <section className="ds-account-card" aria-labelledby="security-heading"><p className="ds-eyebrow">{t('account.access')}</p><h2 id="security-heading">{t('account.security')}</h2>
        {user?<><dl className="ds-security-list"><div><dt>{t('account.email')}</dt><dd>{user.email}</dd></div><div><dt>{t('account.password')}</dt><dd aria-label={t('account.passwordHidden')}>••••••••</dd></div></dl><p>{t('account.authDescription')}</p><button className="ds-button ds-button-quiet" type="button" disabled={busy||!account.auth} onClick={()=>void action(()=>account.auth!.signOut())}>{t('account.signOut')}</button></>:account.config.status==='configured'?<form className="ds-auth-form" onSubmit={submit}><h3>{t(creating?'account.create':'account.signIn')}</h3>{creating&&<label>{t('account.displayName')}<input required maxLength={80} autoComplete="name" value={displayName} onChange={e=>setDisplayName(e.target.value)}/></label>}<label>{t('account.email')}<input type="email" autoComplete="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)}/></label><label>{t('account.password')}<input type="password" autoComplete={creating?'new-password':'current-password'} required minLength={creating?8:1} maxLength={128} value={password} onChange={e=>setPassword(e.target.value)}/></label><div className="ds-form-actions"><button className="ds-button ds-button-primary" type="submit" disabled={busy||!account.auth}>{t(busy?'account.wait':creating?'account.createAction':'account.signIn')}</button><button className="ds-button ds-button-quiet" type="button" disabled={busy} onClick={()=>{setCreating(!creating);setPassword('');setError('');}}>{t(creating?'account.existing':'account.createInstead')}</button>{account.state.phase==='error'&&<button className="ds-button ds-button-quiet" type="button" disabled={busy} onClick={()=>void action(()=>account.auth!.signOut())}>{t('account.retrySignOut')}</button>}</div><p>{t('account.authDescription')}</p></form>:<p>{t('account.authUnavailable')}</p>}
      </section>

      <section className="ds-account-card ds-account-sync" aria-labelledby="sync-heading"><div className="ds-account-card-heading"><div><p className="ds-eyebrow">{t('account.storage')}</p><h2 id="sync-heading">{t('account.syncBackup')}</h2></div><span className={`ds-sync-badge ds-sync-${account.syncStatus.toLowerCase().replaceAll(' ','-')}`}>{syncStatusLabel}</span></div><p role="status"><strong>{syncStatusLabel}</strong>{account.syncMessage&&` — ${account.syncMessage}`}</p>{account.state.message&&<p>{account.state.message}</p>}{account.config.status!=='configured'&&account.syncMessage!==account.config.message&&<p>{account.config.message}</p>}
        {user&&account.config.status==='configured'&&<><div className="ds-account-actions"><button className="ds-button ds-button-primary" disabled={busy||account.syncStatus==='Syncing'||!account.sync} onClick={()=>void action(()=>account.sync!())}>{t('account.syncNow')}</button></div>
          {account.syncStatus==='Conflict requires attention'&&account.reconcile&&<details><summary>{t('account.restoreSync')}</summary><p>{t('account.restoreSyncBody')}</p><label><input type="checkbox" checked={restoreConsent} onChange={e=>setRestoreConsent(e.target.checked)}/> {t('account.compareConsent')}</label><button className="ds-button" disabled={!restoreConsent||busy} onClick={()=>void action(async()=>{await account.reconcile!();setRestoreConsent(false);})}>{t('account.compareHistory')}</button></details>}
          <p>{t('account.syncBehavior')}</p>
          <details><summary>{t('account.copyAnonymous')}</summary><p>{t('account.copyAnonymousBody')}</p><label><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> {t('account.copyConsent',{email:user.email})}</label><button className="ds-button" disabled={!consent||busy||account.syncStatus==='Syncing'||!account.adopt} onClick={()=>void action(async()=>{await account.adopt!();setConsent(false);})}>{t('account.copyHistory')}</button></details>
        </>}
      </section>
    </div>
    {error&&<p className="ds-account-feedback" ref={feedback} tabIndex={-1} role="alert">{error}</p>}{notice&&<p className="ds-account-feedback" role="status">{notice}</p>}
    <StudentDataPanel/>
  </div>;
}
