
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center px-6 py-4 
        font-semibold text-white 
        bg-primary rounded-lg 
        shadow-md hover:bg-primary-hover 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus 
        disabled:bg-slate-400 disabled:cursor-not-allowed
        transition-all duration-300 ease-in-out
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
