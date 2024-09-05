import { model, Schema } from "mongoose";
import { TNotification } from "./notification.interface";

const NotificationSchema = new Schema<TNotification>(
    {
        type:{
            type:String,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        message:{
            type:String,
            required:true
        },
        isRead:{
            type:Boolean,
            default:false
        },
        link:{
            type:String,
            default:null
        }
    },
    {
        timestamps:true
    }
)


const NotificationModel = model<TNotification>("Notification", NotificationSchema);
export default NotificationModel