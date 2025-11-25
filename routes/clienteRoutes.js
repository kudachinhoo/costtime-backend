// backend/routes/clienteRoutes.js
import express from 'express';
import { clienteController } from '../controllers/clienteController.js';

const router = express.Router();

// Rotas existentes
router.post('/clientes', clienteController.criarCliente);
router.get('/clientes/:email', clienteController.buscarCliente);
router.put('/clientes/:email', clienteController.atualizarCliente);

// NOVA ROTA DE LOGIN - ADICIONE ESTA LINHA
router.post('/clientes/login', clienteController.loginCliente);

export default router;