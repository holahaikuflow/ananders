-- =============================================================================
-- Migración inicial: esquema completo de Ananders
-- Fecha: 2026-10-14
--
-- Ananders conecta buscadores (Anander) con facilitadores de experiencias
-- espirituales. El buscador postula a una experiencia publicada por un
-- facilitador, y el chat se abre dentro de esa postulación.
-- No hay pagos en la plataforma; el precio se negocia en el chat.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- Tipos enum
-- Usar enum en lugar de CHECK CONSTRAINT hace que el tipo sea parte del
-- esquema, aparezca en los tipos generados por Supabase CLI y sea imposible
-- insertar un valor fuera del rango sin alterar la migración.
-- ---------------------------------------------------------------------------

CREATE TYPE public.user_role AS ENUM ('seeker', 'facilitator');

CREATE TYPE public.experience_type AS ENUM (
  'ayahuasca',
  'vipassana',
  'yoga',
  'sufismo',
  'psilocibina',
  'otro'
);

CREATE TYPE public.experience_modality AS ENUM ('voluntariado', 'pago', 'ambas');
CREATE TYPE public.experience_format   AS ENUM ('con_fecha', 'permanente');

CREATE TYPE public.application_status AS ENUM (
  'enviada',
  'aceptada',
  'rechazada',
  'concretada'
);


-- ---------------------------------------------------------------------------
-- Función compartida: updated_at automático
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;


-- ---------------------------------------------------------------------------
-- profiles
--
-- Nodo central del esquema. id es a la vez PK y FK a auth.users, por lo que
-- un perfil no puede existir sin una cuenta de Auth, y eliminar la cuenta
-- borra el perfil en cascada.
--
-- seekers y facilitators extienden profiles con una relación 1-a-1: usan el
-- mismo id como PK (sin columna surrogate extra), lo que garantiza que cada
-- usuario tenga como máximo una extensión de cada tipo.
-- ---------------------------------------------------------------------------

CREATE TABLE public.profiles (
  id         uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre     text        NOT NULL,
  foto       text,
  pais       text,
  idiomas    text[]      NOT NULL DEFAULT '{}',
  rol        public.user_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ---------------------------------------------------------------------------
-- seekers
-- ---------------------------------------------------------------------------

CREATE TABLE public.seekers (
  id          uuid        PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  sobre_mi    text,
  que_busco   text[]      NOT NULL DEFAULT '{}',
  que_ofrezco text,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_seekers_updated_at
  BEFORE UPDATE ON public.seekers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ---------------------------------------------------------------------------
-- facilitators
--
-- galeria es un array de URLs. Las imágenes viven en Supabase Storage; aquí
-- solo guardamos los URLs resultantes, sin tabla de relación separada.
-- ---------------------------------------------------------------------------

CREATE TABLE public.facilitators (
  id            uuid        PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  nombre_centro text,
  ubicacion     text,
  tradicion     text,
  historia      text,
  galeria       text[]      NOT NULL DEFAULT '{}',
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_facilitators_updated_at
  BEFORE UPDATE ON public.facilitators
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ---------------------------------------------------------------------------
-- experiences
--
-- facilitator_id referencia profiles (no facilitators) para simplificar los
-- joins: profiles garantiza que el usuario existe; la pertenencia al rol
-- 'facilitator' se valida en la lógica de la aplicación.
--
-- publicada=false es borrador: el facilitador lo ve pero no aparece en el
-- directorio público ni acepta postulaciones.
-- ---------------------------------------------------------------------------

CREATE TABLE public.experiences (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  facilitator_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  titulo            text        NOT NULL,
  tipo              public.experience_type     NOT NULL,
  pais              text,
  modalidad         public.experience_modality NOT NULL,
  formato           public.experience_format   NOT NULL,
  fecha_inicio      date,
  fecha_fin         date,
  cupos             int,
  duracion_min_dias int,
  duracion_max_dias int,
  disponibilidad    text,
  que_incluye       text,
  que_se_espera     text,
  publicada         boolean     NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_experiences_updated_at
  BEFORE UPDATE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ---------------------------------------------------------------------------
-- applications
--
-- UNIQUE (seeker_id, experience_id): impide postulaciones duplicadas al
-- mismo par sin lógica extra en el frontend.
--
-- mensaje_inicial pertenece al seeker y es inmutable tras la creación.
-- La policy de UPDATE solo la pueden invocar facilitadores, y el trigger
-- protect_application_columns es la segunda capa de protección: rechaza
-- cualquier intento de modificar columnas distintas a `estado`, sin importar
-- quién haga el UPDATE.
--
-- Decisión sobre estado: se optó por un trigger en lugar de una tabla
-- separada application_status_log. Una tabla de log sería más expresiva si
-- necesitáramos auditar transiciones, pero para el MVP añade complejidad sin
-- beneficio real. El trigger es simple, legible y suficiente.
-- ---------------------------------------------------------------------------

CREATE TABLE public.applications (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id       uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  experience_id   uuid        NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  estado          public.application_status NOT NULL DEFAULT 'enviada',
  mensaje_inicial text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (seeker_id, experience_id)
);

CREATE OR REPLACE FUNCTION public.protect_application_columns()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.seeker_id       IS DISTINCT FROM OLD.seeker_id       OR
     NEW.experience_id   IS DISTINCT FROM OLD.experience_id   OR
     NEW.mensaje_inicial IS DISTINCT FROM OLD.mensaje_inicial OR
     NEW.created_at      IS DISTINCT FROM OLD.created_at
  THEN
    RAISE EXCEPTION
      'Solo el campo estado puede modificarse en una postulación existente.';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_protect_application_columns
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.protect_application_columns();


-- ---------------------------------------------------------------------------
-- messages
--
-- Chat dentro de una postulación. sender_id puede ser seeker o facilitador.
--
-- Decisión de producto: los mensajes son INMUTABLES.
-- No existe policy de UPDATE ni de DELETE en esta tabla.
-- Razón: el chat sirve como registro de lo acordado entre las partes
-- (precio, fechas, condiciones). Permitir edición o borrado comprometería
-- la confianza de ambos lados en ese registro. Si hay un error, se envía
-- un mensaje de corrección; el hilo permanece íntegro.
-- ---------------------------------------------------------------------------

CREATE TABLE public.messages (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid        NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  sender_id      uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  contenido      text        NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);


-- =============================================================================
-- Row Level Security
-- =============================================================================

ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seekers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilitators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages     ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------------------------
-- profiles — RLS
--
-- USING (true) es deliberado y seguro aquí.
-- Los datos de profiles son información de directorio que el usuario hace
-- pública al registrarse: nombre, foto, país, idiomas y rol. No hay datos
-- de contacto, credenciales ni conversaciones. El producto es un directorio
-- abierto; ocultar perfiles a usuarios no autenticados rompería la
-- propuesta de valor.
-- ---------------------------------------------------------------------------

CREATE POLICY "profiles: lectura pública"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles: insertar propio"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles: editar propio"
  ON public.profiles FOR UPDATE
  USING     (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Sin DELETE: borrar una cuenta se gestiona vía auth.users, que elimina
-- el perfil en cascada. No se expone borrado directo de la fila.


-- ---------------------------------------------------------------------------
-- seekers — RLS
--
-- Mismo razonamiento que profiles: información de directorio público.
-- ---------------------------------------------------------------------------

CREATE POLICY "seekers: lectura pública"
  ON public.seekers FOR SELECT
  USING (true);

CREATE POLICY "seekers: insertar propio"
  ON public.seekers FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "seekers: editar propio"
  ON public.seekers FOR UPDATE
  USING     (id = auth.uid())
  WITH CHECK (id = auth.uid());


-- ---------------------------------------------------------------------------
-- facilitators — RLS
-- ---------------------------------------------------------------------------

CREATE POLICY "facilitators: lectura pública"
  ON public.facilitators FOR SELECT
  USING (true);

CREATE POLICY "facilitators: insertar propio"
  ON public.facilitators FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "facilitators: editar propio"
  ON public.facilitators FOR UPDATE
  USING     (id = auth.uid())
  WITH CHECK (id = auth.uid());


-- ---------------------------------------------------------------------------
-- experiences — RLS
--
-- SELECT anon: solo experiencias publicadas. Los borradores son privados.
-- SELECT autenticado: la policy anterior aplica para todos; la siguiente
--   es adicional y permite al facilitador ver también sus propios borradores.
--   Postgres ORea las policies del mismo comando.
-- INSERT/UPDATE/DELETE: solo el facilitador dueño.
-- ---------------------------------------------------------------------------

CREATE POLICY "experiences: lectura pública (solo publicadas)"
  ON public.experiences FOR SELECT
  USING (publicada = true);

CREATE POLICY "experiences: facilitador ve sus borradores"
  ON public.experiences FOR SELECT
  USING (facilitator_id = auth.uid());

CREATE POLICY "experiences: facilitador inserta"
  ON public.experiences FOR INSERT
  WITH CHECK (facilitator_id = auth.uid());

CREATE POLICY "experiences: facilitador edita las suyas"
  ON public.experiences FOR UPDATE
  USING     (facilitator_id = auth.uid())
  WITH CHECK (facilitator_id = auth.uid());

CREATE POLICY "experiences: facilitador elimina las suyas"
  ON public.experiences FOR DELETE
  USING (facilitator_id = auth.uid());


-- ---------------------------------------------------------------------------
-- applications — RLS
--
-- Privadas: solo el seeker que postuló y el facilitador de esa experiencia.
-- Se usan subqueries EXISTS en lugar de funciones helper para que el plan
-- de ejecución sea más legible y no dependa de SECURITY DEFINER.
--
-- INSERT: el seeker solo puede postular a experiencias publicadas.
--   Esto impide postular a borradores aunque se conozca el UUID.
--
-- UPDATE: solo el facilitador puede cambiar el estado. El trigger
--   protect_application_columns es la segunda capa: garantiza que no se
--   modifiquen otras columnas aunque la policy lo permitiera.
--
-- DELETE: bloqueado. Las postulaciones son registro permanente de la
--   relación entre seeker y facilitador.
-- ---------------------------------------------------------------------------

CREATE POLICY "applications: seeker ve las suyas"
  ON public.applications FOR SELECT
  USING (seeker_id = auth.uid());

CREATE POLICY "applications: facilitador ve las de sus experiencias"
  ON public.applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.experiences e
      WHERE e.id = experience_id
        AND e.facilitator_id = auth.uid()
    )
  );

CREATE POLICY "applications: seeker inserta (solo a experiencias publicadas)"
  ON public.applications FOR INSERT
  WITH CHECK (
    seeker_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.experiences e
      WHERE e.id = experience_id
        AND e.publicada = true
        AND e.facilitator_id <> auth.uid()  -- un facilitador no puede postular a su propia experiencia
    )
  );

CREATE POLICY "applications: facilitador actualiza estado"
  ON public.applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.experiences e
      WHERE e.id = experience_id
        AND e.facilitator_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.experiences e
      WHERE e.id = experience_id
        AND e.facilitator_id = auth.uid()
    )
  );


-- ---------------------------------------------------------------------------
-- messages — RLS
--
-- Siguen exactamente la misma visibilidad que su postulación: solo el seeker
-- y el facilitador de esa aplicación pueden leer y enviar mensajes.
--
-- La condición JOIN hasta experiences es necesaria para llegar al
-- facilitator_id desde un mensaje.
--
-- INSERT: verifica además que el sender_id sea el propio usuario autenticado,
--   y que pertenezca a la postulación (seeker o facilitador). Impide que un
--   tercero envíe un mensaje en nombre de otro.
--
-- Sin UPDATE ni DELETE: los mensajes son inmutables (ver comentario en DDL).
-- ---------------------------------------------------------------------------

CREATE POLICY "messages: seeker ve los de sus postulaciones"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = application_id
        AND a.seeker_id = auth.uid()
    )
  );

CREATE POLICY "messages: facilitador ve los de sus experiencias"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.applications a
      JOIN public.experiences  e ON e.id = a.experience_id
      WHERE a.id = application_id
        AND e.facilitator_id = auth.uid()
    )
  );

CREATE POLICY "messages: participante inserta"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.applications a
      JOIN public.experiences  e ON e.id = a.experience_id
      WHERE a.id = application_id
        AND (a.seeker_id = auth.uid() OR e.facilitator_id = auth.uid())
    )
  );
