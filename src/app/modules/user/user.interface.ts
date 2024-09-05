import { TGender } from "../patient/patient.interface";

export type TUser = {
    name: string;
    slug: string;
    email: string;
    profilePicture:string | null
    contact: string;
    password: string;
    role: string;
    gender: TGender;
    isActive: boolean;
    isDelete: boolean;
    validation?:TValidation
}

export type TValidation = {
    otp: number;
    expiry: string | null;
    isVerified: boolean;
}