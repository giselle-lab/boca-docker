const express = require('express');
const { Pool } = require('pg');

const PORT = 8080;
const HOST = '0.0.0.0';

const pool = new Pool({
  user: 'postgres',
  host: 'boca-db',
  database: 'bocadb',
  password: 'superpass',
  port: 5432,
});

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api', async (req, res) => {
  try {
    // Faz uma consulta simples ao banco de dados
    const result = await pool.query('SELECT * FROM tagtable');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao executar a consulta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para listar tags associadas a uma competição
app.get('/api/:entity_type/:id_c/tag', async (req, res) => {
  const { entity_type, id_c } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM tagtable WHERE entity_type = $1 AND entity_id = $2',
      [entity_type, id_c]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(`Erro ao obter tags de ${entity_type}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para cadastrar uma nova tag associada a uma competição
app.post('/api/:entity_type/:id_c/tag', async (req, res) => {
  const { entity_type, id_c } = req.params;
  const { tag_name, tag_value } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO tagtable (entity_type, entity_id, tag_name, tag_value, updatetime) VALUES ($1, $2, $3, $4, $5) RETURNING tag_id',
      [entity_type, id_c, tag_name, tag_value, Math.floor(Date.now() / 1000)]
    );

    const tag_id = result.rows[0].tag_id;

    res.status(201).json({ tag_id });
  } catch (error) {
    console.error('Erro ao criar tag da competição:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para mostrar uma tag específica associada a uma competição
app.get('/api/:entity_type/:id_c/tag/:id_t', async (req, res) => {
  const { entity_type,id_c, id_t } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM tagtable WHERE entity_type = $1 AND entity_id = $2 AND tag_id = $3',
      [entity_type, id_c, id_t]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Tag not found in the specified competition.' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error('Erro ao obter tag da competição:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para atualizar uma tag específica associada a uma competição
app.put('/api/:entity_type/:id_c/tag/:id_t', async (req, res) => {
  const { entity_type, id_c, id_t } = req.params;
  const { tag_name, tag_value } = req.body;

  try {
    const result = await pool.query(
      'UPDATE tagtable SET tag_name = $1, tag_value = $2, updatetime = $3 WHERE entity_type = $4 AND entity_id = $5 AND tag_id = $6 RETURNING *',
      [tag_name, tag_value, Math.floor(Date.now() / 1000), entity_type, id_c, id_t]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Tag not found in the specified competition.' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error('Erro ao atualizar tag da competição:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para remover uma tag específica associada a uma competição
app.delete('/api/:entity_type/:id_c/tag/:id_t', async (req, res) => {
  const { id_c, id_t } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM tagtable WHERE entity_type = $1 AND entity_id = $2 AND tag_id = $3 RETURNING *',
      [entity_type, id_c, id_t]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Tag not found in the specified competition.' });
    } else {
      res.status(200).json({ message: 'Tag deleted successfully.' });
    }
  } catch (error) {
    console.error('Erro ao excluir tag da competição:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
