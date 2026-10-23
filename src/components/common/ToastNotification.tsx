import React from 'react';
import { StreamlineIcon } from './StreamlineIcon';

export interface ToastData {
  title: string;
  description: string;
  type?: string;
}

interface ToastNotificationProps {
  toast: ToastData | null;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-[calc(100%-2rem)] bg-[#0A3630] text-[#F5F0E6] border border-[#19574E] rounded-xl shadow-xl p-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h4 className="text-xs font-semibold text-[#F5F0E6]">{toast.title}</h4>
        <p className="text-[11px] text-[#C5D6D1] mt-0.5 leading-snug">{toast.description}</p>
      </div>
      <button onClick={onClose} className="text-[#C5D6D1] hover:text-white p-1">
        <StreamlineIcon name="close" className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
