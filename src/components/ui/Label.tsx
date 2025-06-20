import React from 'react';

type LabelProps = {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
};

const Label: React.FC<LabelProps> = ({ htmlFor, children, className = '' }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-base font-medium text-gray-700 mb-2 ${className}`}
    >
      {children}
    </label>
  );
};

export default Label;
