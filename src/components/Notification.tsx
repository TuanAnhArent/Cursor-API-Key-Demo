'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export function Notification({ type, message, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500/10' : 'bg-red-500/10';
  const textColor = type === 'success' ? 'text-green-400' : 'text-red-400';
  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className={`fixed top-4 right-4 ${bgColor} ${textColor} p-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md animate-slide-in`}>
      <Icon size={20} />
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-auto hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
} 