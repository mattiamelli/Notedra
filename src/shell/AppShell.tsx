import {RouteBoundary} from './RouteBoundary';
import { LearningNotice } from '../learning/LearningProvider';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { ASSEMBLY_TOOL_PATH, ASSEMBLY_TOPIC_PATH, courses, pageContext, productAreas } from '../academic/navigation';
import { ShellIcon } from './ShellIcon';

export function AppShell() {
  const {pathname, hash} = useLocation();
  const context = pathname.replace(/\/+$/, '') === '/account' ? {title:'Account & sync',breadcrumbs:[{label:'Dashboard',to:'/'},{label:'Account & sync'}]} : pageContext(pathname);
  const tool = pathname.replace(/\/+$/, '') === ASSEMBLY_TOOL_PATH;
  const [navigationOpen, setNavigationOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const content = useRef<HTMLElement>(null);
  const previousPath = useRef(pathname);
  function closeNavigation() {
    if (navigationOpen) menuButton.current?.focus();
    setNavigationOpen(false);
  }
  useEffect(() => {
    document.title = `${context.title} · DelftStudy`;
    if (previousPath.current !== pathname) {
      setNavigationOpen(false);
      if(document.activeElement?.getAttribute('role') !== 'tab') content.current?.focus();
      window.scrollTo(0, 0);
      previousPath.current = pathname;
    }
    if(hash){const target=document.getElementById(hash.slice(1));if(target&&content.current?.contains(target)){target.tabIndex=-1;target.focus({preventScroll:true});target.scrollIntoView?.({block:'start'});}}
  }, [pathname, context.title, hash]);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && navigationOpen) { setNavigationOpen(false); menuButton.current?.focus(); }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [navigationOpen]);
  const Content = tool ? 'div' : 'main';
  return <div className={`ds-app${tool ? ' ds-tool' : ''}`} data-course={courses.find(course => pathname === course.path || pathname.startsWith(course.path+'/'))?.subject_id}>
    <a className="ds-skip-link" href="#ds-content">Skip to content</a>
    <header className="ds-topbar">
      <button ref={menuButton} className="ds-menu-button" aria-label={navigationOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={navigationOpen} aria-controls="ds-navigation" onClick={() => setNavigationOpen(open => !open)}><ShellIcon name={navigationOpen ? 'close' : 'menu'}/></button>
      <nav className="ds-breadcrumbs" aria-label="Breadcrumb"><ol>{context.breadcrumbs.map((crumb, i) => <li key={`${i}-${crumb.label}`}>{crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}</li>)}</ol></nav>
      <Link className="ds-header-account" to="/account" aria-label="Account & sync"><span className="ds-avatar">DS</span><span>Your study space<small>Account & sync</small></span></Link>
    </header>
    <aside className={`ds-sidebar${navigationOpen ? ' is-open' : ''}`} id="ds-navigation">
      <Link className="ds-brand" to="/" onClick={closeNavigation}><span className="ds-brand-mark"><ShellIcon name="book" size={22}/></span><span>Delft<strong>Study</strong></span></Link>
      <p className="ds-brand-tagline">Learn deeper.<br/>Go further.</p><nav aria-label="Primary navigation">
        <NavLink to="/" end className="ds-nav-link" onClick={closeNavigation}><ShellIcon name="dashboard"/><span>Dashboard</span></NavLink>
        <div className="ds-nav-group">Courses</div>
        {courses.map(course => <NavLink key={course.subject_id} to={course.path} data-course={course.subject_id} className="ds-nav-link" onClick={closeNavigation}><ShellIcon name={course.icon}/><span>{course.name}</span></NavLink>)}
        <div className="ds-nav-group">Study</div>
        {productAreas.map(area => <NavLink key={area.path} to={area.path} className="ds-nav-link" onClick={closeNavigation}><ShellIcon name={area.icon}/><span>{area.title}</span></NavLink>)}
        <NavLink to="/account" className="ds-nav-link" onClick={closeNavigation}><ShellIcon name="progress"/><span>Account & sync</span></NavLink>
      </nav>
      <div className="ds-sidebar-footer"><p className="ds-sidebar-note">Small steps.<br/>Deeper understanding.</p><Link to="/account" onClick={closeNavigation}><span className="ds-avatar">DS</span><span>Your study space<small>Account & sync</small></span></Link></div>
    </aside>
    <Content ref={element => {content.current = element;}} id="ds-content" tabIndex={-1} className={tool ? 'ds-tool-content' : 'ds-main'}>
      {tool && <Link className="ds-tool-back" to={ASSEMBLY_TOPIC_PATH}><ShellIcon name="back" size={16}/> Back to Assembly topic</Link>}
      <LearningNotice/><RouteBoundary resetKey={pathname}><Outlet/></RouteBoundary>
    </Content>
  </div>;
}
