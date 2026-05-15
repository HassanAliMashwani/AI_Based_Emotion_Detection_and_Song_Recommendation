import { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}

export function Card({ 
  variant = 'default', 
  padding = 'md',
  children, 
  className = '', 
  ...props 
}: CardProps) {
  const baseStyles = 'rounded-[1.5rem] overflow-hidden transition-all duration-300';
  
  const variants = {
    default: 'bg-card border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
    glass: 'bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.06)]'
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8 md:p-10'
  };

  const classes = `${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
