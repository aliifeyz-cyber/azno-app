import React from 'react';

export interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'info' | 'success' | 'warning' | 'error';
  visible: boolean;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  actionLabel,
  onAction,
  type = 'info',
  visible,
}) => {
  if (!visible) return null;

  const bgStyles = {
    info: 'bg-gray-900 text-white',
    success: 'bg-[#2F7D6D] text-white',
    warning: 'bg-amber-600 text-white',
    error: 'bg-rose-600 text-white',
  }[type];

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div
        className={`pointer-events-auto max-w-md w-full flex items-center justify-between px-4 py-3 rounded-xl shadow-none text-xs font-medium border border-black/10 ${bgStyles} transition-all`}
      >
        <span className="truncate ml-2">{message}</span>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="text-white underline font-bold px-2 py-0.5 rounded hover:bg-white/10 shrink-0 text-xs"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
