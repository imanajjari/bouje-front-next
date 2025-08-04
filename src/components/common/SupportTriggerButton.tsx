// components/common/SupportTriggerButton.tsx
'use client';

import { HelpCircle } from "lucide-react";

interface SupportTriggerButtonProps {
  onClick: () => void;
  title?: string;
  className?: string;
}

const SupportTriggerButton = ({ onClick, title = "راهنمایی پشتیبانی", className = "" }: SupportTriggerButtonProps) => {
  return (
    <button 
      onClick={onClick} 
      className={`absolute left-3 top-3 ${className}`}
      title={title}
    >
      <HelpCircle size={18} className="text-gray-500" />
    </button>
  );
};

export default SupportTriggerButton;
