-- Custom SQL migration file, put your code below! --
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;  
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE INDEX IF NOT EXISTS idx_jobpost_title_trgm_gist
ON job_posts USING GIST (title gist_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_user_name_trgm_gist
ON public."user" USING GIST (name gist_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_business_name_trgm_gist
ON public."business_profile" USING GIST (name gist_trgm_ops);
CREATE EXTENSION IF NOT EXISTS vector;