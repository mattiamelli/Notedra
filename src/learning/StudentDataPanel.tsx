import { useRef, useState, type ChangeEvent } from 'react';
import { errorMessage, MAX_BACKUP_BYTES, parseBackup, type Backup, type Dataset } from './contracts';
import { useLearning } from './LearningProvider';
function download(backup: Backup, recovery: boolean) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], {type: 'application/json'}));
  const anchor = document.createElement('a'); anchor.href = url;
  anchor.download = recovery ? 'delftstudy-student-recovery.json' : 'delftstudy-student-backup.json';
  document.body.append(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function StudentDataPanel() {
  const learning = useLearning();
  const [pending, setPending] = useState<{backup: Backup; expected: Dataset; name: string} | null>(null);
  const [error, setError] = useState(''); const [reading, setReading] = useState(false);
  const sequence = useRef(0); const input = useRef<HTMLInputElement>(null);
  const [confirmed, setConfirmed] = useState(false);
  const unavailable = !learning?.snapshot || learning.phase === 'loading' || learning.phase === 'busy' || learning.phase === 'error' || reading;
  async function prepare(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file || !learning?.snapshot) return;
    const current = ++sequence.current; const expected = learning.snapshot.data;
    setPending(null); setConfirmed(false); setError(''); setReading(true);
    try {
      if (file.size > MAX_BACKUP_BYTES) throw new Error('Backup exceeds the 4 MB limit.');
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
  return <section className="ds-storage ds-section" aria-labelledby="storage-heading">
    <div className="ds-section-heading"><h2 id="storage-heading">Your student data</h2><span>Stored on this device</span></div>
    <p>Student data stays in this browser and site origin. It is not cloud-synced. Another browser, device, host or port has separate data; use a backup to transfer it.</p>
    <p>Browser-data deletion or device failure can remove local data. A successful save confirms a completed local transaction, not protection against every OS crash. Keep an exported backup.</p>
    <p role="status">{reading ? 'Reading and validating backup…' : learning?.message ?? 'Student storage is not connected.'}</p>
    {error && <p role="alert" className="ds-storage-error">{error}</p>}
    <div className="ds-storage-actions">
      <button className="ds-button" disabled={unavailable} onClick={() => void exportFile()}>Export student backup</button>
      <label className="ds-backup-input">Choose student backup<input ref={input} type="file" accept=".json,application/json" disabled={unavailable} onChange={event => void prepare(event)}/></label>
      {learning?.snapshot?.hasRecovery && <button className="ds-button" disabled={unavailable} onClick={() => void exportFile(true)}>Export pre-restore recovery</button>}
      <button className="ds-button" disabled={!learning || learning.phase === 'busy' || reading} onClick={() => { setPending(null); setError(''); learning?.refresh(); }}>Reload saved data</button>
    </div>
    {pending && <div className="ds-restore-confirm" role="group" aria-labelledby="restore-title">
      <h3 id="restore-title">Review replacement</h3><p>{pending.name}: {pending.backup.attempts.length} stored attempts; {pending.backup.resume ? 'a saved topic' : 'no saved topic'}.</p>
      <p>This replaces all student records in this browser’s current origin. The current records will be retained as a downloadable pre-restore recovery backup.</p>
      <label><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)}/> I understand this replaces my current student data.</label>
      <div className="ds-storage-actions"><button className="ds-button" disabled={!confirmed || unavailable} onClick={() => void restore()}>Replace student data</button><button className="ds-button" disabled={learning?.phase === 'busy'} onClick={() => { setPending(null); setConfirmed(false); }}>Cancel restore</button></div>
    </div>}
    <p className="ds-storage-note">Backups include only student records. The Assembly editor and display preferences use separate storage; execution history remains session-only. Visits and ungraded answers do not count as assessed progress.</p>
  </section>;
}
