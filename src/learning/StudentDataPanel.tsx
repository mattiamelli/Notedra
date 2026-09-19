import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { errorMessage, MAX_BACKUP_BYTES, parseBackup, type Backup, type Dataset } from './contracts';
import { useLearning } from './LearningProvider';
import {useI18n} from '../i18n/i18n';
function download(backup: Backup, recovery: boolean) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], {type: 'application/json'}));
  const anchor = document.createElement('a'); anchor.href = url;
  anchor.download = recovery ? 'notedra-student-recovery.json' : 'notedra-student-backup.json';
  document.body.append(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function StudentDataPanel() {
  const {t}=useI18n();
  const learning = useLearning();
  const [pending, setPending] = useState<{backup: Backup; expected: Dataset; name: string} | null>(null);
  const [error, setError] = useState(''); const [reading, setReading] = useState(false);
  const sequence = useRef(0); const input = useRef<HTMLInputElement>(null);
  const [confirmed, setConfirmed] = useState(false);
  useEffect(()=>{if(window.location.hash==='#study-data'){const panel=document.getElementById('study-data');if(panel){panel.tabIndex=-1;panel.focus({preventScroll:true});panel.scrollIntoView?.({block:'start'});}}},[]);
  const unavailable = !learning?.snapshot || learning.phase === 'loading' || learning.phase === 'busy' || learning.phase === 'error' || reading;
  async function prepare(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file || !learning?.snapshot) return;
    const current = ++sequence.current; const expected = learning.snapshot.data;
    setPending(null); setConfirmed(false); setError(''); setReading(true);
    try {
      if (file.size > MAX_BACKUP_BYTES) throw new Error('Backup exceeds the 16 MB limit.');
      const backup = parseBackup(await file.text());
      if (current === sequence.current) setPending({backup, expected, name: file.name});
    } catch (failure) { if (current === sequence.current) setError(failure instanceof Error ? failure.message : errorMessage(failure)); }
    finally { if (current === sequence.current) setReading(false); if (input.current) input.current.value = ''; }
  }
  async function exportFile(recovery = false) {
    setError('');
    try { if (learning) download(await learning.backup(recovery), recovery); }
    catch (failure) { setError(errorMessage(failure)); }
  }
  async function restore() {
    if (!pending || !confirmed || !learning) return;
    setError('');
    try { await learning.restore(pending.backup, pending.expected); setPending(null); setConfirmed(false); }
    catch (failure) { setError(errorMessage(failure)); }
  }
  return <section id="study-data" className="ds-storage ds-section" aria-labelledby="storage-heading">
    <div className="ds-section-heading"><h2 id="storage-heading">{t('data.title')}</h2><span>{t('data.subtitle')}</span></div>
    <p>{t('data.description')}</p>
    <p>{t('data.warning')}</p>
    <p role="status">{reading?t('data.reading'):learning?.message??t('data.notConnected')}</p>
    {error && <p role="alert" className="ds-storage-error">{error}</p>}
    <div className="ds-storage-actions">
      <button className="ds-button" disabled={unavailable} onClick={() => void exportFile()}>{t('data.export')}</button>
      <label className="ds-backup-input">{t('data.choose')}<input ref={input} type="file" accept=".json,application/json" disabled={unavailable} onChange={event => void prepare(event)}/></label>
      {learning?.snapshot?.hasRecovery && <button className="ds-button" disabled={unavailable} onClick={() => void exportFile(true)}>{t('data.recovery')}</button>}
      <button className="ds-button" disabled={!learning || learning.phase === 'busy' || reading} onClick={() => { setPending(null); setError(''); learning?.refresh(); }}>{t('data.reload')}</button>
    </div>
    {pending && <div className="ds-restore-confirm" role="group" aria-labelledby="restore-title">
      <h3 id="restore-title">{t('data.review')}</h3><p>{pending.name}: {pending.backup.attempts.length} stored attempts; {pending.backup.exams.length} exam sessions; {pending.backup.resume ? 'a saved topic' : 'no saved topic'}.</p>
      <p>{t('data.reviewBody')}</p>
      <label><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)}/> {t('data.confirm')}</label>
      <div className="ds-storage-actions"><button className="ds-button" disabled={!confirmed || unavailable} onClick={() => void restore()}>{t('data.replace')}</button><button className="ds-button" disabled={learning?.phase === 'busy'} onClick={() => { setPending(null); setConfirmed(false); }}>{t('data.cancel')}</button></div>
    </div>}
    <details><summary>{t('data.about')}</summary><p className="ds-storage-note">{t('data.aboutBody')}</p><p>{t('data.restoreBody')}</p></details>
  </section>;
}
