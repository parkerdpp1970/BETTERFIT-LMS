import React from 'react';
import { Icon } from '../core/Icon.jsx';
const KEYS = 'ABCDEFGH';
/**
 * Multiple-choice question. options: string[] or {id,text}[]. Controlled via value/onChange (single) or values/onChange (multi).
 * Pass result="correct"|"incorrect" + correctIds after submit to reveal marking.
 */
export function QuizQuestion({ index, total, question, options = [], value, values, onChange, multi = false, disabled = false, revealed = false, correctIds = [], feedback, hint, className = '' }) {
  const opts = options.map((o, i) => typeof o === 'string' ? { id: String(i), text: o } : o);
  const selected = new Set(multi ? (values || []) : (value != null ? [value] : []));
  const correct = new Set((correctIds || []).map(String));
  const toggle = (id) => {
    if (disabled || revealed || !onChange) return;
    if (multi) { const n = new Set(selected); n.has(id) ? n.delete(id) : n.add(id); onChange(Array.from(n)); } else onChange(id);
  };
  const allRight = revealed && opts.every(o => correct.has(String(o.id)) === selected.has(o.id));
  return (
    <div className={['bf-quiz', className].filter(Boolean).join(' ')} role="group" aria-labelledby={'q' + index}>
      {(index != null || hint) ? <div className="bf-quiz__meta"><span>{index != null ? 'Question ' + index + (total ? ' of ' + total : '') : ''}</span><span>{hint || (multi ? 'Select all that apply' : 'Select one')}</span></div> : null}
      <h3 id={'q' + index} className="bf-quiz__question">{question}</h3>
      <div className="bf-quiz__options">
        {opts.map((o, i) => {
          const isSel = selected.has(o.id), isCor = correct.has(String(o.id));
          let state = '';
          if (revealed) { if (isSel && isCor) state = 'correct'; else if (isSel && !isCor) state = 'incorrect'; else if (!isSel && isCor) state = 'correct'; }
          else if (isSel) state = 'selected';
          return (
            <button key={o.id} type="button" role={multi ? 'checkbox' : 'radio'} aria-checked={isSel} disabled={disabled || revealed} onClick={() => toggle(o.id)} className={['bf-answer', state ? 'bf-answer--' + state : ''].filter(Boolean).join(' ')}>
              <span className="bf-answer__key" aria-hidden="true">{KEYS[i]}</span>
              <span className="bf-answer__text">{o.text}</span>
              <span className="bf-answer__icon" aria-hidden="true">{state === 'correct' ? <Icon name="check-circle-2" size={22} /> : state === 'incorrect' ? <Icon name="x-circle" size={22} /> : state === 'selected' ? <Icon name="check" size={20} strokeWidth={2.5} /> : null}</span>
            </button>
          );
        })}
      </div>
      {revealed && feedback ? <div className={'bf-quiz__feedback bf-quiz__feedback--' + (allRight ? 'correct' : 'incorrect')} role="status"><Icon name={allRight ? 'check-circle-2' : 'info'} size={20} /><span>{feedback}</span></div> : null}
    </div>
  );
}
