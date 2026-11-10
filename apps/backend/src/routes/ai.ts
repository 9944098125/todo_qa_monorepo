import { Router } from "express";
import { verifyToken } from "../middleware/verify";
import { handleAiChat } from "../controllers/ai";

const router = Router();

/**
 * POST /api/ai/chat
 * Authenticated chat endpoint with conversational history.
 */
router.route("/chat").post(verifyToken, handleAiChat);

export default router;
