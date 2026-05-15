import { HTMLAttributes, ReactNode } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md';
  children: ReactNode;
  className?: string;
}

export function Badge({ 
  variant = 'default', 
  size = 'sm',
  children, 
  className = '', 
  ...props 
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-secondary text-secondary-foreground border border-border/50',
    success: 'bg-[#59CF2A]/10 text-[#59CF2A] border border-[#59CF2A]/20',
    warning: 'bg-amber-100 text-amber-700 border border-amber-200',
    error: 'bg-red-100 text-red-700 border border-red-200',
    outline: 'bg-transparent text-muted-foreground border border-border'
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
