import { model, Schema } from "mongoose";
import { TPatient } from "./patient.interface";

const PatientSchema = new Schema<TPatient>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dateOfBirth: { type: String,default:null },
    bloodGroup: { type: String, enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],default:null },
    role: { type: String, required: true },
    height: { type: String,default:null },
    weight: { type: String,default:null},
    lastMenstrualPeriod: { type: String,default:null },
    weightBeginningPregnancy: { type: String,default:null},
    pregnancyType: { type: String, enum: ["single", "multiple"],default:"single" },
    vitroFertilization: { type: Boolean,default:false },
    profilePicture: { type: String,default:null },
    chronicHypertension: { type: Boolean,default:false },
    lupus: { type: Boolean,default:false },
    AntiphospholipidSyndrome: { type: Boolean, default:false },
    MotherPreeclampsiaHistory: { type: Boolean, default:false },
    firstPregnancy: { type: Boolean,default:false },
    historyOfPreeclampsia: { type: Boolean,default:false },
    babyBelow2500Grams: { type: Boolean,default:false },
    HigherRiskOfPreeclampsia: { type: Boolean,default:false },
    isActive: { type: Boolean, default:true },
    isDelete: { type: Boolean, default: false },
});

const PatientModel = model<TPatient>('Patient', PatientSchema);

export default PatientModel;