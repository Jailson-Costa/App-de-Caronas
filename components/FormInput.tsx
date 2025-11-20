
import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

export const FormInput: React.FC<FormInputProps> = ({ label, name, type = 'text', ...props }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-2 font-semibold text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-primary-focus transition duration-200"
        {...props}
      />
    </div>
  );
};
