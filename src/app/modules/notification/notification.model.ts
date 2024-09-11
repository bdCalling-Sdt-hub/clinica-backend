import { model, Schema } from "mongoose";
import { TNotification } from "./notification.interface";

const NotificationSchema = new Schema<TNotification>(
    {
        user:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
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
        },
        date:{
            type:Date,
            default:new Date()
        },
        time:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
)


const NotificationModel = model<TNotification>("Notification", NotificationSchema);
export default NotificationModel