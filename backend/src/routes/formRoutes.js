import { Router } from 'express';
import { createForm, updateForm, getForm, listForms, deleteForm } from '../controllers/formController.js';

const router = Router();

router.get('/', listForms);
router.get('/:id', getForm);
router.post('/', createForm);
router.put('/:id', updateForm);
router.delete('/:id', deleteForm);

export default router;
