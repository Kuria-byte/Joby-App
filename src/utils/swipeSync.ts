interface SwipeAction {
  jobId: string;
  direction: 'left' | 'right';
}

class SwipeSync {
  private static isOnline(): boolean {
    return navigator.onLine;
  }

  static async performSwipe(jobId: string, direction: 'left' | 'right'): Promise<Response> {
    const swipeData = {
      jobId,
      direction,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/swipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(swipeData),
      });

      return response;
    } catch (error) {
      if (!this.isOnline()) {
        // If offline, the service worker will handle queueing
        return new Response('Queued for sync', { status: 202 });
      }
      throw error;
    }
  }

  static async registerSyncListener(callback: (event: MessageEvent) => void): Promise<void> {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      
      // Request background sync permission if needed
      if ('sync' in registration) {
        try {
          await registration.sync.register('swipeQueue');
        } catch (err) {
          console.warn('Background sync could not be registered:', err);
        }
      }

      // Listen for sync completion messages
      navigator.serviceWorker.addEventListener('message', callback);
    }
  }
}

export default SwipeSync;
