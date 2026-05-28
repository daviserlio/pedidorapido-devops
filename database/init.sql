-- Inicialização do banco PedidoRápido
CREATE TABLE IF NOT EXISTS pedidos (
    id          SERIAL PRIMARY KEY,
    cliente     VARCHAR(100) NOT NULL,
    item        VARCHAR(100) NOT NULL,
    quantidade  INTEGER      NOT NULL CHECK (quantidade > 0),
    status      VARCHAR(20)  NOT NULL DEFAULT 'pendente',
    criado_em   TIMESTAMP    NOT NULL DEFAULT NOW()
);

INSERT INTO pedidos (cliente, item, quantidade, status) VALUES
    ('Alice',  'Pizza Margherita', 2, 'entregue'),
    ('Bruno',  'Hambúrguer Duplo', 1, 'em preparo'),
    ('Carla',  'Salada Caesar',    1, 'pendente');

CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente);