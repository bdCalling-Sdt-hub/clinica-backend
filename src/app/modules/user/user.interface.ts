import { TGender } from "../patient/patient.interface";

export type TUser = {
    name: string;
    email: string;
    password: string;
    role: string;
    gender: TGender;
    isActive: boolean;
    isDelete: boolean;
    validation?:TValidation
}

export type TValidation = {
    otp: number;
    expiry: string;
    isVerified: boolean;
}