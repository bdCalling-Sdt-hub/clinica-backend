import { getMessaging } from "firebase-admin/messaging";
import NotificationModel from "./notification.model";


const createNotificationIntoDb = async(userId:string) => {

// This registration token comes from the client FCM SDKs.
const registrationToken = 'YOUR_REGISTRATION_TOKEN';
const message = {
  data: {
    score: '850',
    time: '2:45'
  },
  token: registrationToken
};

// Send a message to the device corresponding to the provided
// registration token.

getMessaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });
}


const getNotificationFromDb = async(fcmToken:string) => { 
  const result = await NotificationModel.find({fcmToken}).select("-fcmToken -date -time").lean();
  return result
}


const readNotificationFromDb = async(fcmToken:string) => { 
  const result = await NotificationModel.updateMany({fcmToken},{isRead:true}).lean();
  return result
}

export const NotificationServices = {
    createNotificationIntoDb,
    getNotificationFromDb,
    readNotificationFromDb
}

