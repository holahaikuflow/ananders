-- =============================================================================
-- Permisos de Postgres para los roles de Supabase
-- Fecha: 2026-10-14
--
-- En Supabase, RLS y GRANT son capas independientes.
-- RLS decide qué filas ve un rol dado; GRANT decide si el rol puede tocar
-- la tabla en absoluto. Si falta el GRANT, Postgres devuelve 42501
-- (permission denied) antes de evaluar cualquier policy de RLS.
--
-- Este archivo complementa la migración inicial: las policies ya están,
-- aquí se dan los permisos de nivel tabla que las hacen accesibles.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- Tablas de directorio público
-- anon y authenticated pueden SELECT (las policies de RLS filtran las filas).
-- authenticated puede INSERT y UPDATE (para su propia fila).
-- Sin DELETE explícito: el borrado de profiles lo dispara auth.users en cascada.
-- ---------------------------------------------------------------------------

GRANT SELECT          ON public.profiles     TO anon, authenticated;
GRANT INSERT, UPDATE  ON public.profiles     TO authenticated;

GRANT SELECT          ON public.seekers      TO anon, authenticated;
GRANT INSERT, UPDATE  ON public.seekers      TO authenticated;

GRANT SELECT          ON public.facilitators TO anon, authenticated;
GRANT INSERT, UPDATE  ON public.facilitators TO authenticated;

-- experiences: anon SELECT (solo publicadas, vía RLS); authenticated SELECT
-- completo (los borradores los filtra RLS), más INSERT/UPDATE/DELETE para
-- el facilitador dueño.
GRANT SELECT                  ON public.experiences TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE  ON public.experiences TO authenticated;


-- ---------------------------------------------------------------------------
-- Tablas privadas — solo authenticated
-- Las policies de RLS ya garantizan que cada usuario ve solo lo suyo.
-- ---------------------------------------------------------------------------

-- applications: el seeker inserta; el facilitador hace UPDATE (solo estado,
-- controlado por trigger). Sin DELETE.
GRANT SELECT, INSERT, UPDATE ON public.applications TO authenticated;

-- messages: SELECT e INSERT para participantes. Sin UPDATE ni DELETE
-- (mensajes inmutables por decisión de producto).
GRANT SELECT, INSERT ON public.messages TO authenticated;
