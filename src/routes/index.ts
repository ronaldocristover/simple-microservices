import { Router } from 'express';
import healthRoutes from './health.routes';
import exampleRoutes from './example.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/example', exampleRoutes);

export default router;

