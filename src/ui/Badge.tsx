import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
  icon,
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-[var(--success-light)] text-[var(--success)] border-[var(--success)]/30',
    warning: 'bg-[var(--warning-light)] text-[var(--warning)] border-[var(--warning)]/30',
    danger: 'bg-[var(--danger-light)] text-[var(--danger)] border-[var(--danger)]/30',
    info: 'bg-[var(--info-light)] text-[var(--info)] border-[var(--info)]/30',
    neutral: 'bg-[var(--surface-muted)] text-[var(--text-secondary)] border-[var(--border)]',
    brand: 'bg-[var(--brand-50)] text-[var(--brand-700)] border-[var(--brand-600)]/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="inline-block shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
