import {useEffect,useRef,useState,type FormEvent} from 'react';
import {useTheme,type ThemePreference} from '../appearance/theme';
import {StudentDataPanel} from '../learning/StudentDataPanel';
import {useAccount} from './context';
import {profileInitials} from './profile';
import './accounts.css';

const themes: {value: ThemePreference; label: string; description: string}[] = [
  {value:'light',label:'Light',description:'Bright study surfaces'},
  {value:'dark',label:'Dark',description:'Low-light study surfaces'},
  {value:'system',label:'System',description:'Follow this device'},
];

export function AccountPage() {
  const account=useAccount(),theme=useTheme();
  const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[displayName,setDisplayName]=useState(''),[editingName,setEditingName]=useState(false),[profileDraft,setProfileDraft]=useState(''),[creating,setCreating]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[consent,setConsent]=useState(false),[restoreConsent,setRestoreConsent]=useState(false);
  const feedback=useRef<HTMLParagraphElement>(null),user=account.state.user;
  useEffect(()=>{if(error)feedback.current?.focus();},[error]);
  useEffect(()=>{setProfileDraft(user?.displayName?.trim()??'');setEditingName(false);},[user?.id,user?.displayName]);
  async function action(work:()=>Promise<unknown>) {if(busy)return;setBusy(true);setError('');setNotice('');try{await work();}catch(e){setError(e instanceof Error?e.message:'Account action failed. Your local work is preserved.');}finally{setBusy(false);setPassword('');}}
  function submit(event:FormEvent){event.preventDefault();if(!account.auth)return;void action(async()=>{
    if(creating){if(!displayName.trim())throw Error('Enter a display name.');const result=await account.auth!.signUp(email,password,displayName);setNotice(result.verificationRequired?'Check your email to verify the account, then return here and sign in. An account may already exist for this address.':'Account session opened. Your anonymous history stays separate until you choose to copy it.');setDisplayName('');}
    else await account.auth!.signIn(email,password);
  });}
  function updateName(event:FormEvent){event.preventDefault();if(!account.auth||!profileDraft.trim())return;void action(async()=>{await account.auth!.updateDisplayName(profileDraft);setEditingName(false);setNotice('Display name updated.');});}

  return <div className="ds-account"><header className="ds-page-heading"><p className="ds-eyebrow">Your study space</p><h1>Account &amp; cloud sync</h1><p>Manage your identity, appearance, sync, and local study data.</p></header>
    <div className="ds-account-grid">
      <section className="ds-account-card ds-account-profile" aria-labelledby="profile-heading"><div className="ds-account-card-heading"><div><p className="ds-eyebrow">Identity</p><h2 id="profile-heading">Profile</h2></div>{user&&account.auth&&<button className="ds-button ds-button-quiet" type="button" onClick={()=>setEditingName(value=>!value)}>{editingName?'Cancel edit':'Edit profile'}</button>}</div>
        <div className="ds-profile-summary"><span className="ds-avatar ds-avatar-large" aria-label={`Avatar initials ${profileInitials(user?.displayName)}`}>{profileInitials(user?.displayName)}</span><div><strong>{user?.displayName?.trim()||'Anonymous local profile'}</strong><p>{user?.email??'No account is required to study on this device.'}</p></div></div>
        {editingName&&<form className="ds-profile-form" onSubmit={updateName}><label>Display name<input required maxLength={80} autoComplete="name" value={profileDraft} onChange={event=>setProfileDraft(event.target.value)}/></label><div className="ds-form-actions"><button className="ds-button ds-button-quiet" type="button" disabled={busy} onClick={()=>{setEditingName(false);setProfileDraft(user?.displayName?.trim()??'');}}>Cancel</button><button className="ds-button ds-button-primary" type="submit" disabled={busy||!profileDraft.trim()}>{busy?'Saving…':'Save name'}</button></div></form>}
      </section>

      <section className="ds-account-card" aria-labelledby="appearance-heading"><p className="ds-eyebrow">Personalization</p><h2 id="appearance-heading">Appearance</h2><p>Choose a theme or let Notedra follow this device automatically.</p>
        <fieldset className="ds-theme-picker"><legend>Theme</legend>{themes.map(option=><label key={option.value} className={theme.preference===option.value?'is-selected':''}><input type="radio" name="theme" value={option.value} checked={theme.preference===option.value} onChange={()=>theme.setPreference(option.value)}/><span><strong>{option.label}</strong><small>{option.description}</small></span></label>)}</fieldset>
        <p className="ds-account-meta">Currently using {theme.resolved} appearance.</p>
      </section>

      <section className="ds-account-card" aria-labelledby="security-heading"><p className="ds-eyebrow">Access</p><h2 id="security-heading">Security</h2>
        {user?<><dl className="ds-security-list"><div><dt>Email</dt><dd>{user.email}</dd></div><div><dt>Password</dt><dd aria-label="Password hidden">••••••••</dd></div></dl><p>Your password is handled by Supabase Auth and is never stored or displayed by Notedra.</p><button className="ds-button ds-button-quiet" type="button" disabled={busy||!account.auth} onClick={()=>void action(()=>account.auth!.signOut())}>Sign out</button></>:account.config.status==='configured'?<form className="ds-auth-form" onSubmit={submit}><h3>{creating?'Create an account':'Sign in'}</h3>{creating&&<label>Display name<input required maxLength={80} autoComplete="name" value={displayName} onChange={e=>setDisplayName(e.target.value)}/></label>}<label>Email<input type="email" autoComplete="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" autoComplete={creating?'new-password':'current-password'} required minLength={creating?8:1} maxLength={128} value={password} onChange={e=>setPassword(e.target.value)}/></label><div className="ds-form-actions"><button className="ds-button ds-button-primary" type="submit" disabled={busy||!account.auth}>{busy?'Please wait…':creating?'Create account':'Sign in'}</button><button className="ds-button ds-button-quiet" type="button" disabled={busy} onClick={()=>{setCreating(!creating);setPassword('');setError('');}}>{creating?'Use an existing account':'Create an account instead'}</button>{account.state.phase==='error'&&<button className="ds-button ds-button-quiet" type="button" disabled={busy} onClick={()=>void action(()=>account.auth!.signOut())}>Retry sign-out</button>}</div><p>Passwords are sent to Supabase Auth and are not stored by Notedra. If email verification is enabled, verify first and then sign in here.</p></form>:<p>Account access is unavailable in this environment. Anonymous local study remains available.</p>}
      </section>

      <section className="ds-account-card ds-account-sync" aria-labelledby="sync-heading"><div className="ds-account-card-heading"><div><p className="ds-eyebrow">Storage</p><h2 id="sync-heading">Sync &amp; Backup</h2></div><span className={`ds-sync-badge ds-sync-${account.syncStatus.toLowerCase().replaceAll(' ','-')}`}>{account.syncStatus}</span></div><p role="status"><strong>{account.syncStatus}</strong>{account.syncMessage&&` — ${account.syncMessage}`}</p>{account.state.message&&<p>{account.state.message}</p>}{account.config.status!=='configured'&&account.syncMessage!==account.config.message&&<p>{account.config.message}</p>}
        {user&&account.config.status==='configured'&&<><div className="ds-account-actions"><button className="ds-button ds-button-primary" disabled={busy||account.syncStatus==='Syncing'||!account.sync} onClick={()=>void action(()=>account.sync!())}>Sync now</button></div>
          {account.syncStatus==='Conflict requires attention'&&account.reconcile&&<details><summary>Recover after a backup restore during sync</summary><p>First export your current and recovery backups in Progress. This retries the saved upload with its original operation ID, then compares your restored data with that acknowledged history. Missing historical records can return. Conflicting submitted answers or concurrent drafts are still rejected.</p><label><input type="checkbox" checked={restoreConsent} onChange={e=>setRestoreConsent(e.target.checked)}/> Compare my restored profile with the saved cloud operation.</label><button className="ds-button" disabled={!restoreConsent||busy} onClick={()=>void action(async()=>{await account.reconcile!();setRestoreConsent(false);})}>Compare restored history</button></details>}
          <p>Sync runs after sign-in and when you choose Sync now. New local work is marked pending. Signing out preserves this account’s local profile and returns to the separate anonymous profile.</p>
          <details><summary>Copy anonymous history into this account</summary><p>This copies saved attempts, exams and review records. It keeps the anonymous original and compares matching IDs. Conflicting histories stop the copy.</p><label><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> I want to associate this browser’s anonymous study history with {user.email}.</label><button className="ds-button" disabled={!consent||busy||account.syncStatus==='Syncing'||!account.adopt} onClick={()=>void action(async()=>{await account.adopt!();setConsent(false);})}>Copy anonymous history</button></details>
        </>}
      </section>
    </div>
    {error&&<p className="ds-account-feedback" ref={feedback} tabIndex={-1} role="alert">{error}</p>}{notice&&<p className="ds-account-feedback" role="status">{notice}</p>}
    <StudentDataPanel/>
  </div>;
}
