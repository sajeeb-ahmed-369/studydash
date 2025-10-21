
-- Migration: create exam tables
CREATE TABLE IF NOT EXISTS exams (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  duration_minutes INT DEFAULT 0,
  created_by INT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  exam_id INT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  question_text TEXT NOT NULL,
  choices JSONB,
  correct_answer TEXT,
  marks NUMERIC DEFAULT 1,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exam_attempts (
  id SERIAL PRIMARY KEY,
  exam_id INT NOT NULL REFERENCES exams(id),
  user_id INT NOT NULL,
  started_at TIMESTAMP DEFAULT now(),
  finished_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'in_progress',
  total_marks NUMERIC DEFAULT 0,
  auto_marks NUMERIC DEFAULT 0,
  manual_marks NUMERIC DEFAULT 0,
  meta JSONB,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS attempt_answers (
  id SERIAL PRIMARY KEY,
  attempt_id INT NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
  question_id INT NOT NULL REFERENCES questions(id),
  answer_text TEXT,
  answer_json JSONB,
  is_auto_corrected BOOLEAN DEFAULT FALSE,
  auto_score NUMERIC DEFAULT 0,
  manual_score NUMERIC DEFAULT 0,
  grader_id INT,
  grading_notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

