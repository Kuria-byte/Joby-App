import { toast } from 'react-toastify';

interface ErrorLog {
  timestamp: string;
  error: string;
  componentName: string;
  userId?: string;
  additionalInfo?: Record<string, unknown>;
}

const errorLogs: ErrorLog[] = [];

export const logError = (
  error: Error,
  componentName: string,
  userId?: string,
  additionalInfo?: Record<string, unknown>
) => {
  const errorLog: ErrorLog = {
    timestamp: new Date().toISOString(),
    error: error.message,
    componentName,
    userId,
    additionalInfo,
  };

  errorLogs.push(errorLog);
  console.error('Error occurred:', errorLog);

  // In production, you might want to send this to your error tracking service
  // Example: Sentry.captureException(error, { extra: errorLog });
};

export const getUserFriendlyMessage = (error: Error): string => {
  // Add specific error message mappings based on your API error codes
  if (error.message.includes('Network')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  if (error.message.includes('401')) {
    return 'Your session has expired. Please log in again.';
  }
  if (error.message.includes('429')) {
    return 'Too many requests. Please try again in a moment.';
  }
  
  // Default message for unknown errors
  return 'Something went wrong. Please try again later.';
};

export const showErrorToast = (error: Error) => {
  const message = getUserFriendlyMessage(error);
  toast.error(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
