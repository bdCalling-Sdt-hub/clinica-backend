import { z } from "zod";

// Zod schema for Weight
const weightSchema = z.object({
    date: z.string({ required_error: "Date is required" }),
    time: z.string({ required_error: "Time is required" }),
    weight: z.number({ required_error: "Weight is required" }),
}).strict();


export const WeightValidations = { 
    weightSchema
}