import { Schema } from "mongoose";

export type TConnection = {
    patient: Schema.Types.ObjectId;
    doctor: Schema.Types.ObjectId;
    status: TConnectionStatus;
}


export type TConnectionStatus = "pending" | "accept" | "reject"