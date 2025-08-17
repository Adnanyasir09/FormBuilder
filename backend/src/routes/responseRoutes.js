import { Router } from 'express';
import { submitResponse, listResponsesForForm } from '../controllers/responseController.js';

const router = Router();

router.post('/', submitResponse);
router.get('/form/:id', listResponsesForForm);

export default router;
