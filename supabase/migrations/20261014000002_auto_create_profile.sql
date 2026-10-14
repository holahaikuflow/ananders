-- =============================================================================
-- Migración: creación automática de perfil al registrar usuario
-- Fecha: 2026-10-14
--
-- Cuando Supabase Auth inserta una fila en auth.users, este trigger
-- materializa de inmediato las filas correspondientes en profiles y en
-- seekers o facilitators, tomando name y role de raw_user_meta_data.
--
-- SECURITY DEFINER: necesario porque en el momento en que corre el trigger
-- no existe sesión activa (auth.uid() es NULL). Las tablas tienen RLS
-- habilitado con policies que requieren id = auth.uid(), así que sin este
-- flag los inserts fallarían con "new row violates row-level security".
-- Con SECURITY DEFINER la función corre como su owner (postgres), que no
-- está sujeto a RLS.
--
-- SET search_path = public: las funciones SECURITY DEFINER son un vector de
-- ataque si su search_path es mutable. Un usuario con permisos de CREATE
-- SCHEMA podría crear objetos homónimos que la función privilegiada invocaría
-- en su lugar. Fijar el search_path cierra ese vector.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- Función: handle_new_user
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name text;
  v_role public.user_role;
BEGIN
  v_name := NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), '');

  -- Intentar castear el valor a user_role.
  -- Si es NULL o no es un valor válido del enum, se usa 'seeker' por defecto.
  BEGIN
    v_role := (NEW.raw_user_meta_data->>'role')::public.user_role;
  EXCEPTION WHEN invalid_text_representation THEN
    v_role := 'seeker';
  END;

  IF v_role IS NULL THEN
    v_role := 'seeker';
  END IF;

  -- Insertar en profiles. Si ya existe (idempotente), no hace nada.
  -- nombre: usa el name del metadata; si viene vacío, usa el prefijo del email.
  INSERT INTO public.profiles (id, nombre, rol)
  VALUES (
    NEW.id,
    COALESCE(v_name, split_part(NEW.email, '@', 1)),
    v_role
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insertar la fila de extensión según el rol.
  IF v_role = 'facilitator' THEN
    INSERT INTO public.facilitators (id)
    VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;
  ELSE
    INSERT INTO public.seekers (id)
    VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;


-- ---------------------------------------------------------------------------
-- Trigger: se dispara después de cada INSERT en auth.users
-- ---------------------------------------------------------------------------

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ---------------------------------------------------------------------------
-- Backfill: usuarios que ya existen en auth.users sin fila en profiles
--
-- Aplica la misma lógica que la función para no dejar usuarios huérfanos.
-- Los ON CONFLICT DO NOTHING hacen que reejecutar este bloque no rompa nada.
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  u      RECORD;
  v_name text;
  v_role public.user_role;
BEGIN
  FOR u IN
    SELECT au.id, au.email, au.raw_user_meta_data
    FROM auth.users au
    WHERE NOT EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = au.id
    )
  LOOP
    v_name := NULLIF(TRIM(u.raw_user_meta_data->>'name'), '');

    BEGIN
      v_role := (u.raw_user_meta_data->>'role')::public.user_role;
    EXCEPTION WHEN invalid_text_representation THEN
      v_role := 'seeker';
    END;

    IF v_role IS NULL THEN
      v_role := 'seeker';
    END IF;

    INSERT INTO public.profiles (id, nombre, rol)
    VALUES (
      u.id,
      COALESCE(v_name, split_part(u.email, '@', 1)),
      v_role
    )
    ON CONFLICT (id) DO NOTHING;

    IF v_role = 'facilitator' THEN
      INSERT INTO public.facilitators (id)
      VALUES (u.id)
      ON CONFLICT (id) DO NOTHING;
    ELSE
      INSERT INTO public.seekers (id)
      VALUES (u.id)
      ON CONFLICT (id) DO NOTHING;
    END IF;
  END LOOP;
END;
$$;
