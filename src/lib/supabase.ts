import { createClient } from '@supabase/supabase-js';

// Reemplaza estas URLs y Claves por las de tu propio proyecto en Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xxxxxxxxxxxxxx.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJxxxxxxxxxxxxxx';

export const supabase = createClient(supabaseUrl, supabaseKey);
