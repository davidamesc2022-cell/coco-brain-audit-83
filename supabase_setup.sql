-- Ejecuta este script en el SQL Editor de tu proyecto en Supabase

-- 1. Crear tabla de Leads
CREATE TABLE public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT
);

-- 2. Crear tabla de Auditorías (Respuestas y Puntajes)
CREATE TABLE public.audits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    total_score INTEGER NOT NULL,
    area_scores JSONB NOT NULL,
    answers JSONB NOT NULL
);

-- 3. Políticas de Seguridad (Row Level Security)
-- Habilitar RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir inserciones anónimas (cualquiera puede llenar el formulario)
CREATE POLICY "Permitir inserciones publicas en leads" 
ON public.leads FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Permitir inserciones publicas en audits" 
ON public.audits FOR INSERT 
TO public 
WITH CHECK (true);

-- Crear política para lectura (Solo tú deberías poder leer, por simplicidad permitiremos leer a todos por ahora o puedes restringirlo al admin)
CREATE POLICY "Permitir lectura publica" 
ON public.leads FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Permitir lectura publica audits" 
ON public.audits FOR SELECT 
TO public 
USING (true);
