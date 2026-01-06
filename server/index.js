import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
}

// Create templates table if it doesn't exist
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        width INTEGER NOT NULL,
        height INTEGER NOT NULL,
        background_color VARCHAR(7),
        background_gradient JSONB,
        layers JSONB DEFAULT '[]',
        output_format VARCHAR(10) DEFAULT 'png',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// API Routes

// Get all templates
app.get('/api/templates', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM templates ORDER BY updated_at DESC');
    res.json(result.rows.map(row => ({
      id: row.id,
      name: row.name,
      width: row.width,
      height: row.height,
      backgroundColor: row.background_color,
      backgroundGradient: row.background_gradient,
      layers: row.layers,
      outputFormat: row.output_format,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    })));
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Get single template
app.get('/api/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM templates WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    const row = result.rows[0];
    res.json({
      id: row.id,
      name: row.name,
      width: row.width,
      height: row.height,
      backgroundColor: row.background_color,
      backgroundGradient: row.background_gradient,
      layers: row.layers,
      outputFormat: row.output_format,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// Create template
app.post('/api/templates', async (req, res) => {
  try {
    const { name, width, height, backgroundColor, backgroundGradient, layers, outputFormat } = req.body;
    
    const result = await pool.query(
      `INSERT INTO templates (name, width, height, background_color, background_gradient, layers, output_format)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, width, height, backgroundColor, backgroundGradient, layers || [], outputFormat || 'png']
    );
    
    const row = result.rows[0];
    res.json({
      id: row.id,
      name: row.name,
      width: row.width,
      height: row.height,
      backgroundColor: row.background_color,
      backgroundGradient: row.background_gradient,
      layers: row.layers,
      outputFormat: row.output_format,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

// Update template
app.put('/api/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, width, height, backgroundColor, backgroundGradient, layers, outputFormat } = req.body;
    
    const result = await pool.query(
      `UPDATE templates 
       SET name = $1, width = $2, height = $3, background_color = $4, 
           background_gradient = $5, layers = $6, output_format = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [name, width, height, backgroundColor, backgroundGradient, layers, outputFormat, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    const row = result.rows[0];
    res.json({
      id: row.id,
      name: row.name,
      width: row.width,
      height: row.height,
      backgroundColor: row.background_color,
      backgroundGradient: row.background_gradient,
      layers: row.layers,
      outputFormat: row.output_format,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
});

// Delete template
app.delete('/api/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM templates WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

// Duplicate template
app.post('/api/templates/:id/duplicate', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    // First get the original template
    const original = await pool.query('SELECT * FROM templates WHERE id = $1', [id]);
    
    if (original.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    const orig = original.rows[0];
    
    // Create duplicate
    const result = await pool.query(
      `INSERT INTO templates (name, width, height, background_color, background_gradient, layers, output_format)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        name || `${orig.name} (Copy)`,
        orig.width,
        orig.height,
        orig.background_color,
        orig.background_gradient,
        orig.layers,
        orig.output_format
      ]
    );
    
    const row = result.rows[0];
    res.json({
      id: row.id,
      name: row.name,
      width: row.width,
      height: row.height,
      backgroundColor: row.background_color,
      backgroundGradient: row.background_gradient,
      layers: row.layers,
      outputFormat: row.output_format,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  } catch (error) {
    console.error('Error duplicating template:', error);
    res.status(500).json({ error: 'Failed to duplicate template' });
  }
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});