import * as admin from 'firebase-admin';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import { firebaseConfig } from '../firebase';
admin.initializeApp({
  credential: admin.credential.cert(
    firebaseConfig,
  ),
});

type NotificationPayload = {
  title: string;
  body: string;
  data?: { [key: string]: string };
};

export const sendNotification = async (
  fcmToken: string[],
  payload: NotificationPayload,
): Promise<any> => {
  // console.log(fcmToken, 'fcmTokenfcmToken');
  // console.log(payload, 'payload');
  try {
    const response = await admin.messaging().sendEachForMulticast({
      tokens: fcmToken,

      notification: {
        title: payload.title,
        body: payload.body,
      },

      apns: {
        headers: {
          'apns-push-type': 'alert',
        },
        payload: {
          aps: {
            badge: 1,
            sound: 'default',
          },
        },
      },

      // data: payload?.data,
    });
    return response;
  } catch (error: any) {
    console.error('Error sending message:', error);
    if (error?.code === 'messaging/third-party-auth-error') {
      // console.error('Skipping iOS token due to auth error:', error);
      return null;
    } else {
      console.error('Error sending message:', error);
      throw new AppError(
        httpStatus.NOT_IMPLEMENTED,
        'Failed to send notification',
      );
    }
  }
};
