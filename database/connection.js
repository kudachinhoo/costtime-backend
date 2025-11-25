// backend/database/connection.js
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'costtime.db');
export const connection = new Database(dbPath);

// Cria todas as tabelas
export const initDatabase = () => {
  // Tabela CLIENTE
  connection.exec(`
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
  `);

  // Tabela Produto_ou_sevico_consumido
  connection.exec(`
    CREATE TABLE IF NOT EXISTS Produto_ou_sevico_consumido (
      preco REAL,
      Email TEXT,
      CATEGORIA TEXT,
      ID_consumo INTEGER PRIMARY KEY AUTOINCREMENT,
      FOREIGN KEY (Email) REFERENCES CLIENTE(Email)
    )
  `);

  // Tabela Registro_total_de_consumo
  connection.exec(`
    CREATE TABLE IF NOT EXISTS Registro_total_de_consumo (
      ID_consumo INTEGER,
      Protudo TEXT,
      Data_do_protudo TEXT,
      VALOR_TOTAL REAL,
      ID_REGISTRO INTEGER PRIMARY KEY AUTOINCREMENT,
      QUANTIDADE INTEGER,
      FOREIGN KEY (ID_consumo) REFERENCES Produto_ou_sevico_consumido(ID_consumo)
    )
  `);

  // Tabela Projecoes_futuras
  connection.exec(`
    CREATE TABLE IF NOT EXISTS Projecoes_futuras (
      Economia REAL,
      TEMPO_DE_VIDA_RECUPERADO_EM_DINHEIRO INTEGER,
      NOVOS_HABITOS TEXT,
      ID_REGISTRO INTEGER PRIMARY KEY AUTOINCREMENT,
      Meta_mensal REAL,
      Meta_semanal REAL,
      FOREIGN KEY (ID_REGISTRO) REFERENCES Registro_total_de_consumo(ID_REGISTRO)
    )
  `);

  console.log('✅ Banco SQLite inicializado com todas as tabelas!');
};

export const testConnection = async () => {
  try {
    initDatabase();
    console.log('✅ Conectado ao SQLite - Banco local funcionando!');
    return true;
  } catch (error) {
    console.log('❌ Erro no SQLite:', error.message);
    return false;
  }
};