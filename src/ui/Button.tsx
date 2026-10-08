import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-xs rounded-md',
    md: 'h-10 px-4 text-sm rounded-lg',
    lg: 'h-12 px-6 text-base rounded-xl font-semibold',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white shadow-xs focus:ring-2 focus:ring-[var(--brand-600)] focus:ring-offset-2',
    secondary:
      'bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--text)] border border-[var(--border-strong)] shadow-xs',
    outline:
      'bg-transparent hover:bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-600)]',
    danger:
      'bg-[var(--danger)] hover:bg-[#911c13] text-white shadow-xs focus:ring-2 focus:ring-[var(--danger)] focus:ring-offset-2',
    success:
      'bg-[var(--success)] hover:bg-[#104b2b] text-white shadow-xs focus:ring-2 focus:ring-[var(--success)] focus:ring-offset-2',
    ghost:
      'bg-transparent hover:bg-[var(--surface-muted)] text-[var(--text-secondary)]',
  };

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer active:scale-[0.98] transition-all duration-150';

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-medium tracking-wide ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
