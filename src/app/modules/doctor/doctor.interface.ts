import { Schema } from "mongoose";

export type TDoctor = {
    user: Schema.Types.ObjectId;
    name: string;
    role:string;
    email: string;
    slug: string
    title: string;
    gender: string;
    password: string;
    contact: string;
    experience: string;
    address: string;
    about:string;
    isActive: boolean;
    isDelete: boolean;
}