# db_personal

> **Descripción corta:** Centraliza la información de todo el personal de Kronosmining.  
> **Audiencia:** Administradores de contratos de Kronosmining.  
> **Alcance:** Es la única base de datos que se maneja en este proyecto.  
> **Estado:** ✅ **Versión 1.0 completada** - Listo para producción.

---

## ✨ Funcionalidad Implementada

- ✅ **Vista 1 (Listado):** Tabla completa con filtros avanzados y paginación server-side
- ✅ **Vista 2 (Formulario de alta):** Formulario multi-paso con validaciones en tiempo real
- ✅ **Sistema de códigos NV:** Generación automática de códigos únicos por proyecto
- ✅ **Links personalizados:** Generador de enlaces con códigos NV pre-cargados
- ✅ **Banderas de países:** Integración con circle-flags para visualización
- ✅ **Cascading selectors:** Región-Comuna dinámicos para Chile
- ✅ **Responsive design:** Desktop-first con soporte mobile completo
- ✅ **Paginación optimizada:** 20 registros por página con navegación fluida
- ✅ **Búsqueda avanzada:** Filtros por múltiples campos simultaneos
- ✅ **Exportación CSV:** Descarga de datos filtrados

---

## 🧱 Stack técnico (exacto)

- **Runtime:** Node.js **20.x LTS** (recomendado ≥ 20.12)
- **Build/App:** Vite **5**, React **18**, TypeScript **5**
- **Estilos:** Tailwind CSS v4 (zero-config)
- **Datos/API:** `@supabase/supabase-js` **v2**
- **Estado de datos:** `@tanstack/react-query` **v5**
- **Tabla/UX:** `@tanstack/react-table` **v8**
- **Validación:** `zod` **v3**
- **Iconos:** `lucide-react` **v0.445**
- **Utilidades:** `date-fns` **v4**, `react-hook-form` **v7**

### Paquetes

```bash
npm i react react-dom @supabase/supabase-js @tanstack/react-query @tanstack/react-table zod lucide-react date-fns react-hook-form
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

## 🚀 Despliegue

### Producción (Completado)

1. ✅ **Build optimizado:** `npm run build` → genera `/dist` con assets comprimidos
2. ✅ **Carpeta lista:** `/dist` optimizada para `public_html` 
3. ✅ **Assets minificados:**
   - CSS: 39.61 kB → 7.67 kB (gzipped)
   - JS: 451.62 kB → 131.98 kB (gzipped)
   - Imágenes SVG optimizadas

### Subir a hosting

1. Copia el contenido de `/dist` a tu carpeta `public_html`
2. Para SPA routing, agrega `.htaccess`:

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

## ✅ Completado en v1.0

- ✅ **Listado avanzado** con filtros, búsqueda y paginación server-side
- ✅ **Formulario multi-paso** con validaciones en tiempo real
- ✅ **Sistema de códigos NV** con generación automática por proyecto  
- ✅ **Generador de links** con códigos NV pre-cargados y autenticación
- ✅ **RLS configurado** con políticas `select` e `insert` públicas
- ✅ **Branding corporativo** con color #d56301 y logo oficial
- ✅ **Build optimizado** listo para producción
- ✅ **Documentación actualizada** con estructura y funcionalidades

## 🔮 Próximas actualizaciones

- [ ] **Sistema de roles:** Autenticación y permisos diferenciados
- [ ] **Edición de registros:** CRUD completo con auditoría
- [ ] **Reportes avanzados:** Gráficos y estadísticas
- [ ] **Notificaciones:** Email automático post-registro
- [ ] **API endpoints:** Integración con otros sistemas

---

## ❓ FAQ

- **¿Está listo para producción?** ✅ Sí, versión 1.0 completada y optimizada
- **¿Cómo funciona el sistema NV?** Genera códigos únicos por proyecto para pre-cargar formularios
- **¿Requiere autenticación?** No para usuarios, sí para generar links (protegido con clave)
- **¿Se pueden editar registros?** No, solo lectura e inserción (RLS configurado)
- **¿Funciona en mobile?** ✅ Sí, responsive design completo
- **¿Se pueden exportar datos?** ✅ Sí, exportación CSV con filtros aplicados

---

**🎯 Proyecto completado - Listo para próximas actualizaciones según necesidades del negocio.**
