const express = require('express');
const { Pool } = require('pg');

const PORT = 8080;
const HOST = '0.0.0.0';

const pool = new Pool({
  user: 'postgres',
  //host: 'boca-db',//verificar se remapeia o host
  database: 'boca-db', 
  password: 'superpass',
  host: 'localhost',
  port: 8080,
});

const app = express();

// App
// const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Middleware para permitir o parsing de JSON no corpo da requisição
app.use(express.json());

app.get('/api/contest/:id_c/tag', (req, res) => {
  const id_c = req.params.id_c;
  // Lógica para obter as tags associadas à competição com o ID fornecido (id_c)
  // Substitua a lógica abaixo pela sua implementação real
  const tags = ['tag1', 'tag2', 'tag3'];
  
  res.json({ competitionId: id_c, tags: tags });
});

// Rota para obter um item por ID
app.get('/items', async (req, res) => {
  const itemId = parseInt(req.params.id);

  try {
    const item = await db.one('SELECT * FROM tagtable WHERE tagname = $1', 'group');
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Item not found' });
  }
});

// Função para cadastrar uma nova tag associada à competição
const createTag = (request, response) => {
  const id_c = parseInt(request.params.id_c);
  const { tag_name } = request.body;

  pool.query(
    'INSERT INTO tags (tag_name) VALUES ($1) RETURNING tag_id',
    [tag_name],
    (error, result) => {
      if (error) {
        throw error;
      }

      const tag_id = result.rows[0].tag_id;

      pool.query(
        'INSERT INTO competition_tags (competition_id, tag_id) VALUES ($1, $2)',
        [id_c, tag_id],
        (error) => {
          if (error) {
            throw error;
          }

          response.status(201).json({ tag_id });
        }
      );
    }
  );
};

// Função para mostrar uma tag específica em uma competição
const getTag = async (request, response) => {
  const id_c = parseInt(request.params.id_c);
  const id_t = parseInt(request.params.id_t);

  try {
    const result = await pool.query(
      'SELECT tags.* FROM tags ' +
      'JOIN competition_tags ON tags.tag_id = competition_tags.tag_id ' +
      'WHERE competition_tags.competition_id = $1 AND competition_tags.tag_id = $2',
      [id_c, id_t]
    );

    if (result.rows.length === 0) {
      response.status(404).json({ error: 'Tag not found in the specified competition.' });
    } else {
      response.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error('Erro ao buscar tag:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
};

// Função para atualizar uma tag específica em uma competição
const updateTag = async (request, response) => {
  const id_c = parseInt(request.params.id_c);
  const id_t = parseInt(request.params.id_t);
  const { tag_name } = request.body;

  try {
    const result = await pool.query(
      'UPDATE tags ' +
      'SET tag_name = $1 ' +
      'FROM competition_tags ' +
      'WHERE tags.tag_id = competition_tags.tag_id ' +
      'AND competition_tags.competition_id = $2 ' +
      'AND competition_tags.tag_id = $3',
      [tag_name, id_c, id_t]
    );

    if (result.rowCount === 0) {
      response.status(404).json({ error: 'Tag not found in the specified competition.' });
    } else {
      response.status(200).json({ message: 'Tag updated successfully.' });
    }
  } catch (error) {
    console.error('Erro ao atualizar tag:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
};

// Função para remover uma tag específica em uma competição
const deleteTag = async (request, response) => {
  const id_c = parseInt(request.params.id_c);
  const id_t = parseInt(request.params.id_t);

  try {
    const result = await pool.query(
      'DELETE FROM competition_tags ' +
      'WHERE competition_id = $1 AND tag_id = $2',
      [id_c, id_t]
    );

    if (result.rowCount === 0) {
      response.status(404).json({ error: 'Tag not found in the specified competition.' });
    } else {
      response.status(200).json({ message: 'Tag deleted successfully.' });
    }
  } catch (error) {
    console.error('Erro ao deletar tag:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
};

// Rotas
app.post('/api/contest/:id_c/tag', createTag);
app.get('/api/contest/:id_c/tag/:id_t', getTag);
app.put('/api/contest/:id_c/tag/:id_t', updateTag);
app.delete('/api/contest/:id_c/tag/:id_t', deleteTag);

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
