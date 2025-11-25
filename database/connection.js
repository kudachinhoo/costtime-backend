// backend/database/connection.js - ATUALIZADO
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Para produção (Render.com) usar SQLite em memória
// Para desenvolvimento usar arquivo local
const dbPath = process.env.NODE_ENV === 'production' 
  ? ':memory:' 
  : path.join(__dirname, 'costtime.db');

console.log('📁 Caminho do banco:', dbPath);

// Criar conexão com o banco
const connection = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar com SQLite:', err.message);
  } else {
    console.log('✅ Conectado ao SQLite - Banco local funcionando!');
    initDatabase();
  }
});

// Cria todas as tabelas
export const initDatabase = () => {
  // Tabela CLIENTE
  connection.run(`
    CREATE TABLE IF NOT EXISTS CLIENTE (
      salario INTEGER,
      Horas_trabalhadas_por_semana INTEGER,
      Senha TEXT,
      Idade INTEGER,
      Nome TEXT,
      Email TEXT UNIQUE PRIMARY KEY,
      Data_de_nascimento TEXT,
      sobrenome TEXT,
      genero TEXT,
      tempo_de_trabalho_diario INTEGER,
      escala TEXT,
      emprego_ou_funcao TEXT
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela CLIENTE:', err);
    } else {
      console.log('✅ Tabela CLIENTE criada/verificada');
    }
  });

  // Tabela Produto_ou_sevico_consumido
  connection.run(`
    CREATE TABLE IF NOT EXISTS Produto_ou_sevico_consumido (
      preco REAL,
      Email TEXT,
      CATEGORIA TEXT,
      ID_consumo INTEGER PRIMARY KEY AUTOINCREMENT,
      FOREIGN KEY (Email) REFERENCES CLIENTE(Email)
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela Produto_ou_sevico_consumido:', err);
    } else {
      console.log('✅ Tabela Produto_ou_sevico_consumido criada/verificada');
    }
  });

  // Tabela Registro_total_de_consumo
  connection.run(`
    CREATE TABLE IF NOT EXISTS Registro_total_de_consumo (
      ID_consumo INTEGER,
      Protudo TEXT,
      Data_do_protudo TEXT,
      VALOR_TOTAL REAL,
      ID_REGISTRO INTEGER PRIMARY KEY AUTOINCREMENT,
      QUANTIDADE INTEGER,
      FOREIGN KEY (ID_consumo) REFERENCES Produto_ou_sevico_consumido(ID_consumo)
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela Registro_total_de_consumo:', err);
    } else {
      console.log('✅ Tabela Registro_total_de_consumo criada/verificada');
    }
  });

  // Tabela Projecoes_futuras
  connection.run(`
    CREATE TABLE IF NOT EXISTS Projecoes_futuras (
      Economia REAL,
      TEMPO_DE_VIDA_RECUPERADO_EM_DINHEIRO INTEGER,
      NOVOS_HABITOS TEXT,
      ID_REGISTRO INTEGER PRIMARY KEY AUTOINCREMENT,
      Meta_mensal REAL,
      Meta_semanal REAL,
      FOREIGN KEY (ID_REGISTRO) REFERENCES Registro_total_de_consumo(ID_REGISTRO)
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela Projecoes_futuras:', err);
    } else {
      console.log('✅ Tabela Projecoes_futuras criada/verificada');
    }
  });

  console.log('✅ Banco SQLite inicializado com todas as tabelas!');
};

export const testConnection = async () => {
  return new Promise((resolve, reject) => {
    connection.get("SELECT 1 as test", (err, row) => {
      if (err) {
        console.error('❌ Teste de conexão falhou:', err);
        reject(false);
      } else {
        console.log('✅ Teste de conexão bem-sucedido');
        resolve(true);
      }
    });
  });
};

export { connection };