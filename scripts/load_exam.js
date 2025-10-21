/**
 * Run: node scripts/load_exam.js
 * This script reads seed/exam_questions.json and inserts the exam and questions into the DB.
 * Ensure .env has DATABASE_URL and run migrations first.
 */
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function main(){
  const seedPath = path.join(__dirname, '..', 'seed', 'exam_questions.json');
  const data = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
  try{
    // ensure exam exists
    const examRes = await pool.query("SELECT id FROM exams WHERE slug='web-design-js-final'");
    let examId;
    if(examRes.rows.length===0){
      const r = await pool.query("INSERT INTO exams (title, slug, description, duration_minutes, created_by) VALUES ($1,$2,$3,$4,$5) RETURNING id",
        ['Web Design & JavaScript Final Exam','web-design-js-final','Final exam covering HTML,CSS,Bootstrap,JS',150,1]);
      examId = r.rows[0].id;
      console.log('Created exam id', examId);
    } else {
      examId = examRes.rows[0].id;
      console.log('Found exam id', examId);
    }

    // insert questions
    for(const q of data){
      await pool.query(
        `INSERT INTO questions (exam_id,type,language,question_text,choices,correct_answer,marks,order_index,created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now())`,
        [examId, q.type, q.language || 'en', q.question_text, q.choices ? JSON.stringify(q.choices) : null, q.correct_answer || null, q.marks || 0, q.order_index || 0]
      );
    }
    console.log('Inserted questions:', data.length);
  }catch(e){
    console.error(e);
  }finally{
    await pool.end();
  }
}

main();
