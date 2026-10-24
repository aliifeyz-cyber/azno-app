import React from 'react';
import { AznoHero, AzmanPose } from './AznoHero';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  heroPose?: AzmanPose;
  heroName?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  heroPose = 'calm',
  heroName,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center my-6">
      <AznoHero pose={heroPose} size={110} name={heroName} />
      <h3 className="text-base font-bold text-gray-800 mt-4">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mt-1 max-w-xs">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
