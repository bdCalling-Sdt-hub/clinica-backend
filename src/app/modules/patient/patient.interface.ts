import { Schema } from "mongoose";

export type TPatient = {
    user: Schema.Types.ObjectId;
    slug:string;
    dateOfBirth?: string;
    bloodGroup?: string;
    height?:string;
    lastMenstrualPeriod?: string;
    weightBeginningPregnancy?: string;
    pregnancyType?: 'single' | 'multiple'
    vitroFertilization?:boolean
    chronicHypertension?: boolean
    lupus?:boolean;
    antiphospholipidSyndrome?:boolean;
    motherPreeclampsiaHistory?:boolean;
    firstPregnancy?:boolean;
    historyOfPreeclampsia?:boolean;
    babyBelow2500Grams?:boolean;
    higherRiskOfPreeclampsia?:boolean
    gestationalAge?:number
    bloodPressure?: Schema.Types.ObjectId;
    glucose?: Schema.Types.ObjectId;
    weight?:  Schema.Types.ObjectId;
    isActive: boolean;
    isDelete:boolean;
    createdAt: string;
    updatedAt: string;
}

export type TGender = "male" | "female"
export type TBloodGroup = "O+" | "O-" | "A+" | "A- " | "B+" | "B-" | "AB+" | "AB-"