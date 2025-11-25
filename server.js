// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './database/connection.js';
import clienteRoutes from './routes/clienteRoutes.js';
import produtoRoutes from './routes/produtoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ CORS CONFIGURADO PARA EXPO GO
app.use(cors({
  origin: [
    'http://localhost:3001',      // Backend local
    'http://localhost:8081',      // Expo web
    'exp://localhost:8081',       // Expo local
    'http://192.168.1.100:3001',  // ⬅️ CORRIGIDO - removi o espaço
    'http://192.168.1.100:8081',  // ⬅️ CORRIGIDO - removi o espaço
    'exp://192.168.1.100:8081',   // ⬅️ CORRIGIDO - removi o espaço
    'http://10.0.2.2:8081',       // Emulador Android
    'http://10.0.3.2:8081',       // Genymotion
    '*'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Middlewares
app.use(express.json());

// Log de requisições para debug
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  console.log(`🌐 Origin: ${req.headers.origin}`);
  next();
});

// Rotas
app.use('/api', clienteRoutes);
app.use('/api', produtoRoutes);

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'API Costtime funcionando!', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bem-vindo à API Costtime',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      clientes: '/api/clientes',
      produtos: '/api/produtos'
    }
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('💥 Erro no servidor:', error);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado'
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 URLs de acesso:`);
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   Rede: http://192.168.1.100:${PORT}`); // ⬅️ CORRIGIDO - removi o espaço
  
  // Testar conexão com banco
  const conexaoOK = await testConnection();
  if (!conexaoOK) {
    console.log('⚠️  Servidor iniciado sem conexão com o banco');
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Desligando servidor gracefully...');
  process.exit(0);
});