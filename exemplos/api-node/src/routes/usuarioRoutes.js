import { Router } from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';
import { auth } from '../middlewares/auth.js';
import * as usuarioController from '../controllers/usuarioController.js';

const router = Router();

router.use(auth); // toda rota abaixo desta linha exige um token válido

router.get('/', usuarioController.listar);
router.get('/:id', usuarioController.buscarPorId);
router.put('/:id', asyncHandler(usuarioController.substituir));
router.patch('/:id', asyncHandler(usuarioController.atualizarParcial));
router.delete('/:id', usuarioController.remover);

export default router;
