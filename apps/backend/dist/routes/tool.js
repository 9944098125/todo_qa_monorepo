"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tool_1 = require("../controllers/tool");
const verify_1 = require("../middleware/verify");
const router = (0, express_1.Router)();
/**
 * Create Tool
 * POST /api/tools
 */
router.route("/").post(verify_1.verifyToken, tool_1.createTool);
/**
 * Get All Tools
 * GET /api/tools?userId=<userId>
 */
router.route("/").get(verify_1.verifyToken, tool_1.getTools);
/**
 * Get Tool By Id
 * GET /api/tools/tool?userId=<userId>&toolId=<toolId>
 */
router.route("/tool").get(verify_1.verifyToken, tool_1.getToolById);
/**
 * Update Tool
 * PATCH /api/tools/update-tool?userId=<userId>?toolId=<toolId>
 */
router.route("/update-tool").patch(verify_1.verifyToken, tool_1.updateTool);
/**
 * Delete Tool
 * DELETE /api/tools/delete-tool?userId=<userId>&toolId=<toolId>
 */
router.route("/delete-tool").delete(verify_1.verifyToken, tool_1.deleteTool);
exports.default = router;
