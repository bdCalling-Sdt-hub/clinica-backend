import { z } from "zod";

const signInValidation = z.object({
   body:z.object({
    email: z.string({required_error:"Email is required"}).email({ message: "Invalid email address" }),
    password: z.string()
   })
});

export const AuthValidations = {
    signInValidation
}