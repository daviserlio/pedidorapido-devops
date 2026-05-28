const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());

// Endpoint de saúde — verifica se a API está online
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

const pedidosRouter = require('./routes/pedidos');
app.use('/api/pedidos', pedidosRouter);

module.exports = app;