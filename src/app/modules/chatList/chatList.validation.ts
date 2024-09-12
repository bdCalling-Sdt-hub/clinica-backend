import { z } from "zod";

const createChatListValidationSchema = z.object({
    body:z.object({
        participants:z.array(z.string({required_error:"Participants is required"})),
    }).strict()
});



export const ChatListValidations = {
    createChatListValidationSchema
}
