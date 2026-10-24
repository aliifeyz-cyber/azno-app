import React from 'react';

export const Loading: React.FC<{ message?: string; fullScreen?: boolean }> = ({
  message = 'در حال بارگذاری...',
  fullScreen = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
      <div className="w-8 h-8 border-3 border-[#2F7D6D] border-t-transparent rounded-full animate-spin" />
      <span className="text-xs text-gray-500 font-medium">{message}</span>
    </div>
  );

  if (fullScreen) {
    return <div className="fixed inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-50">{content}</div>;
  }

  return content;
};
