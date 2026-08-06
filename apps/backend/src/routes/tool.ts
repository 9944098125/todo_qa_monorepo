import { Router } from "express";
import {
  createTool,
  deleteTool,
  getToolById,
  getTools,
  updateTool,
} from "../controllers/tool";
import { verifyToken } from "../middleware/verify";

const router = Router();

/**
 * Create Tool
 * POST /api/tools
 */

router.route("/").post(verifyToken, createTool);

/**
 * Get All Tools
 * GET /api/tools?userId=<userId>
 */

router.route("/").get(verifyToken, getTools);

/**
 * Get Tool By Id
 * GET /api/tools/tool?userId=<userId>&toolId=<toolId>
 */

router.route("/tool").get(verifyToken, getToolById);

/**
 * Update Tool
 * PATCH /api/tools/update-tool?userId=<userId>?toolId=<toolId>
 */

router.route("/update-tool").patch(verifyToken, updateTool);

/**
 * Delete Tool
 * DELETE /api/tools/delete-tool?userId=<userId>&toolId=<toolId>
 */
router.route("/delete-tool").delete(verifyToken, deleteTool);

export default router;
