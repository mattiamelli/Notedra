import {Component,lazy,Suspense,useState,type ReactNode} from 'react';
import {LearningProvider} from '../learning/LearningProvider';
import {configuredCloud} from '../cloud/config';
import {AccountContext,anonymousState} from './context';
import {useI18n} from '../i18n/i18n';
const ConfiguredAccountRoot=lazy(()=>import('./ConfiguredAccountRoot'));
const config=configuredCloud();
export function AccountRoot({children}:{children:ReactNode}) {
  const {t}=useI18n();
  const [local,setLocal]=useState(false);
  const fallback=<LocalProfile message={t('account.optionalUnavailable')}>{children}</LocalProfile>;
  if(config.status==='configured'&&!local)return <OptionalBoundary fallback={fallback}><Suspense fallback={<main className="ds-bootstrap"><p role="status">{t('account.opening')}</p><button onClick={()=>setLocal(true)}>{t('account.continueAnonymous')}</button></main>}><ConfiguredAccountRoot config={config}>{children}</ConfiguredAccountRoot></Suspense></OptionalBoundary>;
  if(local)return fallback;
  return <LocalProfile message={config.status==='configured'?t('account.localOnly'):config.message}>{children}</LocalProfile>;
}
function LocalProfile({children,message}:{children:ReactNode;message:string}) {return <AccountContext.Provider value={{config:{status:'unavailable',message},auth:null,state:anonymousState,syncStatus:'Local only',syncMessage:message,sync:null,adopt:null}}><LearningProvider>{children}</LearningProvider></AccountContext.Provider>;}
class OptionalBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?this.props.fallback:this.props.children;}
}
