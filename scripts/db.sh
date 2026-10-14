#!/usr/bin/env bash
# scripts/db.sh — ejecuta psql con la URL leída del .env
# Uso: ./scripts/db.sh -f archivo.sql
#       ./scripts/db.sh -c "SELECT 1"
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Error: no se encontró $ENV_FILE" >&2
  exit 1
fi

DB_URL="$(grep '^SUPABASE_DB_URL=' "$ENV_FILE" | head -1 | cut -d'=' -f2-)"

if [[ -z "$DB_URL" ]]; then
  echo "Error: SUPABASE_DB_URL no está definida en $ENV_FILE" >&2
  exit 1
fi

if [[ $# -eq 0 ]]; then
  echo "Uso: $0 -f archivo.sql  |  $0 -c 'CONSULTA'" >&2
  exit 1
fi

exec psql "$DB_URL" "$@"
