require('dotenv').config();

const app = require('./app');
const { pool } = require('./db');

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Banco de dados conectado com sucesso');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Backend rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erro ao conectar no banco:', err.message);
    process.exit(1);
  }
}

startServer();