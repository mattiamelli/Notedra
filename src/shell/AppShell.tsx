import {RouteBoundary} from './RouteBoundary';
import {LearningNotice} from '../learning/LearningProvider';
import {useEffect, useRef, useState, type ReactNode} from 'react';
import {Link, Outlet, useLocation} from 'react-router';
import {ASSEMBLY_TOOL_PATH, ASSEMBLY_TOPIC_PATH, courses, pageContext} from '../academic/navigation';
import {ShellIcon, type ShellIconName} from './ShellIcon';
import {useAccount} from '../accounts/context';
import {profileInitials} from '../accounts/profile';
import {PUBLIC_LEGAL_CONTACT} from '../legal/contact';
import {useI18n} from '../i18n/i18n';
import type {MessageKey} from '../i18n/messages';
import {ProductTour} from '../tour/ProductTour';

const contextKeys:Partial<Record<string,MessageKey>>={
  Dashboard:'dashboard.title', Practice:'practice.title', Progress:'progress.title', 'Study Path':'studyPath.title',
  'Account & Settings':'account.title', 'Account & sync':'account.title', 'Privacy Policy':'nav.privacy',
  'Terms of Use':'nav.terms', 'Page not found':'common.pageNotFound',
};

function SidebarLink({to,hash,icon,label,onSelect,activeWhen,tourId}:{to:string;hash?:string;icon:ShellIconName;label:MessageKey;onSelect:()=>void;activeWhen?:(pathname:string)=>boolean;tourId?:string}) {
  const {pathname,hash:currentHash}=useLocation(); const {t}=useI18n();
  const active=activeWhen?.(pathname)??(pathname===to&&(hash ? currentHash===hash : !currentHash));
  return <Link to={{pathname:to,hash}} className={`ds-nav-link${active?' active':''}`} aria-current={active?'page':undefined} data-tour={tourId} onClick={onSelect}><ShellIcon name={icon}/><span>{t(label)}</span></Link>;
}

function NavigationGroup({label,children}:{label:MessageKey;children:ReactNode}) {
  const {t}=useI18n(); return <section className="ds-nav-section"><h2 className="ds-nav-group">{t(label)}</h2><div className="ds-nav-items">{children}</div></section>;
}

export function AppShell() {
  const {t}=useI18n();
  const {state}=useAccount(); const profileName=state.user?.displayName?.trim(); const initial=profileInitials(profileName);
  const {pathname,hash}=useLocation(); const normalizedPath=pathname.replace(/\/+$/, '')||'/';
  const specialContext:Record<string,{title:string;breadcrumbs:{label:string;to?:string}[]}>= {
    '/account':{title:'Account & Settings',breadcrumbs:[{label:'Dashboard',to:'/dashboard'},{label:'Account & Settings'}]},
    '/privacy':{title:'Privacy Policy',breadcrumbs:[{label:'Dashboard',to:'/dashboard'},{label:'Privacy Policy'}]},
    '/terms':{title:'Terms of Use',breadcrumbs:[{label:'Dashboard',to:'/dashboard'},{label:'Terms of Use'}]},
  };
  const context=specialContext[normalizedPath]??pageContext(pathname);
  const localized=(label:string)=>contextKeys[label]?t(contextKeys[label]!):label;
  const tool=normalizedPath===ASSEMBLY_TOOL_PATH;
  const course=courses.find(item=>pathname===item.path||pathname.startsWith(item.path+'/'))??{subject_id:undefined};
  const [navigationOpen,setNavigationOpen]=useState(false);
  const menuButton=useRef<HTMLButtonElement>(null),content=useRef<HTMLElement>(null),previousPath=useRef(pathname);
  function closeNavigation(){if(navigationOpen)menuButton.current?.focus();setNavigationOpen(false);}
  useEffect(()=>{
    document.title=`${localized(context.title)} · Notedra`;
    if(previousPath.current!==pathname){setNavigationOpen(false);if(document.activeElement?.getAttribute('role')!=='tab')content.current?.focus();window.scrollTo(0,0);previousPath.current=pathname;}
    if(hash){const target=document.getElementById(hash.slice(1));if(target&&content.current?.contains(target)){target.tabIndex=-1;target.focus({preventScroll:true});target.scrollIntoView?.({block:'start'});}}
  },[pathname,context.title,hash,t]);
  useEffect(()=>{const close=(event:KeyboardEvent)=>{if(event.key==='Escape'&&navigationOpen){setNavigationOpen(false);menuButton.current?.focus();}};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close);},[navigationOpen]);
  const Content=tool?'div':'main';
  return <div className={`ds-app${tool?' ds-tool':''}`} data-course={course.subject_id}>
    <a className="ds-skip-link" href="#ds-content">{t('a11y.skip')}</a>
    <header className="ds-topbar">
      <button ref={menuButton} className="ds-menu-button" data-tour="mobile-menu" aria-label={t(navigationOpen?'a11y.closeNavigation':'a11y.openNavigation')} aria-expanded={navigationOpen} aria-controls="ds-navigation" onClick={()=>setNavigationOpen(open=>!open)}><ShellIcon name={navigationOpen?'close':'menu'}/></button>
      <nav className="ds-breadcrumbs" aria-label={t('a11y.breadcrumb')}><ol>{context.breadcrumbs.map((crumb,i)=><li key={`${i}-${crumb.label}`}>{crumb.to?<Link to={crumb.to}>{localized(crumb.label)}</Link>:<span aria-current="page">{localized(crumb.label)}</span>}</li>)}</ol></nav>
      <Link className="ds-header-account" to="/account#settings" aria-label={t('a11y.accountSettings')}><span className="ds-avatar">{initial}</span><span>{profileName??t('account.studySpace')}<small>{t('account.title')}</small></span></Link>
    </header>
    <aside className={`ds-sidebar${navigationOpen?' is-open':''}`} id="ds-navigation">
      <Link className="ds-brand" to="/dashboard" onClick={closeNavigation}><span className="ds-brand-mark"><ShellIcon name="book" size={22}/></span><span className="ds-brand-name">Notedra</span></Link>
      <p className="ds-brand-tagline">{t('brand.tagline')}</p>
      <nav aria-label={t('a11y.primaryNavigation')}>
        <NavigationGroup label="nav.main">
          <SidebarLink to="/dashboard" icon="dashboard" label="nav.home" onSelect={closeNavigation}/>
          <SidebarLink to="/dashboard" hash="#courses" icon="book" label="nav.courses" tourId="courses" onSelect={closeNavigation} activeWhen={path=>courses.some(course=>path===course.path||path.startsWith(course.path+'/'))}/>
          <SidebarLink to="/practice" icon="practice" label="nav.practice" tourId="practice" onSelect={closeNavigation}/>
          <SidebarLink to="/progress" icon="progress" label="nav.progress" tourId="progress" onSelect={closeNavigation}/>
        </NavigationGroup>
        <NavigationGroup label="nav.secondary">
          <SidebarLink to="/study-plan" icon="book" label="nav.studyPath" tourId="study-path" onSelect={closeNavigation}/>
        </NavigationGroup>
        <NavigationGroup label="nav.accountGroup">
          <SidebarLink to="/account" hash="#settings" icon="settings" label="nav.settings" onSelect={closeNavigation}/>
        </NavigationGroup>
      </nav>
      <div className="ds-sidebar-footer"><p className="ds-sidebar-note">{t('brand.sidebarNote')}</p><Link to="/account" onClick={closeNavigation}><span className="ds-avatar">{initial}</span><span>{profileName??t('account.studySpace')}<small>{t('account.title')}</small></span></Link></div>
    </aside>
    <Content ref={element=>{content.current=element;}} id="ds-content" tabIndex={-1} className={tool?'ds-tool-content':'ds-main'}>
      {tool&&<Link className="ds-tool-back" to={ASSEMBLY_TOPIC_PATH}><ShellIcon name="back" size={16}/> {t('nav.backAssembly')}</Link>}
      <LearningNotice/><RouteBoundary resetKey={pathname}><Outlet/></RouteBoundary>
      {!tool&&<footer className="ds-legal-footer"><span>{t('brand.independent')}</span><nav aria-label={t('a11y.legalNavigation')}><Link to="/privacy">{t('nav.privacy')}</Link><Link to="/terms">{t('nav.terms')}</Link><a href={`mailto:${PUBLIC_LEGAL_CONTACT}`}>{t('nav.support')}</a></nav></footer>}
    </Content>
    <ProductTour/>
  </div>;
}
