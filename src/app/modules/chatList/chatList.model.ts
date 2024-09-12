import { model, Schema } from "mongoose";
import { TChatList } from "./chatList.interface";

const ChatListSchema = new Schema<TChatList>({
    participants:[
        {type: Schema.Types.ObjectId, ref: "User"}
    ],
});

const ChatListModel = model<TChatList>("ChatList", ChatListSchema);
export default ChatListModel