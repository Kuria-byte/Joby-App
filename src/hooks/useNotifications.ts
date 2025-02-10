import { useState, useEffect, useCallback } from 'react';
import { requestNotificationPermission, subscribeToPushNotifications } from '../utils/notifications';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check initial permission status
    setPermission(Notification.permission);
    
    // Check if already subscribed
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(existingSubscription => {
          if (existingSubscription) {
            setSubscription(existingSubscription);
          }
        });
      });
    }
  }, []);

  const setupNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Request permission
      const newPermission = await requestNotificationPermission();
      setPermission(newPermission);

      if (newPermission === 'granted') {
        // Subscribe to push notifications
        const newSubscription = await subscribeToPushNotifications();
        setSubscription(newSubscription);
      } else if (newPermission === 'denied') {
        throw new Error('Notification permission denied');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to setup notifications';
      setError(errorMessage);
      console.error('Notification setup error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    permission,
    subscription,
    error,
    isLoading,
    setupNotifications
  };
}
