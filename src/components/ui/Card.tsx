import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function Card({ children, className, padding = 'md', hover = false }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'glass-card rounded-2xl',
        paddings[padding],
        hover && 'transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:border-slate-700 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
