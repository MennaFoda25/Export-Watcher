import express from "express";
import {
  seedDocuments,
  getDocuments,
  markExported,
  addDocument
} from "../controllers/documentController.js";
import { protect } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/seed", seedDocuments);
router.post("/add", addDocument);
router.get("/", protect,getDocuments);
router.post("/:id/mark-exported",protect, markExported);

export default router;



/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Document management APIs
 */

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Get all documents
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of results per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort order (e.g., created_at:desc)
 *     responses:
 *       200:
 *         description: List of documents
 *   post:
 *     summary: Add a new document
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Document created
 */
