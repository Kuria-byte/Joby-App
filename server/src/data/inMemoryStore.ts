interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
}

interface Swipe {
  userId: string;
  jobId: string;
  direction: 'left' | 'right';
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

export const store = {
  users: new Map<string, User>(),
  jobs: new Map<string, Job>(),
  swipes: new Map<string, Swipe[]>(),
  messages: new Map<string, Message[]>(),
};

export const getNextId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
