import { verifyQaOwner, verifyToken } from "./../middleware/verify";
import express from "express";
import {
  createQa,
  deleteQa,
  generateAnswerWithAI,
  getQa,
  getQaByImportance,
  getQaNewToOld,
  getQaOldToNew,
  updateQa,
} from "../controllers/qa";

const router = express.Router();

router.route("/create").post(verifyToken, createQa);

router.route("/new-to-old/:userId/:toolId").get(verifyToken, getQaNewToOld);

router.route("/old-to-new/:userId/:toolId").get(verifyToken, getQaOldToNew);

router.route("/importance/:userId/:toolId").get(verifyToken, getQaByImportance);

router.route("/:userId/:toolId").get(verifyToken, getQa);

router.route("/:qaId/:userId").patch(verifyQaOwner, updateQa);

router.route("/:qaId/:userId").delete(verifyQaOwner, deleteQa);

router.route("/generate-answer").post(verifyToken, generateAnswerWithAI);

export default router;
