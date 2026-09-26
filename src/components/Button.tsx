import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
}

export default function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const styles = {
    primary: 'border border-sky-500/40 bg-sky-600 text-white hover:bg-sky-500 shadow-lg shadow-sky-500/20',
    secondary: 'border border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-600 hover:bg-slate-800',
    ghost: 'border border-transparent bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white',
  };

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-xl px-3.5 py-2 text-sm font-medium transition ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
