import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface PelicanButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const PelicanButton = forwardRef<HTMLButtonElement, PelicanButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variants = {
      primary: 'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] shadow-md',
      secondary: 'bg-transparent border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-hover)]',
      ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]',
      danger: 'bg-[#E06565]/10 text-[#E06565] border border-[#E06565]/20 hover:bg-[#E06565]/20',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-sm rounded-lg',
      lg: 'px-6 py-2.5 text-base rounded-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium',
          'transition-all duration-150 ease-out',
          'active:scale-[0.98]',
          'disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

PelicanButton.displayName = 'PelicanButton';
export { PelicanButton };
