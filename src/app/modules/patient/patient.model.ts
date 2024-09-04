import { model, Schema } from "mongoose";
import { TPatient } from "./patient.interface";

// Patient Schema
const PatientSchema = new Schema<TPatient>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true,unique:true },
    slug: { type: String, required: true, unique: true },
    dateOfBirth: { type: String, default: null },
    bloodGroup: { type: String, enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"], default: null },
    height: { type: String, default: null },
    lastMenstrualPeriod: { type: String, default: null },
    weightBeginningPregnancy: { type: String, default: null },
    pregnancyType: { type: String, enum: ["single", "multiple"], default: "single" },
    vitroFertilization: { type: Boolean, default: false },
    chronicHypertension: { type: Boolean, default: false },
    lupus: { type: Boolean, default: false },
    gestationalAge: { type: String, default: null },
    antiphospholipidSyndrome: { type: Boolean, default: false },
    motherPreeclampsiaHistory: { type: Boolean, default: false },
    firstPregnancy: { type: Boolean, default: false },
    historyOfPreeclampsia: { type: Boolean, default: false },
    babyBelow2500Grams: { type: Boolean, default: false },
    higherRiskOfPreeclampsia: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true, 
});

const PatientModel = model<TPatient>('Patient', PatientSchema);

export default PatientModel;
