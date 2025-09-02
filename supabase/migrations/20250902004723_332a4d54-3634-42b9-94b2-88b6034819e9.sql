-- Add missing fields to services table
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS number TEXT,
ADD COLUMN IF NOT EXISTS cep TEXT;