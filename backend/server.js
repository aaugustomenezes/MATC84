const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'matc84',
  password: 'netto123',
  port: 5432,
});

app.get('/produtos', async (req, res) => {
    const result = await pool.query('SELECT * FROM produtos');
    res.json(result.rows);
  });

  app.delete('/produtos/:id', async (req, res) => {
  const { id } = req.params
    try {

      await pool.query('DELETE FROM produtos WHERE id = $1', [id])

      res.status(200).send({message : 'Product deleted successfully!'})
    } catch (error) {
      console.error("Error deleting product:", error);
        res.status(500).send({message : 'Failed to delet the product'})
    }
  })
  
app.post('/produtos', async (req, res) => {
  const { name, price } = req.body;
  console.log('Corpo da Requisição:', req.body); // Log para verificar o corpo da requisição
  
  if (!name || !price) {
    return res.status(400).send('Nome e preço são obrigatórios');
  }
  
  try {
    const result = await pool.query('INSERT INTO produtos(name, price) VALUES($1, $2) RETURNING *', [name, price]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao inserir produto:', error); // Log para verificar erros
    res.status(500).send('Erro interno do servidor');
  }
});

app.get('/produtos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).send({ message: 'Produto não encontrado!' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).send({ message: 'Erro ao buscar o produto' });
  }
});

app.put('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).send('Nome e preço são obrigatórios');
  }

  try {
    const result = await pool.query('UPDATE produtos SET name = $1, price = $2 WHERE id = $3 RETURNING *', [name, price, id]);

    if (result.rows.length === 0) {
      res.status(404).send({ message: 'Produto não encontrado!' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({ message: 'Erro ao atualizar o produto' });
  }
});

const port = 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});