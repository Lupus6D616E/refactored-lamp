-- Custom SQL migration file, put your code below! --
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;  
CREATE INDEX idx_jobpost_title_trgm_gist
ON job_posts USING GIST (title gist_trgm_ops);