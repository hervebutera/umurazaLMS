import express from 'express'
import userRoutes from './userRoutes.js'
import courseRoutes from './courseRoutes.js';



const router = express.Router();

router.use('/user', userRoutes);
router.use('/course', courseRoutes)

export default router;
