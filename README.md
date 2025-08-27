# db_personal

> **Descripción corta:** Centraliza la información de todo el personal de Kronosmining.  
> **Audiencia:** Administradores de contratos de Kronosmining.  
> **Alcance:** Es la única base de datos que se maneja en este proyecto.  
> **Estado:** Beta privada. Proyecto rápido y ágil.

---

## ✨ Funcionalidad

- **Listar y filtrar** registros de `public.empleados` (solo lectura).
- **Lectura pública** mediante RLS en Supabase (`select` para rol `anon`).
- **Desktop-first** con soporte **mobile**.
- **Paginación server-side:** tamaño de página **20**.
- **Orden inicial:** `created_at` **descendente**.
- **Formato de fecha en UI:** zona horaria **America/Santiago**.

---

## 🧱 Stack técnico (exacto)

- **Runtime:** Node.js **20.x LTS** (recomendado ≥ 20.12)
- **Build/App:** Vite **5**, React **18**, TypeScript **5**
- **Estilos:** Tailwind CSS v4 (zero-config)
- **Datos/API:** `@supabase/supabase-js` **v2**
- **Estado de datos:** `@tanstack/react-query` **v5**
- **Tabla/UX:** `@tanstack/react-table` **v8**
- **Validación:** `zod` **v3**

### Paquetes

```bash
npm i react react-dom @supabase/supabase-js @tanstack/react-query @tanstack/react-table zod
npm i -D vite typescript tailwindcss postcss autoprefixer eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier
```

---

## 🔐 Supabase (RLS & Policies)

> El proyecto es **solo lectura pública**. Activa RLS y permite `select` al rol `anon`:

```sql
alter table public.empleados enable row level security;

create policy "empleados_select_public"
on public.empleados
for select
to anon
using (true);
```

> **Nota:** Como la clave `anon` estará en el cliente, mantén **RLS estricta** y limita el acceso solo a `select`.

---

## 🛠️ Instalación y configuración

### Scaffolding base

- Vite + React + TS inicializado.
- Tailwind v4 configurado con color corporativo `#d56301`.
- Estructura de carpetas estandarizada (`src/components`, `src/lib`, `src/services`, `src/types`, `src/utils`, `src/pages`).
- ESLint + Prettier activos, con scripts en `package.json`.
- Scripts básicos de desarrollo, build y preview listos.

### Requisitos previos

- **Node.js** v20+  
- **npm** 10+ (o pnpm 9+)  
- **Git**

### Variables de entorno

Crea `.env` a partir de `.env.example`:

```
VITE_SUPABASE_URL= # https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY= # pk_...
```

### Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview --port 4173"
  }
}
```

### Scripts disponibles

```bash
# Dev server en http://localhost:5173
npm run dev

# Build de producción en /dist
npm run build

# Preview del build
npm run preview

# Chequeos de calidad
npm run lint
npm run format
npm run typecheck
```

---

## 🚀 Despliegue (Hostinger)

1. Ejecuta `npm run build` → genera **`/dist`**.
2. Sube **`/dist`** al subdominio **`personal.kronosmining.tech`**.
3. Si usas SPA y necesitas fallback a `index.html`, agrega `.htaccess`:

```
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

---

## 🎨 Branding mínimo

- **Color primario:** `#d56301`
- **Logo:** `https://bukwebapp-enterprise-chile.s3.amazonaws.com/kronosmining/attachment/file_url/6/img.jpeg`

> Aplicar el color a botones/links principales. El logo se muestra en el header (máx. ancho sugerido: 140px).

---

## 🗂️ Estructura del proyecto (esperada)

```
.
├─ index.html
├─ .env.example
├─ package.json
├─ vite.config.ts
├─ tailwind.config.js
├─ postcss.config.js
├─ tsconfig.json
└─ src/
   ├─ main.tsx
   ├─ App.tsx
   ├─ lib/
   │  └─ supabase.ts               # createClient
   ├─ services/
   │  └─ empleados.ts              # listEmpleados({ page, pageSize, search, sort, filters })
   ├─ components/
   │  ├─ DataTable.tsx             # tabla (TanStack Table)
   │  ├─ FiltersBar.tsx            # filtros (sexo, salud, fondo, estado_civil)
   │  ├─ Loader.tsx
   │  └─ EmptyState.tsx
   ├─ pages/
   │  └─ Home.tsx
   ├─ types/
   │  └─ empleados.ts              # zod schema + TS types
   └─ utils/
      ├─ csv.ts                    # exportar CSV
      └─ formatters.ts             # helpers (fechas, tz America/Santiago)
```

---

## 🔎 Comportamiento de datos

- **Paginación:** `pageSize = 20` (`range(from, to)`); `from = (page-1)*20`, `to = from + 19`.
- **Orden inicial:** `.order('created_at', { ascending: false })`.
- **Búsqueda (OR):** `.or('nombre.ilike.%q%,apellido.ilike.%q%,numero_documento.ilike.%q%,email_personal.ilike.%q%')`.
- **Filtros (AND):** `.eq('sexo', v)`, `.eq('salud', v)`, `.eq('fondo_cotizacion', v)`, `.eq('estado_civil', v)`.
- **Columnas visibles iniciales:**  
  `nombre`, `apellido`, `segundo_apellido`, `numero_documento`, `email_personal`, `telefono_particular`, `ciudad`, `direccion`, `banco`, `tipo_cuenta`, `numero_cuenta`, `salud`, `fondo_cotizacion`, `afc`, `created_at`.

---

## 📦 Artefactos de contexto (siguientes pasos)

1. **FRONTEND-CONTEXT.md**: rutas, componentes, estados, UX, accesibilidad, branding (#d56301 + logo), tabla y filtros.
2. **DB-MIGRATIONS.md**: esquema mínimo de `public.empleados`, RLS aplicada, políticas `select`, checks y constraints relevantes.
3. **SUPABASE-CLIENT-SDK.md**: inicialización del cliente (`src/lib/supabase.ts`), contrato de servicios (`listEmpleados`), manejo de errores y tipado.

> Con estos tres, genera el **CLAUDE.md** como hub de contexto del repo.

---

## 🧭 Roadmap corto

- [ ] Configurar `src/lib/supabase.ts` con `.env`.
- [ ] Implementar listado + filtros + paginación (solo lectura).
- [ ] Aplicar RLS `select` público en Supabase.
- [ ] Branding básico (#d56301 + logo en header).
- [ ] Build y deploy a `personal.kronosmining.tech`.
- [ ] Documentar estructura final en este README.
- [ ] Escribir FRONTEND-CONTEXT, DB-MIGRATIONS y SUPABASE-CLIENT-SDK.

---

## ❓ FAQ (breve)

- **¿Autenticación?** No (solo lectura pública con RLS).
- **¿Edición/CRUD?** No en esta beta.
- **¿Tests/PRs/Convenciones?** No aplica por ahora.
- **¿Licencia/Créditos/Badges/Media?** No en esta fase.
