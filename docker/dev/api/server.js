const express = require('express');
const { Pool } = require('pg');

const PORT = 8080;
const HOST = '0.0.0.0';

const pool = new Pool({
  user: 'postgres',
  host: 'boca-db', // Este é o nome do serviço definido no docker-compose.api.yml
  database: 'bocadb',
  password: 'superpass',
  port: 5432,
});

const app = express();

// App
// const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/data', async (req, res) => {
  try {
    // Faz uma consulta simples ao banco de dados
    const result = await pool.query('SELECT * FROM tagtable');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao executar a consulta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Iniciar o servidor
app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});


/////-------------------2-------------------/////
// isso aqui faz todas usando pool
// const express = require('express');
// const { Pool } = require('pg');

// const PORT = 8080;
// const HOST = '0.0.0.0';

// const pool = new Pool({
//   // user: 'seu_usuario',
//   host: HOST,
//   // database: 'sua_database',
//   // password: 'sua_senha',
//   port: PORT,
// });

// const app = express();

// // App
// // const app = express();
// app.get('/', (req, res) => {
//   res.send('Hello World');
// });

// // Middleware para permitir o parsing de JSON no corpo da requisição
// app.use(express.json());

// // Função para cadastrar uma nova tag associada à competição
// const createTag = (request, response) => {
//   const id_c = parseInt(request.params.id_c);
//   const { tag_name } = request.body;

//   pool.query(
//     'INSERT INTO tags (tag_name) VALUES ($1) RETURNING tag_id',
//     [tag_name],
//     (error, result) => {
//       if (error) {
//         throw error;
//       }

//       const tag_id = result.rows[0].tag_id;

//       pool.query(
//         'INSERT INTO competition_tags (competition_id, tag_id) VALUES ($1, $2)',
//         [id_c, tag_id],
//         (error) => {
//           if (error) {
//             throw error;
//           }

//           response.status(201).json({ tag_id });
//         }
//       );
//     }
//   );
// };

// // Função para mostrar uma tag específica em uma competição
// const getTag = (request, response) => {
//   const id_c = parseInt(request.params.id_c);
//   const id_t = parseInt(request.params.id_t);

//   pool.query(
//     'SELECT tags.* FROM tags ' +
//     'JOIN competition_tags ON tags.tag_id = competition_tags.tag_id ' +
//     'WHERE competition_tags.competition_id = $1 AND competition_tags.tag_id = $2',
//     [id_c, id_t],
//     (error, result) => {
//       if (error) {
//         throw error;
//       }

//       if (result.rows.length === 0) {
//         response.status(404).json({ error: 'Tag not found in the specified competition.' });
//       } else {
//         response.status(200).json(result.rows[0]);
//       }
//     }
//   );
// };

// // Função para atualizar uma tag específica em uma competição
// const updateTag = (request, response) => {
//   const id_c = parseInt(request.params.id_c);
//   const id_t = parseInt(request.params.id_t);
//   const { tag_name } = request.body;

//   pool.query(
//     'UPDATE tags ' +
//     'SET tag_name = $1 ' +
//     'FROM competition_tags ' +
//     'WHERE tags.tag_id = competition_tags.tag_id ' +
//     'AND competition_tags.competition_id = $2 ' +
//     'AND competition_tags.tag_id = $3',
//     [tag_name, id_c, id_t],
//     (error, result) => {
//       if (error) {
//         throw error;
//       }

//       if (result.rowCount === 0) {
//         response.status(404).json({ error: 'Tag not found in the specified competition.' });
//       } else {
//         response.status(200).json({ message: 'Tag updated successfully.' });
//       }
//     }
//   );
// };

// // Função para remover uma tag específica em uma competição
// const deleteTag = (request, response) => {
//   const id_c = parseInt(request.params.id_c);
//   const id_t = parseInt(request.params.id_t);

//   pool.query(
//     'DELETE FROM competition_tags ' +
//     'WHERE competition_id = $1 AND tag_id = $2',
//     [id_c, id_t],
//     (error, result) => {
//       if (error) {
//         throw error;
//       }

//       if (result.rowCount === 0) {
//         response.status(404).json({ error: 'Tag not found in the specified competition.' });
//       } else {
//         response.status(200).json({ message: 'Tag deleted successfully.' });
//       }
//     }
//   );
// };

// // Rotas
// app.post('/api/contest/:id_c/tag', createTag);
// app.get('/api/contest/:id_c/tag/:id_t', getTag);
// app.put('/api/contest/:id_c/tag/:id_t', updateTag);
// app.delete('/api/contest/:id_c/tag/:id_t', deleteTag);

// // Iniciar o servidor
// app.listen(PORT, HOST, () => {
//   console.log(`Running on http://${HOST}:${PORT}`);
// });

/////-------------------1-------------------/////

//backup: Isso aqui funciona para uma rota só
// 'use strict';

// const express = require('express');

// // Constants
// const PORT = 8080;
// const HOST = '0.0.0.0';

// // App
// const app = express();
// app.get('/', (req, res) => {
//   res.send('Hello World');
// });

// // Nova rota
// // para acessar no browser http://localhost:49160/api/contest/1/tag
// app.get('/api/contest/:id_c/tag', (req, res) => {
//   const id_c = req.params.id_c;
//   // Lógica para obter as tags associadas à competição com o ID fornecido (id_c)
//   // Substitua a lógica abaixo pela sua implementação real
//   const tags = ['tag1', 'tag2', 'tag3'];
  
//   res.json({ competitionId: id_c, tags: tags });
// });

// app.listen(PORT, HOST, () => {
//   console.log(`Running on http://${HOST}:${PORT}`);
// });
