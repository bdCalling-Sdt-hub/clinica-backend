import { Document, Schema } from "mongoose";

export type TParticipant = {
    user: Schema.Types.ObjectId,
    isActive: boolean
    isBlocked: boolean
    isDelete: boolean
}

export interface TChatList extends Document  {
    participants: TParticipant[];
    isDelete: boolean;
}