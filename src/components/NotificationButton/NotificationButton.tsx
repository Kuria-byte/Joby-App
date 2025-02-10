import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { BellIcon, BellSlashIcon } from '@heroicons/react/24/outline';

interface NotificationButtonProps {
  className?: string;
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({ className = '' }) => {
  const { permission, error, isLoading, setupNotifications } = useNotifications();

  const handleClick = async () => {
    if (permission === 'default') {
      await setupNotifications();
    }
  };

  if (error) {
    return (
      <div className="flex items-center text-red-500" title={error}>
        <BellSlashIcon className="w-6 h-6" />
        <span className="ml-2 text-sm">Notification Error</span>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="flex items-center text-gray-500" title="Please enable notifications in your browser settings">
        <BellSlashIcon className="w-6 h-6" />
        <span className="ml-2 text-sm">Notifications Blocked</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || permission === 'granted'}
      className={`inline-flex items-center px-4 py-2 rounded-md transition-colors ${
        permission === 'granted'
          ? 'bg-green-100 text-green-800'
          : isLoading
          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      } ${className}`}
    >
      <BellIcon className="w-5 h-5" />
      <span className="ml-2">
        {isLoading
          ? 'Enabling...'
          : permission === 'granted'
          ? 'Notifications Enabled'
          : 'Enable Notifications'}
      </span>
    </button>
  );
};
