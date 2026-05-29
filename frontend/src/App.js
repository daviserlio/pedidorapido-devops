import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [pedidos, setPedidos] = useState([]);
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({ cliente: '', item: '', quantidade: 1 });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    verificarSaude();
    buscarPedidos();
  }, []);

  async function verificarSaude() {
    try {
      const res = await fetch(`${API_URL}/health`);
      const data = await res.json();
      setStatus(data.status === 'ok' ? '✅ API online' : '⚠️ API com problema');
    } catch {
      setStatus('❌ API offline');
    }
  }

  async function buscarPedidos() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/pedidos`);
      const data = await res.json();
      if (data.sucesso) setPedidos(data.dados);
    } catch {
      setErro('Não foi possível carregar os pedidos.');
    } finally {
      setLoading(false);
    }
  }

  async function enviarPedido(e) {
    e.preventDefault();
    setErro('');
    try {
      const res = await fetch(`${API_URL}/api/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.sucesso) {
        setForm({ cliente: '', item: '', quantidade: 1 });
        buscarPedidos();
      } else {
        setErro(data.erro);
      }
    } catch {
      setErro('Erro ao enviar pedido.');
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.titulo}>🍔 PedidoRápido</h1>
        <span style={styles.badge}>{status || '⏳ Verificando...'}</span>
      </header>

      <section style={styles.card}>
        <h2>Novo Pedido</h2>
        <form onSubmit={enviarPedido} style={styles.form}>
          <input style={styles.input} placeholder="Nome do cliente"
            value={form.cliente} onChange={e => setForm({ ...form, cliente: e.target.value })} required />
          <input style={styles.input} placeholder="Item do pedido"
            value={form.item} onChange={e => setForm({ ...form, item: e.target.value })} required />
          <input style={styles.input} type="number" min="1" placeholder="Quantidade"
            value={form.quantidade} onChange={e => setForm({ ...form, quantidade: parseInt(e.target.value) })} required />
          {erro && <p style={styles.erro}>{erro}</p>}
          <button style={styles.btn} type="submit">Fazer Pedido</button>
        </form>
      </section>

      <section style={styles.card}>
        <h2>Pedidos Realizados</h2>
        {loading ? <p>Carregando...</p> : pedidos.length === 0 ? (
          <p style={styles.vazio}>Nenhum pedido ainda.</p>
        ) : (
          <table style={styles.tabela}>
            <thead><tr><th>ID</th><th>Cliente</th><th>Item</th><th>Qtd</th></tr></thead>
            <tbody>
              {pedidos.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td><td>{p.cliente}</td><td>{p.item}</td><td>{p.quantidade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button style={{ ...styles.btn, marginTop: '12px' }} onClick={buscarPedidos}>
          🔄 Atualizar
        </button>
      </section>
    </div>
  );
}

const styles = {
  container: { maxWidth: 700, margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  titulo: { margin: 0, color: '#e85d04' },
  badge: { background: '#f0f4ff', padding: '6px 12px', borderRadius: 20, fontSize: 14 },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, marginBottom: 20 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: { padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 15 },
  btn: { background: '#e85d04', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 15 },
  erro: { color: '#dc2626', margin: 0 },
  vazio: { color: '#94a3b8' },
  tabela: { width: '100%', borderCollapse: 'collapse' }
};

export default App;