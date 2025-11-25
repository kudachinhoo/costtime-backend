import mysql from 'mysql2/promise';

async function testMySQL() {
  const configs = [
    { host: 'localhost', user: 'root', password: 'JCmar-26', database: 'Costtime' },
    { host: 'localhost', user: 'root', password: 'password', database: 'Costtime' },
    { host: 'localhost', user: 'root', password: '123456', database: 'Costtime' },
    { host: 'localhost', user: 'root', password: '', database: 'Costtime' },
    { host: '127.0.0.1', user: 'root', password: 'JCmar-26', database: 'Costtime' }
  ];

  for (const config of configs) {
    try {
      console.log('🔍 Testando: ' + config.user + '@' + config.host + '...');
      const connection = await mysql.createConnection(config);
      const [rows] = await connection.execute('SELECT 1 as test');
      console.log('✅ Conexão bem-sucedida com: ' + config.user + '@' + config.host);
      await connection.end();
      return config;
    } catch (error) {
      console.log('❌ Falha: ' + config.user + '@' + config.host + ' - ' + error.message);
    }
  }
  
  console.log('❌ Nenhuma configuração funcionou');
  return null;
}

testMySQL();
