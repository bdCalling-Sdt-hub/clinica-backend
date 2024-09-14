import { Types } from "mongoose";
import { z } from "zod";

const objectIdSchema = z.string().refine((value) => Types.ObjectId.isValid(value), {
  message: "Invalid ObjectId format",
});

const participantsSchema = z.object({
  user: objectIdSchema,
  isActive: z.boolean().optional().default(true),
  isBlocked: z.boolean().optional().default(false),
  isDelete: z.boolean().optional().default(false),
});

const createChatListValidationSchema = z.object({
  body: z.object({
    participants: z.array(participantsSchema),
  }).strict(),
});

export const ChatListValidations = {
    createChatListValidationSchema
}
