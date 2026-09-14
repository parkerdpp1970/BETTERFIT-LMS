import React from 'react';
import { Icon } from '../core/Icon.jsx';
const MAP = {
  pass: { cls: 'pass', icon: 'check', text: 'Pass' },
  passed: { cls: 'pass', icon: 'check', text: 'Passed' },
  refer: { cls: 'refer', icon: 'rotate-ccw', text: 'Refer' },
  referral: { cls: 'refer', icon: 'rotate-ccw', text: 'Referral' },
  pending: { cls: 'pending', icon: 'clock', text: 'Pending' },
  submitted: { cls: 'submitted', icon: 'send', text: 'Submitted' },
  'in progress': { cls: 'progress', icon: 'loader', text: 'In progress' },
  'not started': { cls: 'neutral', icon: null, text: 'Not started' },
};
/** Assessment outcome badge. Always pairs colour with an icon + word so meaning never relies on colour alone. */
export function ResultBadge({ status = 'pending', label, solid = false, size = 'md', icon = true, className = '' }) {
  const m = MAP[String(status).toLowerCase()] || MAP.pending;
  const cls = ['bf-badge', 'bf-badge--' + m.cls, solid ? 'bf-badge--solid' : '', size === 'lg' ? 'bf-badge--lg' : '', className].filter(Boolean).join(' ');
  return <span className={cls}>{icon ? (m.icon ? <Icon name={m.icon} size={size === 'lg' ? 16 : 14} strokeWidth={2.5} /> : <span className="bf-badge__dot" />) : null}<span>{label || m.text}</span></span>;
}
