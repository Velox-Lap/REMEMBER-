-- Guest access to PROJECT 29.12 is read-only.
-- RLS limits visible rows; explicit grants also remove unnecessary write
-- privileges from the anon role as defense in depth.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
ON TABLE
  public.project_2912_content,
  public.project_2912_memories,
  public.project_2912_questions
FROM anon;
