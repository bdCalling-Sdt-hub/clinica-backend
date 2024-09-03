import { Schema } from "mongoose";

export type TPatient = {
    user: Schema.Types.ObjectId;
    dateOfBirth?: string;
    bloodGroup?: string;
    height?:string;
    lastMenstrualPeriod?: string;
    weightBeginningPregnancy?: string;
    pregnancyType?: 'single' | 'multiple'
    vitroFertilization?:boolean
    profilePicture?:string;
    chronicHypertension?: boolean
    lupus?:boolean;
    antiphospholipidSyndrome?:boolean;
    motherPreeclampsiaHistory?:boolean;
    firstPregnancy?:boolean;
    historyOfPreeclampsia?:boolean;
    babyBelow2500Grams?:boolean;
    higherRiskOfPreeclampsia?:boolean
    gestationalAge?:number
    bloodPressure?: TBloodPressure[];
    glucose?: TGlucose[];
    weight?: TWeight[];
    isActive: boolean;
    isDelete:boolean;
    createdAt: string;
    updatedAt: string;
}

export type TBloodPressure = {
    date: string ;
    time:string;
    systolic: number;
    diastolic: number;
}

export type TGlucose = {
    date: string;
    time: string;
    label:string;
    data:number;
}

export type TWeight = {
    date: string;
    time: string;
    weight: number;
}

export type TGender = "male" | "female"
export type TBloodGroup = "O+" | "O-" | "A+" | "A- " | "B+" | "B-" | "AB+" | "AB-"