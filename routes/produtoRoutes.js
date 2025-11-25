import express from 'express';
import { produtoController } from '../controllers/produtoController.js';

const router = express.Router();

router.post('/produtos', produtoController.criarProduto);
router.get('/produtos/cliente/:email', produtoController.buscarProdutosPorCliente);
router.post('/registros-consumo', produtoController.criarRegistroConsumo);

export default router;