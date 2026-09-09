import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { resolveStudyRoute, academicIndex, ASSEMBLY_TOOL_PATH, ASSEMBLY_TOPIC_ID, courses, topicPath } from '../academic/navigation';
import { errorMessage, type Backup, type Dataset, type LoadedState, type TopicIdentity } from './contracts';
import { IndexedStudentRepository, type StudentRepository } from './repository';

type Phase = 'loading' | 'ready' | 'busy' | 'error';
interface LearningContextValue {
  snapshot: LoadedState | null; phase: Phase; message: string;
  recordVisit(topic: TopicIdentity): void;
  refresh(): void;
  restore(backup: Backup, expected: Dataset): Promise<void>;
  backup(recovery?: boolean): Promise<Backup>;
  changeStudentData(operation: (repository: StudentRepository) => Promise<LoadedState>): Promise<LoadedState>;
}
const Context = createContext<LearningContextValue | null>(null);
export const useLearning = () => useContext(Context);
interface Session { repository: StudentRepository; data: LoadedState | null; queue: Promise<unknown>; alive: boolean; }
export function LearningProvider({children, createRepository = defaultRepository}: {children: ReactNode; createRepository?: () => StudentRepository}) {
  const [snapshot, setSnapshot] = useState<LoadedState | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [message, setMessage] = useState('Opening student storage…');
  const session = useRef<Session | null>(null);
  const publish = useCallback((current: Session, state: LoadedState) => {
    current.data = state;
    if (current.alive) { setSnapshot(state); setPhase('ready'); setMessage('Local student storage is ready.'); }
  }, []);
  const failed = useCallback((current: Session, error: unknown) => {
    if (current.alive) { setPhase('error'); setMessage(errorMessage(error)); }
  }, []);
  useEffect(() => {
    const current: Session = {repository: createRepository(), data: null, queue: Promise.resolve(), alive: true};
    session.current = current;
    current.queue = current.repository.load().then(state => publish(current, state), error => failed(current, error));
    return () => {
      current.alive = false;
      // Finish already-started writes before closing; persistence does not depend on unload events.
      void current.queue.finally(() => current.repository.close());
    };
  }, [createRepository, failed, publish]);
  const run = useCallback(<T,>(operation: (current: Session) => Promise<T>): Promise<T> => {
    const current = session.current;
    if (!current) return Promise.reject(new Error('Student storage is still opening.'));
    if (current.alive) { setPhase('busy'); setMessage('Working with local student data…'); }
    const next = current.queue.then(() => operation(current));
    current.queue = next.then(() => {}, error => failed(current, error));
    return next;
  }, [failed]);
  const recordVisit = useCallback((topic: TopicIdentity) => {
    void run(async current => {
      if (!current.data) throw new Error('Storage has not loaded.');
      const next = await current.repository.saveResume({...topic, visitedAt: new Date().toISOString()}, current.data.data);
      publish(current, next);
      if (current.alive) setMessage('Last topic saved in this browser.');
    }).catch(() => {});
  }, [publish, run]);
  const refresh = useCallback(() => {
    void run(async current => { publish(current, await current.repository.load()); }).catch(() => {});
  }, [publish, run]);
  const restore = useCallback((backup: Backup, expected: Dataset) => run(async current => {
    publish(current, await current.repository.restore(backup, expected));
    if (current.alive) setMessage('Backup restored in this browser. The previous data is available as a recovery backup.');
  }), [publish, run]);
  const backup = useCallback((recovery = false) => run(async current => {
    const value = await (recovery ? current.repository.exportRecovery() : current.repository.exportBackup());
    if (current.alive) { setPhase('ready'); setMessage('Backup prepared. Keep the downloaded file somewhere safe.'); }
    return value;
  }), [run]);
  const changeStudentData = useCallback((operation: (repository: StudentRepository) => Promise<LoadedState>) => run(async current => {
    const state = await operation(current.repository);
    publish(current, state);
    return state;
  }), [publish, run]);
  return <Context.Provider value={{snapshot, phase, message, recordVisit, refresh, restore, backup, changeStudentData}}>
    <ResumeRecorder/>{children}
  </Context.Provider>;
}
function defaultRepository() { return new IndexedStudentRepository(); }
function ResumeRecorder() {
  const {pathname, key} = useLocation(); const learning = useLearning()!;
  const lastVisit = useRef<string | null>(null);
  const ready = !!learning.snapshot && learning.phase !== 'error' && learning.phase !== 'loading';
  const {recordVisit} = learning;
  useEffect(() => {
    if (!ready || lastVisit.current === key) return;
    lastVisit.current = key;
    const canonicalPath = pathname.replace(/\/+$/, '') || '/';
    const topic = resolveStudyRoute(canonicalPath)?.topic ?? academicIndex.topics.find(item => topicPath(item) === canonicalPath || (canonicalPath === ASSEMBLY_TOOL_PATH && item.topic_id === ASSEMBLY_TOPIC_ID));
    if (topic) recordVisit({subjectId: topic.subject_id, topicId: topic.topic_id});
  }, [pathname, key, ready, recordVisit]);
  return null;
}
export function ResumeLink() {
  const learning = useLearning(); const resume = learning?.snapshot?.data.resume;
  const topic = resume && academicIndex.topics.find(item => item.topic_id === resume.topicId && item.subject_id === resume.subjectId);
  const course = topic && courses.find(item => item.subject_id === topic.subject_id);
  if (!topic || !course) return null;
  return <section className="ds-resume ds-section" aria-labelledby="resume-heading"><div><h2 id="resume-heading">Resume last topic</h2><p>{course.name}</p></div><Link className="ds-text-link" to={topicPath(topic)}>{topic.name} →</Link></section>;
}
export function LearningNotice() {
  const learning = useLearning();
  return learning?.phase === 'error' ? <p className="ds-storage-error" role="alert">{learning.message} <Link to="/progress">Manage student data</Link></p> : null;
}
