// Rotas CRUD para gerenciamento de pedidos
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM pedidos ORDER BY criado_em DESC'
    );
    res.json({ sucesso: true, dados: result.rows });
  } catch (err) {
    console.error('Erro ao buscar pedidos:', err.message);
    res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
  }
});

router.post('/', async (req, res) => {
  const { cliente, item, quantidade } = req.body;

  if (!cliente || !item || !quantidade) {
    return res.status(400).json({
      sucesso: false,
      erro: 'Campos obrigatórios: cliente, item, quantidade'
    });
  }

  try {
    const result = await pool.query(
      'INSERT INTO pedidos (cliente, item, quantidade) VALUES ($1, $2, $3) RETURNING *',
      [cliente, item, quantidade]
    );
    res.status(201).json({ sucesso: true, dados: result.rows[0] });
  } catch (err) {
    console.error('Erro ao criar pedido:', err.message);
    res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM pedidos WHERE id = $1', [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Pedido não encontrado' });
    }
    res.json({ sucesso: true, dados: result.rows[0] });
  } catch (err) {
    console.error('Erro ao buscar pedido:', err.message);
    res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
  }
});

module.exports = router;