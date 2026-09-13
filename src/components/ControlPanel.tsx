import { Icon } from './Icon';
import {useI18n} from '../i18n/i18n';
interface Props {
  dirty: boolean; running: boolean; halted: boolean; hasError: boolean; cursor: number; rip: number; count: number;
  onLoad: () => void; onPrevious: () => void; onNext: () => void; onRun: () => void; onPause: () => void; onReset: () => void;
}
export function ControlPanel(props: Props) {
  const {t}=useI18n();
  const locked = props.dirty || props.hasError;
  return <div className="control-panel">
    <div className="control-buttons">
      <button className="button load-button" onClick={props.onLoad} title={t('assembly.loadTitle')}><Icon name="load"/>{t('assembly.load')}</button>
      <span className="control-divider"/>
      <button className="button" onClick={props.onPrevious} disabled={props.cursor === 0 || props.dirty} title={t('assembly.previousTitle')}><Icon name="previous"/>{t('assembly.previous')}</button>
      <button className="button primary" onClick={props.onNext} disabled={locked || props.halted || props.running} title={t('assembly.nextTitle')}><Icon name="next"/>{t('assembly.next')}</button>
      <button className="button" onClick={props.onRun} disabled={locked || props.halted || props.running}><Icon name="play"/>{t('assembly.run')}</button>
      <button className="button" onClick={props.onPause} disabled={!props.running} title={t('assembly.pauseTitle')}><Icon name="pause"/>{t('assembly.pause')}</button>
      <button className="button reset-button" onClick={props.onReset}><Icon name="reset"/>{t('assembly.reset')}</button>
    </div>
    <div className="instruction-counter"><span className={`status-dot ${props.running ? 'is-running' : ''}`}/><span>{props.halted ? t('assembly.complete') : t('assembly.instruction',{current:props.rip+1,count:props.count})}</span><span className="counter-separator">·</span><span className="muted">{t('assembly.executed',{count:props.cursor})}</span></div>
  </div>;
}
