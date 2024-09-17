import { Document, Schema } from "mongoose";

export interface TWeight extends Document  {
    user:Schema.Types.ObjectId
    date: string;
    time: string;
    weight: number;
};