-- ==============================================================================
-- DISTRIBUIDORA ALVARADO - HARDENING DE SEGURIDAD Y POLÍTICAS RLS (PostgreSQL / Supabase)
-- ==============================================================================
-- Este script garantiza la seguridad de los datos impidiendo escrituras de usuarios anon
-- y aplicando políticas de solo lectura en las tablas públicas del catálogo.

-- 1. Habilitar RLS (Row Level Security) explícito en las tablas de la base de datos
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;

-- 2. Revocar privilegios de modificación/escritura para el rol público no autenticado (anon)
REVOKE INSERT, UPDATE, DELETE ON public.categories FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.products FROM anon;

-- 3. Otorgar exclusivamente privilegios de lectura (SELECT) al rol anon
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.products TO anon;

-- 4. Crear o reemplazar políticas RLS defensivas de solo lectura para el rol anon
DROP POLICY IF EXISTS "Permitir lectura publica de categorias" ON public.categories;
CREATE POLICY "Permitir lectura publica de categorias"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Permitir lectura publica de productos disponibles" ON public.products;
CREATE POLICY "Permitir lectura publica de productos disponibles"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (is_available = true);
