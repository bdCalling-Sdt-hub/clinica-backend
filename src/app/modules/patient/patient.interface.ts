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
    isActive: boolean;
    isDelete:boolean;
}


export type TBloodGroup = "O+" | "O-" | "A+" | "A- " | "B+" | "B-" | "AB+" | "AB-"