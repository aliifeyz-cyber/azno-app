import React from 'react';
import { Button } from './Button';

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  message = 'مشکلی در بارگذاری داده‌ها رخ داده است.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center my-4">
      <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-3">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p className="text-sm text-gray-700 font-medium mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          تلاش دوباره
        </Button>
      )}
    </div>
  );
};
