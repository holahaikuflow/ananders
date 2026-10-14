# Convenciones de Ananders para Claude Code

## Contraste de texto — regla permanente

Ningún texto se define con `rgba()` de alpha menor a 1 ni con la utilidad `opacity`.
La jerarquía visual se consigue con tamaño, peso, `letter-spacing` y espacio en blanco,
no bajando la opacidad.

Si algo necesita verse más tenue, se usa un color más claro de la escala de texto definida
en `tailwind.config.js` (tokens `ink`, `body`, `meta`, `dim` sobre claros; `muted`, `ghost`
sobre oscuros). Ver los comentarios en la config para la escala completa.

La opacidad sí se mantiene en elementos no textuales: overlays de imágenes, sombras,
bordes decorativos, y el overlay de legibilidad del hero.

## Colores de texto — tokens por contexto

| Token | Valor | Usar sobre fondos claros |
|---|---|---|
| `ink` | `#15241E` | texto principal |
| `body` | `#4C5A4E` | párrafos y texto secundario |
| `meta` | `#5B6A5D` | metadatos, pies de tarjeta |
| `dim` | `#6F7F70` | mínimo permitido — nunca usar algo más claro |
| `ochre` | `#8A7A3E` | eyebrows y etiquetas de categoría |

| Token | Valor | Usar sobre fondos oscuros |
|---|---|---|
| `parchment` | `#F4EFE1` | texto principal |
| `muted` | `#BCCABF` | texto secundario |
| `ghost` | `#93A796` | mínimo permitido — nunca usar algo más claro |
| `gold` | `#C8A832` | eyebrows y etiquetas de categoría |

## Tipografía — regla de legibilidad para texto uppercase pequeño

Josefin Sans se reserva para: titulares grandes (headings con `clamp()`), logotipo, cifras decorativas, y títulos de plan ≥ 1rem.

Todo texto uppercase a tamaño **≤ 0.72rem** usa `font-nunito font-semibold` (peso 600), tamaño mínimo 0.72rem, `letter-spacing` máximo 0.16em. Esto incluye etiquetas, badges, botones pequeños, eyebrows de formulario y labels de campo.

## Otras reglas operativas

- No tocar `/Users/chimera/Desktop/Haiku_Flow/RAIZVIVA` desde esta sesión.
- No hacer `git add .` ni `git add -A` — siempre rutas explícitas.
- No hacer push al remoto sin pedido explícito.
- El `.env` nunca se commitea.
- Mostrar el plan y esperar OK antes de editar cuando la tarea sea de más de 2 archivos.
