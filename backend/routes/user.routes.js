import express from 'express';
import { requestOTP, verifyOTP } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/auth/request-otp', requestOTP);
router.post('/auth/verify-otp', verifyOTP);

export default router;
