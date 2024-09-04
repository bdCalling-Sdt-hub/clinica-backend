import { model, Schema } from "mongoose";
import { TUser, TValidation } from "./user.interface";


const validationSchema = new Schema<TValidation>({
    otp: { type: Number, default: 0 ,select:0},
    expiry: { type: String, default: null,select:0 },
    isVerified: { type: Boolean, default: false },
})

const UserSchema = new Schema<TUser>({
    name: { type: String, required: true, unique:true },
    slug: { type: String, required: true, unique:true },
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String, default: null },
    password: { type: String, required: true,select:0 },
    role: { type: String, enum: ["admin", "patient", "doctor"],required:true },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
    validation: {type:validationSchema}
});



const UserModel = model<TUser>('User', UserSchema);
export default UserModel