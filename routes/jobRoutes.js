import express from 'express'
import {checkExportJob} from '../utils/job.js'

const router = express.Router();

router.get("/",checkExportJob)

export default router;

/**
 * @swagger
 * /api/job:
 *   post:
 *     summary: Run the export correction job manually
 *     tags: [Job]
 *     responses:
 *       200:
 *         description: Job executed successfully
 */
