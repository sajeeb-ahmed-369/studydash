/**
 * Run DB migrations from migrations/*.sql against DATABASE_URL.
 * Usage: node scripts/run_migrations.js
 * Ensure .env has DATABASE_URL set.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function main(){
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false });
  try {
    console.log('Connected to DB');
    const migDir = path.join(__dirname, '..', 'migrations');
    const files = fs.readdirSync(migDir).filter(f => f.endsWith('.sql')).sort();
    for(const f of files){
      const p = path.join(migDir, f);
      const sql = fs.readFileSync(p, 'utf-8');
      console.log('Running migration:', f);
      await pool.query(sql);
      console.log('OK:', f);
    }
    console.log('All migrations applied.');
  } catch (err) {
    console.error('Migration error:', err.message || err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
