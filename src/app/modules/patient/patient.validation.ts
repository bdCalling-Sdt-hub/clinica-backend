import { z } from "zod";

// Zod schema for TPatient
const createPatient = z.object({
  body: z.object({
    name: z.string({ message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    contact: z.string({ message: "Contact number is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    dateOfBirth: z.string().optional(),
    gender: z.enum(["male", "female"], { message: "Gender must be either 'male' or 'female'" }),
    bloodGroup: z.enum(["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]).optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    lastMenstrualPeriod: z.string().optional(),
    weightBeginningPregnancy: z.string().optional(),
    pregnancyType: z.enum(["single", "multiple"]).optional(),
    vitroFertilization: z.boolean().optional(),
    profilePicture: z.string().optional(),
    chronicHypertension: z.boolean().optional(),
    lupus: z.boolean().optional(),
    antiphospholipidSyndrome: z.boolean().optional(),
    motherPreeclampsiaHistory: z.boolean().optional(),
    firstPregnancy: z.boolean().optional(),
    historyOfPreeclampsia: z.boolean().optional(),
    babyBelow2500Grams: z.boolean().optional(),
    higherRiskOfPreeclampsia: z.boolean().optional(),
    isActive: z.boolean().default(true),
    isDelete: z.boolean().default(false),
  })
});



export const PatientValidation = {
  createPatient,
}
