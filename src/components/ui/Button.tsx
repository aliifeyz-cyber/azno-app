import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-colors select-none focus:outline-none';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }[size];

  const variantClasses = {
    primary: 'bg-[#2F7D6D] text-white hover:bg-[#256658] active:bg-[#1D5348] disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-emerald-50 text-[#2F7D6D] hover:bg-emerald-100 disabled:opacity-50',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50',
    danger: 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 disabled:opacity-50',
    ghost: 'text-gray-600 hover:bg-gray-100 disabled:opacity-50',
  }[variant];

  return (
    <button
      className={`${base} ${sizeClasses} ${variantClasses} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>در حال پردازش...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
