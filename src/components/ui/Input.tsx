'use client';
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  showToggle?: boolean;
  showPassword?: boolean;
  onTogglePasswordVisibility?: () => void;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      className = '',
      showToggle = false,
      showPassword = false,
      onTogglePasswordVisibility,
      ...props
    },
    ref
  ) => {
    const isPasswordField = type === 'password' && showToggle;

    return (
      <div className={`relative ${className}`}>
        <input
          ref={ref}
          type={isPasswordField && showPassword ? 'text' : type}
          className={`
      w-full px-3 py-2 border border-gray-300 rounded-md 
             focus:outline-none focus:ring-0 focus:border-2 text-black
            ${isPasswordField ? 'pr-12' : ''}
          `}
          {...props}
        />

        {isPasswordField && onTogglePasswordVisibility && (
          <div
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            onClick={onTogglePasswordVisibility}
          >
            {showPassword ? <EyeOff className="text-gray-500" /> : <Eye className="text-gray-500" />}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
