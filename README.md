# Ananders

Ananders conecta a buscadores espirituales —llamados *Anander*— con facilitadores de experiencias como ayahuasca, vipassana, yoga, sufismo y psilocibina. El buscador explora el directorio, postula a una experiencia y el facilitador abre o rechaza el contacto. El precio y los detalles se acuerdan en el chat interno; la plataforma no procesa pagos.

Este repositorio es el frontend + esquema de base de datos del MVP.

## Stack

- **Frontend**: Vite · React 18 · React Router v6 · Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + REST API)
- **i18n**: ES / EN, switching en el navegador sin librería externa
- **Deploy**: sin configurar todavía

## Levantar en local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL y la publishable key del proyecto de Supabase

# 3. Correr el servidor de desarrollo (puerto fijo: 5106)
npm run dev

# 4. Build de producción
npm run build
```

El `.env` nunca se commitea. `.env.example` muestra los nombres de las variables sin valores.

## Estructura del proyecto

```
src/
  components/    Navbar, Footer, cards, hero, SEO, internacionalización
  pages/         Home, Explorar, Detalle, Facilitadores, Historia, Legales, 404
  i18n/          Diccionarios ES/EN + contexto de idioma
  data/          experiences.js — datos de muestra mientras no hay DB conectada
  config.js      Constantes del sitio (URL, email, stats del hero)
  lib/
    supabase.js  Cliente de Supabase (singleton)

supabase/
  migrations/
    20261014000000_initial_schema.sql   Tablas, enums, triggers y policies de RLS
    20261014000001_grant_permissions.sql Permisos de Postgres por rol
```

## Modelo de seguridad

El esquema usa dos capas independientes de control de acceso que actúan en orden:

**1. Permisos de Postgres (GRANT)**
Definen si un rol puede tocar una tabla en absoluto. Sin este permiso, Postgres devuelve `42501 permission denied` antes de evaluar cualquier regla de RLS. Se otorgan en `20261014000001_grant_permissions.sql`.

**2. Row Level Security (RLS)**
Activo en las seis tablas. Filtra qué filas puede ver o modificar cada usuario dentro del acceso que ya le concede el GRANT.

### Qué ve cada rol

| Tabla | `anon` (sin sesión) | `authenticated` |
|---|---|---|
| `profiles` | Todos los perfiles | Ídem |
| `seekers` | Todos | Ídem |
| `facilitators` | Todos | Ídem |
| `experiences` | Solo las publicadas (`publicada = true`) | Las publicadas + sus propios borradores |
| `applications` | Nada | Solo las propias (seeker) o las de sus experiencias (facilitador) |
| `messages` | Nada | Solo los de las postulaciones donde participa |

### Por qué las conversaciones no son legibles por terceros

Las policies de `applications` y `messages` usan `EXISTS` subqueries que verifican participación directa. Un usuario autenticado que no sea ni el seeker ni el facilitador de una postulación concreta obtiene cero filas, aunque conozca el UUID. No existe ninguna policy con `USING (true)` en estas tablas.

Los mensajes son además **inmutables**: no hay policy de `UPDATE` ni de `DELETE` en `messages`. El historial del chat no puede ser alterado ni borrado por ninguna de las partes.

### Protección adicional en `applications`

El facilitador puede cambiar el `estado` de una postulación, pero no el `mensaje_inicial` del buscador. Esto lo garantiza un trigger `BEFORE UPDATE` que lanza una excepción si se intenta modificar cualquier columna fuera de `estado`. El trigger actúa a nivel de base de datos, independientemente de la policy de RLS.

## Pendiente

- Imágenes en `public/images/` (mientras falten se muestra un degradado):
  `hero-door.jpg`, `exp-yoga-beach.jpg`, `about-spiral.jpg`, `exp-ceremony.jpg`, `exp-india.jpg`, `community-drum.jpg`
- Descripciones, precio y modalidad detallada de cada experiencia
- Perfiles de facilitadores
- Correo de contacto para textos legales (`CONTACT_EMAIL` en `src/config.js`)
- Flujos de registro, ingreso, postulación y mensajería (páginas muestran "Próximamente")
