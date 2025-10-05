const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'estoque',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Initialize database table
const initDb = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS produtos (
      id SERIAL PRIMARY KEY,
      nome_massa VARCHAR(255) NOT NULL,
      tipo_massa VARCHAR(50) NOT NULL CHECK (tipo_massa IN ('congelada', 'fresca')),
      quantia INTEGER NOT NULL DEFAULT 0,
      em_falta BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    await pool.query(query);
    console.log('Database table initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initDb();

// Routes

// Get all products
app.get('/api/produtos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM produtos ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
app.get('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product
app.post('/api/produtos', async (req, res) => {
  try {
    const { nome_massa, tipo_massa, quantia, em_falta } = req.body;
    
    if (!nome_massa || !tipo_massa) {
      return res.status(400).json({ error: 'nome_massa and tipo_massa are required' });
    }
    
    if (!['congelada', 'fresca'].includes(tipo_massa)) {
      return res.status(400).json({ error: 'tipo_massa must be either "congelada" or "fresca"' });
    }
    
    const result = await pool.query(
      'INSERT INTO produtos (nome_massa, tipo_massa, quantia, em_falta) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome_massa, tipo_massa, quantia || 0, em_falta || false]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
app.put('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_massa, tipo_massa, quantia, em_falta } = req.body;
    
    if (tipo_massa && !['congelada', 'fresca'].includes(tipo_massa)) {
      return res.status(400).json({ error: 'tipo_massa must be either "congelada" or "fresca"' });
    }
    
    const result = await pool.query(
      `UPDATE produtos 
       SET nome_massa = COALESCE($1, nome_massa),
           tipo_massa = COALESCE($2, tipo_massa),
           quantia = COALESCE($3, quantia),
           em_falta = COALESCE($4, em_falta),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [nome_massa, tipo_massa, quantia, em_falta, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
app.delete('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM produtos WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully', product: result.rows[0] });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
