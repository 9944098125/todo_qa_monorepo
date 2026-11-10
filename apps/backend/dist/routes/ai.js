"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verify_1 = require("../middleware/verify");
const ai_1 = require("../controllers/ai");
const router = (0, express_1.Router)();
/**
 * POST /api/ai/chat
 * Authenticated chat endpoint with conversational history.
 */
router.route("/chat").post(verify_1.verifyToken, ai_1.handleAiChat);
exports.default = router;
