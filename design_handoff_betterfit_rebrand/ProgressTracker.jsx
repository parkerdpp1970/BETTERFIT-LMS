import React from 'react';
import { Icon } from '../core/Icon.jsx';
/** Stepper of units / stages. Each step: { label, meta?, state: 'done' | 'current' | 'refer' | 'todo' } */
export function ProgressTracker({ steps = [], vertical = false, className = '' }) {
  return (
    <ol className={['bf-tracker', vertical ? 'bf-tracker--vertical' : '', className].filter(Boolean).join(' ')} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {steps.map((s, i) => (
        <li key={i} className={['bf-tracker__step', s.state && s.state !== 'todo' ? 'bf-tracker__step--' + s.state : ''].filter(Boolean).join(' ')} aria-current={s.state === 'current' ? 'step' : undefined}>
          <span className="bf-tracker__line" aria-hidden="true" />
          <span className="bf-tracker__node">{s.state === 'done' ? <Icon name="check" size={16} strokeWidth={3} /> : s.state === 'refer' ? <Icon name="rotate-ccw" size={14} strokeWidth={3} /> : i + 1}</span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span className="bf-tracker__label">{s.label}</span>
            {s.meta ? <span className="bf-tracker__meta">{s.meta}</span> : null}
          </span>
        </li>
      ))}
    </ol>
  );
}
