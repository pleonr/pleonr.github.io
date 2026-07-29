import { Router } from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';
import * as authController from '../controllers/authController.js';

const router = Router();

router.post('/registrar', asyncHandler(authController.registrar));
router.post('/login', asyncHandler(authController.login));

export default router;
