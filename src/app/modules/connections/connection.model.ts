import { model, Schema } from "mongoose";
import { TConnection } from "./connection.interface";

const connectionSchema = new Schema<TConnection>(
    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        doctor: {
            type: Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accept", "reject"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);


const ConnectionModel = model<TConnection>("Connection", connectionSchema);

export default ConnectionModel