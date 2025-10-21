-- Seed exam and questions
INSERT INTO exams (title, slug, description, duration_minutes, created_by) VALUES ('Web Design & JavaScript Final Exam','web-design-js-final','Final exam covering HTML,CSS,Bootstrap,JS',150,1) ON CONFLICT DO NOTHING;

-- Questions are available in seed/exam_questions.json; use your migration/import script to load them into 'questions' table.
