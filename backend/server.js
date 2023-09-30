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
  
  app.post('/produtos', async (req, res) => {
    const { name, price } = req.body;
    console.log('Corpo da Requisição:', req.body); // Log para verificar o corpo da requisição
    
    if (!name || !price) {
      return res.status(400).send('Nome e preço são obrigatórios');
    }
    
    try {
      const result = await pool.query('INSERT INTO produtos(nome, preco) VALUES($1, $2) RETURNING *', [name, price]);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao inserir produto:', error); // Log para verificar erros
      res.status(500).send('Erro interno do servidor');
    }
  });
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});