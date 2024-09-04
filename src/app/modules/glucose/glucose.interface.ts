import { Schema } from "mongoose";

export type TGlucose = {
    user:Schema.Types.ObjectId
    date: string;
    time: string;
    label:string;
    data:number;
}