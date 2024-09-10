import { Schema } from "mongoose";

export type TNotification ={
    user:Schema.Types.ObjectId
    type:"connection" | "glucose" | "bloodPressure" | "weight" | "message";
    title?:string;
    message:string;
    isRead:boolean;
    link?:string;
}