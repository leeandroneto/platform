-- Migration 0001 — Purge pre-retake schema
-- Drops all custom public schema objects (preserves auth.*, storage.*, realtime.*)
-- BEFORE applying 0002_identity_foundation

-- 1. Drop all tables in public schema (cascade kills policies, triggers, sequences, indexes)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;
END $$;

-- 2. Drop all functions in public schema
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT
      p.proname AS function_name,
      pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
  LOOP
    EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.function_name)
            || '(' || r.args || ') CASCADE';
  END LOOP;
END $$;

-- 3. Drop all custom types/enums in public
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT t.typname
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
      AND (t.typtype = 'e' OR t.typtype = 'c')
      AND NOT EXISTS (SELECT 1 FROM pg_class c WHERE c.oid = t.typrelid)
  LOOP
    EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
  END LOOP;
END $$;

-- 4. Drop legacy 'platform' schema if exists (was rolled back in old project)
DROP SCHEMA IF EXISTS platform CASCADE;

-- 5. Drop legacy 'run' schema if any test left over (we chose public.*)
DROP SCHEMA IF EXISTS run CASCADE;
