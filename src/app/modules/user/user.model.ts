import { model, Schema } from "mongoose";
import { TUser, TValidation } from "./user.interface";


const validationSchema = new Schema<TValidation>({
    otp: { type: Number, default: 0 },
    expiry: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
})

const UserSchema = new Schema<TUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "patient", "doctor"],required:true },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
    validation: {type:validationSchema}
});

const UserModel = model<TUser>('User', UserSchema);
export default UserModel