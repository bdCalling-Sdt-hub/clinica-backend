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
    dateOfBirth: z.string().nullable().optional(),
    gender: z.enum(["male", "female"]).nullable(),
    bloodGroup: z.enum(["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]).nullable().optional(),
    height: z.string().nullable().optional(),
    lastMenstrualPeriod: z.string().nullable().optional(),
    weightBeginningPregnancy: z.string().nullable().optional(),
    pregnancyType: z.enum(["single", "multiple"]).default("single"),
    vitroFertilization: z.boolean().optional().default(false),
    profilePicture: z.string().nullable().optional(),
    chronicHypertension: z.boolean().optional().default(false),
    lupus: z.boolean().optional().default(false),
    gestationalAge: z.string().nullable().optional(),
    antiphospholipidSyndrome: z.boolean().optional().default(false),
    motherPreeclampsiaHistory: z.boolean().optional().default(false),
    firstPregnancy: z.boolean().optional().default(false),
    historyOfPreeclampsia: z.boolean().optional().default(false),
    babyBelow2500Grams: z.boolean().optional().default(false),
    higherRiskOfPreeclampsia: z.boolean().optional().default(false),
    bloodPressure: z.array(bloodPressureSchema).optional().default([]),
    glucose: z.array(glucoseSchema).optional().default([]),
    weight: z.array(weightSchema).optional().default([]),
    isActive: z.boolean().default(true),
    isDelete: z.boolean().default(false),
  }).strict(),
})

export const PatientValidation = {
  createPatient,
};
