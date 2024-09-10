import { Document, Schema } from "mongoose";

export interface TGlucose extends Document  {
    user:Schema.Types.ObjectId
    date: string;
    time: string;
    label:string;
    data:number;
}