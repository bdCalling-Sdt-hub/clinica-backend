import { z } from "zod";

// Zod schema for TPatient
const createPatient = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z.string({ required_error: "Email is required" }).email("Invalid email"),
    password: z.string({ required_error: "Password is required" }),
    contact: z.string({ required_error: "Contact is required" }),
    gender: z.enum(["male", "female"]),
  }).strict(),
})
const updatePatient = z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z.string({ required_error: "Email is required" }).email("Invalid email"),
    contact: z.string({ required_error: "Contact is required" }),
    dateOfBirth: z.string(),
    age:z.number(),
    gender: z.enum(["male", "female"]),
    bloodGroup: z.enum(["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]),
    height: z.string(),
    profilePicture: z.string(),
    lastMenstrualPeriod: z.string(),
    weightBeginningPregnancy: z.string(),
    pregnancyType: z.enum(["single", "multiple"]),
    vitroFertilization: z.boolean(),
    chronicHypertension: z.boolean(),
    lupus: z.boolean(),
    gestationalAge: z.string(),
    antiphospholipidSyndrome: z.boolean(),
    motherPreeclampsiaHistory: z.boolean(),
    firstPregnancy: z.boolean(),
    historyOfPreeclampsia: z.boolean(),
    babyBelow2500Grams: z.boolean(),
    higherRiskOfPreeclampsia: z.boolean(),
    bloodPressureAlert: z.boolean(),
    weightAlert: z.boolean(),
    glucoseAlert: z.boolean(),
  }).partial().strict()


  const patientActionValidation = z.object({
    body: z.object({
      isDelete: z.boolean().optional(),
      isActive: z.boolean().optional(),
    })
  })

  const setupAlertValidation = z.object({
    body: z.object({
      type: z.enum(["bloodPressure", "glucose", "weight"]),
      alert: z.boolean().optional().default(false),
    }).strict()
  })

export const PatientValidation = {
  createPatient,
  updatePatient,
  patientActionValidation,
  setupAlertValidation
};
