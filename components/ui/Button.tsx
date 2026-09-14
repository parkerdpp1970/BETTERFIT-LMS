import React from 'react';
import { ArrowRight, type LucideIcon } from 'lucide-react';

type ButtonVariant = 'filled' | 'tonal' | 'secondary' | 'outlined' | 'text' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

// Full class names (not built from strings) so Tailwind keeps the matching .bf-btn rules in the build.
const variantClasses: Record<ButtonVariant, string> = {
  filled: 'bf-btn--filled',
  tonal: 'bf-btn--tonal',
  secondary: 'bf-btn--secondary',
  outlined: 'bf-btn--outlined',
  text: 'bf-btn--text',
  danger: 'bf-btn--danger',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'bf-btn--sm',
  md: '',
  lg: 'bf-btn--lg',
};

const iconSizes: Record<ButtonSize, number> = { sm: 16, md: 18, lg: 22 };

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Filled buttons slide the label out and an arrow in on hover/focus. Turn off for in-place actions (save, export, cancel). */
  arrow?: boolean;
  icon?: LucideIcon;
  trailingIcon?: LucideIcon;
  /** Square icon-only button; pass an aria-label. */
  iconOnly?: boolean;
  block?: boolean;
  loading?: boolean;
  /** Renders a link styled as a button. */
  href?: string;
  target?: string;
  rel?: string;
}

/** BETTERFIT button: solid crimson filled primary, plus tonal, secondary (near-black), outlined, text and danger variants. */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'filled',
  size = 'md',
  arrow = true,
  icon: Icon,
  trailingIcon: TrailingIcon,
  iconOnly = false,
  block = false,
  loading = false,
  disabled = false,
  type = 'button',
  href,
  target,
  rel,
  className = '',
  onClick,
  ...rest
}) => {
  const showArrow = variant === 'filled' && arrow && !loading && !iconOnly;
  const classes = [
    'bf-btn',
    variantClasses[variant],
    sizeClasses[size],
    iconOnly ? 'bf-btn--icononly' : '',
    block ? 'bf-btn--block' : '',
    showArrow ? 'bf-btn--arrow' : '',
    className,
  ].filter(Boolean).join(' ');
  const iconSize = iconSizes[size];

  const content = (
    <>
      <span className="bf-btn__label">
        {loading ? (
          <span className="bf-btn__spinner" aria-hidden="true" />
        ) : Icon ? (
          <Icon size={iconSize} aria-hidden="true" />
        ) : null}
        {children != null && <span>{children}</span>}
        {TrailingIcon && !loading ? <TrailingIcon size={iconSize} aria-hidden="true" /> : null}
      </span>
      {showArrow && (
        <span className="bf-btn__arrow" aria-hidden="true">
          <ArrowRight size={size === 'lg' ? 26 : 22} strokeWidth={2.5} />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={classes}
        aria-label={rest['aria-label']}
        aria-disabled={disabled || undefined}
        onClick={disabled ? (e) => e.preventDefault() : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onClick}
      {...rest}
    >
      {content}
    </button>
  );
};

export default Button;
