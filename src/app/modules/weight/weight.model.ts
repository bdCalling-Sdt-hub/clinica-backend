import { model, Schema } from "mongoose";
import { TWeight } from "./weight.interface";

// Schema for Weight
const weightSchema = new Schema<TWeight>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, },
    date: { type: String, required: true },
    time: { type: String, required: true },
    weight: { type: Number, required: true },
}, {
    timestamps: true, 
});

export const WeightModel = model<TWeight>('Weight', weightSchema);