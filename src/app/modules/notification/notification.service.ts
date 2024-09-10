import { TNotification } from "./notification.interface"

const createNotificationIntoDb = async(userId:string,payload:TNotification) => {
console.log(userId,payload)

}
export const NotificationServices = {
    createNotificationIntoDb
}

