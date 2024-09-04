import { z } from "zod";

const uploadHealthRecordValidation = z.object({
    body:z.object({
        file: z.string({required_error:"File is required"}),
    })
})

export const HealthRecordValidation = {
    uploadHealthRecordValidation
}