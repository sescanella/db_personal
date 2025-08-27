# db_personal

> **Descripción corta:** Centraliza la información de todo el personal de Kronosmining.  
> **Audiencia:** Administradores de contratos de Kronosmining.  
> **Alcance:** Es la única base de datos que se maneja en este proyecto.  
> **Estado:** Beta privada. Proyecto rápido y ágil.

---

## ✨ Funcionalidad

- **Vista 1 (Listado):** Listar y filtrar registros de `public.empleados` (solo lectura).
- **Vista 2 (Formulario de alta):** Ingreso de nuevos registros mediante formulario controlado.
- **Lectura e inserción pública** mediante RLS en Supabase (`select` e `insert` para rol `anon`).
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

> El proyecto habilita **lectura e inserción pública**. Activa RLS y permite `select` e `insert` al rol `anon`:

```sql
alter table public.empleados enable row level security;

-- Lectura pública
create policy "empleados_read_anon"
on public.empleados
for select
to public
using (true);

-- Inserción pública
create policy "empleados_insert_anon"
on public.empleados
for insert
to public
with check (true);
```

> **Nota:** No existen policies para `update` ni `delete`, por lo que estos quedan denegados.

---

## 🗄️ Esquema de la tabla empleados

La tabla `public.empleados` contiene datos completos del personal con constraints estrictos.  
Algunos destacados:

- **Campos obligatorios:** `nombre`, `apellido`, `numero_documento`, `pais_nacimiento`, `sexo`, `estado_civil`, `fecha_nacimiento`, `telefono_particular`, `email_personal`, `comuna`, `ciudad`, `banco`, `tipo_cuenta`, `numero_cuenta`, `contacto_emergencia_nombre`, `contacto_emergencia_telefono`, `fondo_cotizacion`, `salud`, `afc`.
- **Campos opcionales:** `segundo_apellido`, `depto_oficina`, `direccion`, `calle`, `numero_calle`, `talla_superior`, `talla_inferior`, `talla_zapato`.
- **Constraints de validación:**  
  - Listas cerradas para: `sexo`, `estado_civil`, `fondo_cotizacion`, `salud`, `banco`, `afc`, `talla_superior`, `talla_inferior`, `talla_zapato`, `tipo_cuenta`.  
  - Validación de email (`email_personal` debe contener `@`).  
- **Trigger:** `trg_empleados_direccion` ejecuta `actualizar_direccion()` antes de `insert/update`.

> Ver definición completa en `sql/schema.sql`.

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
- **Inserción (Formulario de alta):**  
  - Se validan campos obligatorios.  
  - Campos con listas cerradas se validan en frontend y backend (Postgres constraints).  
  - Tras insertar, refresca listado.

---

## 📦 Artefactos de contexto (siguientes pasos)

1. **FRONTEND-CONTEXT.md**: rutas, componentes, estados, UX, accesibilidad, branding (#d56301 + logo), tabla, filtros y formulario de alta.
2. **DB-MIGRATIONS.md**: esquema completo de `public.empleados`, RLS aplicada, políticas `select` + `insert`, checks, constraints y trigger.
3. **SUPABASE-CLIENT-SDK.md**: inicialización del cliente (`src/lib/supabase.ts`), contrato de servicios (`listEmpleados`, `insertEmpleado`), manejo de errores y tipado.

> Con estos tres, genera el **CLAUDE.md** como hub de contexto del repo.

---

## 🧭 Roadmap corto

- [ ] Implementar listado + filtros + paginación (readonly).
- [ ] Implementar formulario de alta con validaciones e inserción. 
- [ ] Aplicar RLS `select` e `insert` públicos en Supabase.
- [ ] Branding básico (#d56301 + logo en header).
- [ ] Build y deploy a `personal.kronosmining.tech`.
- [ ] Documentar estructura final en este README.
- [ ] Escribir FRONTEND-CONTEXT, DB-MIGRATIONS y SUPABASE-CLIENT-SDK.

---

## ❓ FAQ (breve)

- **¿Autenticación?** No (lectura e inserción pública con RLS).  
- **¿Edición/CRUD?** Solo se permite **lectura e inserción** (no update/delete).  
- **¿Validación de campos?** El frontend valida selects contra opciones predefinidas; Postgres refuerza con constraints.  
- **¿Tests/PRs/Convenciones?** No aplica por ahora.  
- **¿Licencia/Créditos/Badges/Media?** No en esta fase.
