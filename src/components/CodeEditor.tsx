import { useEffect, useRef, type KeyboardEvent } from 'react';
import { examplePrograms } from '../examples/examplePrograms';
import { Icon } from './Icon';
import {useI18n} from '../i18n/i18n';

function highlight(line: string) {
  const parts = line.split(/(#.*$|%[a-z]+|\$[+-]?(?:0x[\da-f]+|\d+)|\b(?:movq|pushq|popq|addq|subq|imulq|shlq|mulq|incq|decq|leaq|call|ret)\b|[A-Za-z_.][\w.]*:)/gi);
  return parts.map((part, index) => <span key={index} className={part.startsWith('#') ? 'syntax-comment' : part.startsWith('%') ? 'syntax-register' : part.startsWith('$') ? 'syntax-number' : part.endsWith(':') ? 'syntax-label' : /^(movq|pushq|popq|addq|subq|imulq|shlq|mulq|incq|decq|leaq|call|ret)$/.test(part) ? 'syntax-instruction' : undefined}>{part}</span>);
}
interface Props {source: string; currentLine?: number; errorLine?: number; dirty: boolean; saved: boolean; onChange: (value: string) => void; onExample: (source: string) => void; onCreate: () => void;}
export function CodeEditor({source, currentLine, errorLine, dirty, saved, onChange, onExample, onCreate}: Props) {
  const {t,lt}=useI18n();
  const scroller = useRef<HTMLDivElement>(null);
  const editor = useRef<HTMLTextAreaElement>(null);
  const lines = source.split('\n');
  const example = examplePrograms.find(item => item.source === source);
  useEffect(() => {
    if (!currentLine || !scroller.current) return;
    const top = (currentLine - 1) * 28 + 16;
    const view = scroller.current;
    if (top < view.scrollTop || top + 28 > view.scrollTop + view.clientHeight) view.scrollTop = Math.max(0, top - view.clientHeight / 2);
  }, [currentLine]);
  function handleTab(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Tab' || event.shiftKey) return;
    event.preventDefault();
    const start = event.currentTarget.selectionStart;
    const end = event.currentTarget.selectionEnd;
    onChange(source.slice(0, start) + '    ' + source.slice(end));
    requestAnimationFrame(() => editor.current?.setSelectionRange(start + 4, start + 4));
  }
  function createBlankProgram(){onCreate();editor.current?.focus();requestAnimationFrame(()=>editor.current?.focus());}
  return <section className="panel editor-panel" aria-labelledby="editor-heading">
    <div className="panel-heading"><h2 id="editor-heading"><Icon name="code"/>{t('assembly.program')}</h2><span className="small-label">AT&amp;T syntax</span></div>
    <div className="editor-toolbar"><span className="file-tab"><span className="file-icon">S</span>{example ? `${example.id.replaceAll('-', '_')}.s` : 'program.s'}{dirty && <i title="Changes need to be loaded"/>}</span>
      <div className="editor-toolbar-actions"><button className="editor-create" type="button" onClick={createBlankProgram}>{t('assembly.create')}</button><label className="example-select"><span className="sr-only">{t('assembly.exampleProgram')}</span><select value={example?.id ?? ''} onChange={event => {const selected = examplePrograms.find(item => item.id === event.target.value); if (selected) onExample(selected.source);}}><option value="" disabled>{t('assembly.examples')}</option>{examplePrograms.map(item => <option key={item.id} value={item.id}>{lt(item.name)}</option>)}</select></label></div>
    </div>
    <div className="code-scroller" ref={scroller}>
      <div className="code-canvas" style={{minHeight: `${Math.max(12, lines.length) * 28 + 32}px`, minWidth: `max(100%, ${Math.max(42, ...lines.map(line => line.length)) * 8.43 + 86}px)`}}>
        {lines.map((_, index) => <div key={index} className={`code-line-marker ${!dirty && currentLine === index + 1 ? 'current' : ''} ${errorLine === index + 1 ? 'line-error' : ''}`} style={{top: index * 28 + 16}} aria-hidden="true"><span>{!dirty && currentLine === index + 1 ? <span className="execution-arrow">›</span> : null}{index + 1}</span>{!dirty && currentLine === index + 1 && <span className="line-status">NEXT</span>}</div>)}
        <pre className="code-highlight" aria-hidden="true">{lines.map((line, index) => <span className="source-line" key={index}>{highlight(line)}{'\n'}</span>)}</pre>
        <textarea ref={editor} className="code-input" aria-label={t('assembly.programAria')} aria-describedby="editor-hint" value={source} onChange={event => onChange(event.target.value)} onKeyDown={handleTab} spellCheck={false} autoCapitalize="off" autoComplete="off" autoCorrect="off" wrap="off"/>
      </div>
    </div>
    <div className="editor-footer"><span>{t('assembly.lineCount',{count:lines.length})}<span className="footer-dot">·</span>UTF-8</span><span className={saved ? '' : 'warning-text'}>{dirty ? t('assembly.edited') : saved ? t('assembly.saved') : t('assembly.savingUnavailable')}</span></div>
    <div id="editor-hint" className="editor-help"><Icon name="bulb" size={16}/><span>{example?lt(example.description):t('assembly.editorHint')}</span></div>
  </section>;
}
