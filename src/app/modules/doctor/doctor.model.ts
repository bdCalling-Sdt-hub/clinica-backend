import { model, Schema } from "mongoose";
import { TDoctor } from "./doctor.interface";

const DoctorSchema = new Schema<TDoctor>({
    name: { type: String, required: true,unique:true },
    email: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    experience: { type: String, required: true },
    address: { type: String, required: true },
    about: { type: String, default: null },
})


const DoctorModel = model<TDoctor>('Doctor', DoctorSchema);
export default DoctorModel