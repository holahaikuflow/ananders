-- =============================================================================
-- Migración: bucket de Storage para avatars de usuario
-- Fecha: 2026-10-14
--
-- Crea el bucket "avatars" y define policies sobre storage.objects:
--   - Lectura pública (anon + authenticated) — las fotos se muestran en
--     páginas públicas del directorio.
--   - INSERT, UPDATE, DELETE restringidas al propio uid del usuario: la
--     ruta del objeto debe empezar por auth.uid(), lo que garantiza que
--     nadie puede subir o borrar archivos de otro usuario.
--
-- Idempotencia:
--   - El bucket usa ON CONFLICT DO UPDATE para que reejecutar no falle.
--   - Cada policy usa DROP POLICY IF EXISTS antes de crearse.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- Bucket
-- ---------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;


-- ---------------------------------------------------------------------------
-- Policies sobre storage.objects
-- ---------------------------------------------------------------------------

-- Lectura pública
DROP POLICY IF EXISTS "avatars: lectura pública" ON storage.objects;
CREATE POLICY "avatars: lectura pública"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- El usuario autenticado sube solo a su propia carpeta (uid/)
DROP POLICY IF EXISTS "avatars: usuario sube a su carpeta" ON storage.objects;
CREATE POLICY "avatars: usuario sube a su carpeta"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- El usuario autenticado actualiza solo objetos de su carpeta
DROP POLICY IF EXISTS "avatars: usuario actualiza su carpeta" ON storage.objects;
CREATE POLICY "avatars: usuario actualiza su carpeta"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING  ((storage.foldername(name))[1] = auth.uid()::text AND bucket_id = 'avatars')
  WITH CHECK ((storage.foldername(name))[1] = auth.uid()::text AND bucket_id = 'avatars');

-- El usuario autenticado borra solo objetos de su carpeta
DROP POLICY IF EXISTS "avatars: usuario borra su carpeta" ON storage.objects;
CREATE POLICY "avatars: usuario borra su carpeta"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
