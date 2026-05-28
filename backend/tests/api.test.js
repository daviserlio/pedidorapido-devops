// Testes automatizados com Jest e Supertest
const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/db', () => ({
  pool: { query: jest.fn() }
}));

const { pool } = require('../src/db');

describe('GET /health', () => {
  it('deve retornar status 200 com { status: "ok" }', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/pedidos', () => {
  it('deve retornar lista de pedidos', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, cliente: 'João', item: 'Pizza', quantidade: 2 }]
    });
    const res = await request(app).get('/api/pedidos');
    expect(res.statusCode).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(Array.isArray(res.body.dados)).toBe(true);
  });

  it('deve retornar 500 em erro de banco', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB down'));
    const res = await request(app).get('/api/pedidos');
    expect(res.statusCode).toBe(500);
  });
});

describe('POST /api/pedidos', () => {
  it('deve criar pedido com dados válidos', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, cliente: 'Maria', item: 'Burguer', quantidade: 1 }]
    });
    const res = await request(app)
      .post('/api/pedidos')
      .send({ cliente: 'Maria', item: 'Burguer', quantidade: 1 });
    expect(res.statusCode).toBe(201);
    expect(res.body.sucesso).toBe(true);
  });

  it('deve retornar 400 quando faltar campos', async () => {
    const res = await request(app)
      .post('/api/pedidos')
      .send({ cliente: 'Carlos' });
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/pedidos/:id', () => {
  it('deve retornar 404 para pedido inexistente', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).get('/api/pedidos/999');
    expect(res.statusCode).toBe(404);
  });

  it('deve retornar pedido existente', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, cliente: 'Ana', item: 'Salada', quantidade: 1 }]
    });
    const res = await request(app).get('/api/pedidos/1');
    expect(res.statusCode).toBe(200);
  });
});