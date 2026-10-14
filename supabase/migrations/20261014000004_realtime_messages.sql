-- =============================================================================
-- Habilitar Supabase Realtime para la tabla messages
-- Fecha: 2026-10-14
--
-- REPLICA IDENTITY FULL es necesario para que el filtro
-- application_id=eq.{id} funcione en postgres_changes, ya que application_id
-- no forma parte de la identidad de réplica predeterminada (solo PK).
-- Sin esto, el canal de Realtime se suscribe pero el filtro no aplica y
-- todos los mensajes de la tabla se enviarían al cliente.
--
-- supabase_realtime es la publicación de PostgreSQL que Supabase usa
-- para replicar cambios vía WebSocket. Agregar la tabla aquí la expone
-- al canal de Realtime; las policies de RLS siguen filtrando qué filas
-- ve cada usuario.
-- =============================================================================

ALTER TABLE public.messages REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
