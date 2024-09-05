import { z } from "zod";

const createConnectionValidation = {
    body: z.object({
        patient: z.string({ required_error: "Patient is required" }),
        doctor: z.string({ required_error: "Doctor is required" }),
    })
}

const updateConnectionValidation = {
    body: z.object({
        connectionId: z.string({ required_error: "Connection Id is required" }),
        status: z.enum(["pending", "accept", "reject"])
    })
}

const cancelConnectionValidation = {
    body: z.object({
        connectionId: z.string({ required_error: "Connection Id is required" }),
    })
}

export const connectionValidations = {
    createConnectionValidation,
    updateConnectionValidation,
    cancelConnectionValidation
}