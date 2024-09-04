import { z } from "zod";

// Zod schema for Blood Pressure
const bloodPressureSchema = z.object({
    date: z.string({ required_error: "Date is required" }),
    time: z.string({ required_error: "Time is required" }),
    systolic: z.number({ required_error: "Systolic value is required" }),
    diastolic: z.number({ required_error: "Diastolic value is required" }),
}).strict();


// Zod schema for Glucose
const glucoseSchema = z.object({
    date: z.string({ required_error: "Date is required" }),
    time: z.string({ required_error: "Time is required" }),
    label: z.string({ required_error: "Label is required" }),
    data: z.number({ required_error: "Data value is required" }),
}).strict();

// Zod schema for Weight
const weightSchema = z.object({
    date: z.string({ required_error: "Date is required" }),
    time: z.string({ required_error: "Time is required" }),
    weight: z.number({ required_error: "Weight is required" }),
}).strict();


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
    password: z.string({ required_error: "Password is required" }),
    contact: z.string({ required_error: "Contact is required" }),
    dateOfBirth: z.string(),
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
    bloodPressure: z.array(bloodPressureSchema),
    glucose: z.array(glucoseSchema),
    weight: z.array(weightSchema),
  }).partial().strict()


export const PatientValidation = {
  createPatient,
  updatePatient
};
