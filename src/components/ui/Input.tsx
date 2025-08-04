import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`border text-right border-gray-300 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-black transition ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
