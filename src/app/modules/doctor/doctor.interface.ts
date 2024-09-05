import { Schema } from "mongoose";

export type TDoctor = {
    user: Schema.Types.ObjectId;
    slug: string
    title: string;
    experience: string;
    address: string;
    about:string;
    isActive: boolean;
    isDelete: boolean;
}