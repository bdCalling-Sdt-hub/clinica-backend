import { Router } from "express";
import auth from "../../middlewares/auth";
import { ChatListController } from "./chatList.conroller";
const router = Router()

router.get("/get-chat-list", auth("doctor", "patient"), ChatListController.getChatList);
router.post("/create", auth("doctor", "patient"), ChatListController.createChatList);
router.post("/add", auth("doctor", "patient"), ChatListController.addChatList);

export const ChatListRoutes = router;