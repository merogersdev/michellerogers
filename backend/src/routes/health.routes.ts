import express from 'express';
import { handleHealthCheck } from '../controllers/health.controller';

import rateLimiter from '../middleware/rate.limit.middleware';

const router = express.Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Basic Health Check
 *     tags:
 *       - health
 *     description: Returns Status Code 200
 */
router.route('/').get(rateLimiter, handleHealthCheck);

export default router;