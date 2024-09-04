import { model, Schema } from "mongoose";
import { TGlucose } from "./glucose.interface";

// Schema for Glucose
const glucoseSchema = new Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    label: { type: String, required: true },
    data: { type: Number, required: true },
}, {
    timestamps: true, 
});

export const GlucoseModel = model<TGlucose>('Glucose', glucoseSchema);