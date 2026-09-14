import React from 'react';
import { Icon } from '../core/Icon.jsx';
/** Graded pink-red primary button. On hover/focus the label slides away and an arrow slides in (variant="filled" with arrow). */
export function Button({ children, variant = 'filled', size = 'md', arrow = true, icon, trailingIcon, block = false, loading = false, disabled = false, type = 'button', href, onClick, className = '', style, ...rest }) {
  const Tag = href ? 'a' : 'button';
  const cls = ['bf-btn', 'bf-btn--' + variant, size !== 'md' ? 'bf-btn--' + size : '', block ? 'bf-btn--block' : '', variant === 'filled' && arrow && !loading ? 'bf-btn--arrow' : '', className].filter(Boolean).join(' ');
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;
  return (
    <Tag className={cls} disabled={Tag === 'button' ? disabled || loading : undefined} aria-disabled={Tag === 'a' && disabled ? 'true' : undefined} aria-busy={loading || undefined} type={Tag === 'button' ? type : undefined} href={href} onClick={disabled ? undefined : onClick} style={style} {...rest}>
      <span className="bf-btn__label">
        {loading ? <span className="bf-btn__spinner" aria-hidden="true" /> : icon ? <Icon name={icon} size={iconSize} /> : null}
        <span>{children}</span>
        {trailingIcon && !loading ? <Icon name={trailingIcon} size={iconSize} /> : null}
      </span>
      {variant === 'filled' && arrow ? <span className="bf-btn__arrow" aria-hidden="true"><Icon name="arrow-right" size={size === 'lg' ? 26 : 22} strokeWidth={2.5} /></span> : null}
    </Tag>
  );
}
