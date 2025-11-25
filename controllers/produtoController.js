// backend/controllers/produtoController.js
import { connection } from '../database/connection.js';

export const produtoController = {
  // Criar produto/serviço consumido
  async criarProduto(req, res) {
    try {
      const { preco, email, categoria } = req.body;

      const sql = `
        INSERT INTO Produto_ou_sevico_consumido (preco, Email, CATEGORIA) 
        VALUES (?, ?, ?)
      `;

      const stmt = connection.prepare(sql);
      const result = stmt.run([preco, email, categoria]);
      
      res.status(201).json({
        message: 'Produto criado com sucesso!',
        id: result.lastInsertRowid
      });

    } catch (error) {
      console.error('Erro ao criar produto:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Buscar produtos por cliente
  async buscarProdutosPorCliente(req, res) {
    try {
      const { email } = req.params;

      const sql = 'SELECT * FROM Produto_ou_sevico_consumido WHERE Email = ?';
      const stmt = connection.prepare(sql);
      const produtos = stmt.all(email);

      res.json(produtos);

    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Buscar produto por ID
  async buscarProdutoPorId(req, res) {
    try {
      const { id } = req.params;

      const sql = 'SELECT * FROM Produto_ou_sevico_consumido WHERE ID_consumo = ?';
      const stmt = connection.prepare(sql);
      const produto = stmt.get(id);

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      res.json(produto);

    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Criar registro de consumo
  async criarRegistroConsumo(req, res) {
    try {
      const { id_consumo, produto, data_produto, valor_total, quantidade } = req.body;

      const sql = `
        INSERT INTO Registro_total_de_consumo 
        (ID_consumo, Protudo, Data_do_protudo, VALOR_TOTAL, QUANTIDADE) 
        VALUES (?, ?, ?, ?, ?)
      `;

      const stmt = connection.prepare(sql);
      const result = stmt.run([
        id_consumo, produto, data_produto, valor_total, quantidade
      ]);
      
      res.status(201).json({
        message: 'Registro de consumo criado!',
        id: result.lastInsertRowid
      });

    } catch (error) {
      console.error('Erro ao criar registro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Buscar registros por produto
  async buscarRegistrosPorProduto(req, res) {
    try {
      const { id_consumo } = req.params;

      const sql = 'SELECT * FROM Registro_total_de_consumo WHERE ID_consumo = ?';
      const stmt = connection.prepare(sql);
      const registros = stmt.all(id_consumo);

      res.json(registros);

    } catch (error) {
      console.error('Erro ao buscar registros:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};