import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";

const UserSchema = new Schema<TUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { enum: ["admin", "patient", "doctor"] },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
});

const UserModel = model<TUser>('User', UserSchema);
export default UserModel