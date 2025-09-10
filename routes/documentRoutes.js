import express from "express";
import {
  seedDocuments,
  getDocuments,
  markExported,
} from "../controllers/documentController.js";

const router = express.Router();

router.post("/seed", seedDocuments);
router.get("/", getDocuments);
router.post("/:id/mark-exported", markExported);

export default router;
