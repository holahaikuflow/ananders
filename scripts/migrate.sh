#!/usr/bin/env bash
# scripts/migrate.sh — aplica migraciones pendientes en supabase/migrations/
# Lleva registro en public._migrations_aplicadas (nombre, aplicada_el).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DB="$SCRIPT_DIR/db.sh"
MIGRATIONS_DIR="$SCRIPT_DIR/../supabase/migrations"

# ── 1. Crear tabla de registro si no existe ──────────────────────────────────
"$DB" -q -c "
CREATE TABLE IF NOT EXISTS public._migrations_aplicadas (
  nombre       text        PRIMARY KEY,
  aplicada_el  timestamptz NOT NULL DEFAULT now()
);
"

# ── 2. Registrar migraciones ya aplicadas (sin reejecutar) ───────────────────
ALREADY=(
  "20261014000000_initial_schema.sql"
  "20261014000001_grant_permissions.sql"
  "20261014000002_auto_create_profile.sql"
  "20261014000003_storage_avatars.sql"
  "20261014000004_realtime_messages.sql"
)

for f in "${ALREADY[@]}"; do
  "$DB" -q -c "
    INSERT INTO public._migrations_aplicadas (nombre)
    VALUES ('$f')
    ON CONFLICT (nombre) DO NOTHING;
  "
done

# ── 3. Aplicar las pendientes en orden ───────────────────────────────────────
applied_count=0

for sql_file in $(find "$MIGRATIONS_DIR" -maxdepth 1 -name "*.sql" | sort); do
  filename="$(basename "$sql_file")"

  registered=$("$DB" -t -A -c "
    SELECT COUNT(*) FROM public._migrations_aplicadas WHERE nombre = '$filename';
  ")

  if [[ "$registered" -eq 0 ]]; then
    echo "→ Aplicando: $filename"
    "$DB" -q -f "$sql_file"
    "$DB" -q -c "
      INSERT INTO public._migrations_aplicadas (nombre)
      VALUES ('$filename')
      ON CONFLICT (nombre) DO NOTHING;
    "
    applied_count=$((applied_count + 1))
  fi
done

# ── 4. Resultado ─────────────────────────────────────────────────────────────
if [[ $applied_count -eq 0 ]]; then
  echo "✓ Todas las migraciones ya están aplicadas."
else
  echo "✓ $applied_count migración(es) aplicada(s)."
fi
