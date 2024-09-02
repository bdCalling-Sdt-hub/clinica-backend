import { z } from "zod";

const signInValidation = z.object({
   body:z.object({
    email: z.string({required_error:"Email is required"}).email({ message: "Invalid email address" }),
    password: z.string()
   })
});
const refreshTokenValidation = z.object({
    cookies: z.object({
      refreshToken: z.string({
        required_error: 'Refresh token is required!',
      }),
    }),
  });

export const AuthValidations = {
    signInValidation,
    refreshTokenValidation
}