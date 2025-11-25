// backend/controllers/clienteController.js - ATUALIZADO para sqlite3
import { connection } from '../database/connection.js';

export const clienteController = {
  // Criar novo cliente - ATUALIZADO
  async criarCliente(req, res) {
    try {
      const {
        salario,
        horas_trabalhadas_por_semana,
        senha,
        idade,
        nome,
        email,
        data_de_nascimento,
        sobrenome,
        genero,
        tempo_de_trabalho_diario,
        escala,
        emprego_ou_funcao
      } = req.body;

      const sql = `
        INSERT INTO CLIENTE (
          salario, Horas_trabalhadas_por_semana, Senha, Idade, Nome, 
          Email, Data_de_nascimento, sobrenome, genero, 
          tempo_de_trabalho_diario, escala, emprego_ou_funcao
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        salario, horas_trabalhadas_por_semana, senha, idade, nome,
        email, data_de_nascimento, sobrenome, genero,
        tempo_de_trabalho_diario, escala, emprego_ou_funcao
      ];

      // SQLite3 usa callback
      connection.run(sql, values, function(err) {
        if (err) {
          console.error('Erro ao criar cliente:', err);
          
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email já cadastrado' });
          }
          
          return res.status(500).json({ error: 'Erro interno do servidor' });
        }
        
        res.status(201).json({
          message: 'Cliente criado com sucesso!',
          id: this.lastID, // sqlite3 usa this.lastID
          email: email
        });
      });

    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Buscar cliente por email - ATUALIZADO
  async buscarCliente(req, res) {
    try {
      const { email } = req.params;

      const sql = 'SELECT * FROM CLIENTE WHERE Email = ?';
      connection.get(sql, [email], (err, cliente) => {
        if (err) {
          console.error('Erro ao buscar cliente:', err);
          return res.status(500).json({ error: 'Erro interno do servidor' });
        }

        if (!cliente) {
          return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        res.json(cliente);
      });

    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Atualizar cliente - ATUALIZADO
  async atualizarCliente(req, res) {
    try {
      const { email } = req.params;
      const campos = req.body;

      const camposPermitidos = [
        'salario', 'horas_trabalhadas_por_semana', 'idade', 'nome',
        'data_de_nascimento', 'sobrenome', 'genero', 'tempo_de_trabalho_diario',
        'escala', 'emprego_ou_funcao'
      ];

      const camposParaAtualizar = {};
      Object.keys(campos).forEach(key => {
        if (camposPermitidos.includes(key)) {
          camposParaAtualizar[key] = campos[key];
        }
      });

      if (Object.keys(camposParaAtualizar).length === 0) {
        return res.status(400).json({ error: 'Nenhum campo válido para atualizar' });
      }

      const setClause = Object.keys(camposParaAtualizar)
        .map(key => `${key} = ?`)
        .join(', ');

      const values = [...Object.values(camposParaAtualizar), email];

      const sql = `UPDATE CLIENTE SET ${setClause} WHERE Email = ?`;
      
      connection.run(sql, values, function(err) {
        if (err) {
          console.error('Erro ao atualizar cliente:', err);
          return res.status(500).json({ error: 'Erro interno do servidor' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        res.json({ message: 'Cliente atualizado com sucesso!' });
      });

    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Login do cliente - ATUALIZADO
  async loginCliente(req, res) {
    try {
      const { email, senha } = req.body;

      console.log('🔐 Tentativa de login:', email);

      if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      // Buscar cliente pelo email - ATUALIZADO
      const sql = 'SELECT * FROM CLIENTE WHERE Email = ?';
      connection.get(sql, [email], (err, cliente) => {
        if (err) {
          console.error('❌ Erro ao buscar cliente:', err);
          return res.status(500).json({ error: 'Erro interno do servidor' });
        }

        if (!cliente) {
          console.log('❌ Email não encontrado:', email);
          return res.status(401).json({ error: 'Email não encontrado' });
        }

        // Verificar senha
        if (cliente.Senha !== senha) {
          console.log('❌ Senha incorreta para:', email);
          return res.status(401).json({ error: 'Senha incorreta' });
        }

        console.log('✅ Login bem-sucedido para:', email);

        // Login bem-sucedido
        res.json({
          message: 'Login realizado com sucesso',
          cliente: {
            id: cliente.id,
            email: cliente.Email,
            nome: cliente.Nome,
            sobrenome: cliente.sobrenome,
            dataNascimento: cliente.Data_de_nascimento,
            data_de_nascimento: cliente.Data_de_nascimento,
            genero: cliente.genero,
            idade: cliente.Idade,
            salario: cliente.salario,
            horas_trabalhadas_por_semana: cliente.Horas_trabalhadas_por_semana,
            tempo_de_trabalho_diario: cliente.tempo_de_trabalho_diario,
            escala: cliente.escala,
            emprego_ou_funcao: cliente.emprego_ou_funcao
          }
        });
      });

    } catch (error) {
      console.error('💥 Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};