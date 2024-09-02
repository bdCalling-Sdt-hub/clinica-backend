import { Schema } from "mongoose";

export type TPatient = {
    user: Schema.Types.ObjectId;
    dateOfBirth?: string;
    bloodGroup?: string;
    role: string;
    height?:string;
    weight?:string;
    lastMenstrualPeriod?: string;
    weightBeginningPregnancy?: string;
    pregnancyType?: 'single' | 'multiple'
    vitroFertilization?:boolean
    profilePicture?:string;
    chronicHypertension?: boolean
    lupus?:boolean;
    AntiphospholipidSyndrome?:boolean;
    MotherPreeclampsiaHistory?:boolean;
    firstPregnancy?:boolean;
    historyOfPreeclampsia?:boolean;
    babyBelow2500Grams?:boolean;
    HigherRiskOfPreeclampsia?:boolean
    isActive: boolean;
    isDelete:boolean;
    createdAt: string;
    updatedAt: string;
}

export type TGender = "male" | "female"
export type TBloodGroup = "O+" | "O-" | "A+" | "A- " | "B+" | "B-" | "AB+" | "AB-"