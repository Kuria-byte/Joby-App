import webpush from 'web-push';
import PushSubscription, { IPushSubscription } from '../models/PushSubscription';
import { Types } from 'mongoose';

// Configure web-push with your VAPID keys
webpush.setVapidDetails(
  'mailto:ianmwitumi@gmail.com', // Replace with your email
  'BIN_xlRHa8M_qqlgz1vlxhdQTVfPKLwY85ZlR3HdVi3v2c1-__GpX_E8rkhCGqLnw_43-V5vEh519E8UTVX1AyQ',
  'OAwyZuGvQOcEUVMVoiDL5fPphvY_13t6qF0EVdYRSkw'
);

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  data?: {
    type: 'job_match' | 'chat_message';
    url: string;
    [key: string]: any;
  };
}

class NotificationService {
  async saveSubscription(userId: string, subscription: webpush.PushSubscription): Promise<IPushSubscription> {
    const subscriptionData = {
      userId: new Types.ObjectId(userId),
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth
      }
    };

    // Update if exists, insert if doesn't
    return await PushSubscription.findOneAndUpdate(
      { userId: subscriptionData.userId, endpoint: subscriptionData.endpoint },
      subscriptionData,
      { upsert: true, new: true }
    );
  }

  async sendNotification(userId: string, payload: NotificationPayload): Promise<void> {
    const subscriptions = await PushSubscription.find({ userId: new Types.ObjectId(userId) });

    const notifications = subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: subscription.keys
          },
          JSON.stringify(payload)
        );
      } catch (error) {
        if (error.statusCode === 410 || error.statusCode === 404) {
          // Subscription has expired or is invalid
          await PushSubscription.deleteOne({ _id: subscription._id });
        } else {
          console.error('Error sending notification:', error);
        }
      }
    });

    await Promise.all(notifications);
  }

  async sendJobMatchNotification(userId: string, jobId: string, jobTitle: string): Promise<void> {
    await this.sendNotification(userId, {
      title: 'New Job Match!',
      body: `A new job matching your skills: ${jobTitle}`,
      icon: '/logo192.png',
      data: {
        type: 'job_match',
        url: `/jobs/${jobId}`,
        jobId
      }
    });
  }

  async sendChatMessageNotification(userId: string, senderId: string, senderName: string, message: string): Promise<void> {
    await this.sendNotification(userId, {
      title: 'New Message',
      body: `${senderName}: ${message}`,
      icon: '/logo192.png',
      data: {
        type: 'chat_message',
        url: `/chat/${senderId}`,
        senderId
      }
    });
  }
}

export default new NotificationService();
