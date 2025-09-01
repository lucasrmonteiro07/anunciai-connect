-- Add missing address fields to services table
ALTER TABLE public.services 
ADD COLUMN number TEXT,
ADD COLUMN neighborhood TEXT,
ADD COLUMN cep TEXT;