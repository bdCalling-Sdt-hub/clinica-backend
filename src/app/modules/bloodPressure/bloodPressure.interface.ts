import { Schema } from "mongoose";

export type TBloodPressure = {
    user: Schema.Types.ObjectId;
    date: string ;
    time:string;
    systolic: number;
    diastolic: number;
}