import { model, Schema } from "mongoose";
import { TDoctor } from "./doctor.interface";

const DoctorSchema = new Schema<TDoctor>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true,unique:true },
    name: { type: String, required: true,unique:true },
    email: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    contact: { type: String, required: true,unique:true },
    experience: { type: String, required: true },
    address: { type: String, required: true },
    about: { type: String, default: null },
})


const DoctorModel = model<TDoctor>('Doctor', DoctorSchema);
export default DoctorModel