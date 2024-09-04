import { Schema } from "mongoose";

export type TWeight = {
    user:Schema.Types.ObjectId
    date: string;
    time: string;
    weight: number;
}