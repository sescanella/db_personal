
# FRONTEND-CONTEXT

> **Propósito**: Este documento guía a Claude Code para construir el **frontend** del proyecto `db_personal`, con foco en la **vista de listado** de `public.empleados` (solo lectura) y el **formulario de alta** (inserción). Define stack, estructuras, contratos, patrones y convenciones para que el asistente pueda **generar componentes productivos desde el día 1**.

---

## 🔧 Stack & runtime (esperado)
- **Vite 5 + React 18 + TypeScript 5**
- **Tailwind CSS v4** (tema primario `#d56301` → clase utilitaria `text-primary`/`bg-primary`)
- **Estado remoto**: `@tanstack/react-query@^5`
- **Tabla**: `@tanstack/react-table@^8`
- **Datos**: `@supabase/supabase-js@^2`
- **Validación**: `zod@^3`

> Ya existen archivos base: `src/App.tsx`, `src/main.tsx`, `src/index.css`, `src/components/logo.tsx` (o `logo.tsx`), `vite.config.ts`, `tsconfig*.json`.

---

## 🗂️ Estructura de carpetas (objetivo)
```
src/
  App.tsx
  main.tsx
  index.css
  pages/
    Home.tsx                     # Vista: Listado de empleados (readonly)
    NuevoEmpleado.tsx            # Vista: Formulario de alta (insert)
  components/
    DataTable.tsx                # Tabla genérica (TanStack Table)
    FiltersBar.tsx               # Barra de filtros + búsqueda
    Pagination.tsx               # Paginación 1..N
    Loader.tsx                   # Indicador de carga
    EmptyState.tsx               # Estado vacío / sin resultados
    ErrorState.tsx               # Estado de error de red
    Logo.tsx                     # Branding mínimo (texto o imagen)
  lib/
    supabase.ts                  # createClient() con VITE_* envs
    queryClient.ts               # instancia QueryClient + Provider
  services/
    empleados.ts                 # acceso de datos (lista/insert)
  types/
    empleados.ts                 # zod schema + TS types
  utils/
    format.ts                    # formato de fechas/números, TZ America/Santiago
```

**Reglas**:
- Componentes **puros** y **reutilizables** en `components/`.
- Lógica de datos **solo** en `services/` (fetchers) y **react-query** en `pages/`.
- Tipado y validaciones compartidas en `types/` (Zod + TS).
- Dependencias entre capas: `pages → (components, services, utils, types)`; **no** al revés.

---

## 🌐 Variables de entorno
Definir `.env` (copiar de `.env.example`):
```
VITE_SUPABASE_URL=  # https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=  # pk_...
```
**Nunca** hardcodear credenciales.

---

## 🧩 Contratos de datos
### Zod + tipos TS (`src/types/empleados.ts`)
```ts
import { z } from "zod"

export const EmpleadoSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string(),
  apellido: z.string(),
  segundo_apellido: z.string().nullable().optional(),
  numero_documento: z.string(),
  pais_nacimiento: z.string(),
  sexo: z.string(),
  estado_civil: z.string(),
  fecha_nacimiento: z.string(),     // ISO YYYY-MM-DD desde Postgres
  telefono_particular: z.string(),
  email_personal: z.string().email(),
  comuna: z.string(),
  ciudad: z.string(),
  depto_oficina: z.string().nullable().optional(),
  banco: z.string(),
  tipo_cuenta: z.string(),
  numero_cuenta: z.string(),
  contacto_emergencia_nombre: z.string(),
  contacto_emergencia_telefono: z.string(),
  fondo_cotizacion: z.string(),
  salud: z.string(),
  afc: z.string(),
  created_at: z.string().nullable().optional(),
  direccion: z.string().nullable().optional(),
  talla_superior: z.string().nullable().optional(),
  talla_inferior: z.string().nullable().optional(),
  talla_zapato: z.number().nullable().optional(),
  calle: z.string().nullable().optional(),
  numero_calle: z.string().nullable().optional(),
})
export type Empleado = z.infer<typeof EmpleadoSchema>
```

> Las listas cerradas (sexo, salud, etc.) están validadas en DB; el frontend puede usar **selects** con opciones predefinidas (fuente: README/DB-MIGRATIONS).

---

## 📡 Acceso a datos
### Supabase client (`src/lib/supabase.ts`)
```ts
import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)
```

### Servicios (`src/services/empleados.ts`)
```ts
import { supabase } from "@/lib/supabase"
import { EmpleadoSchema } from "@/types/empleados"

const TABLE = "empleados"
const PAGE_SIZE = 20

export type ListParams = {
  page?: number
  search?: string
  sort?: { field: string; asc: boolean } | null
  filters?: Partial<{
    sexo: string
    salud: string
    fondo_cotizacion: string
    estado_civil: string
  }>
}

export async function listEmpleados(params: ListParams = {}) {
  const page = Math.max(1, params.page ?? 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let q = supabase.from(TABLE).select("*", { count: "exact" })

  // búsqueda OR
  if (params.search && params.search.trim()) {
    const s = params.search.trim()
    q = q.or(
      [
        `nombre.ilike.%${s}%`,
        `apellido.ilike.%${s}%`,
        `numero_documento.ilike.%${s}%`,
        `email_personal.ilike.%${s}%`,
      ].join(",")
    )
  }

  // filtros AND
  if (params.filters) {
    for (const [k, v] of Object.entries(params.filters)) {
      if (v) q = q.eq(k, v as string)
    }
  }

  // orden: por defecto created_at desc
  if (params.sort) {
    q = q.order(params.sort.field, { ascending: params.sort.asc })
  } else {
    q = q.order("created_at", { ascending: false })
  }

  // paginación
  q = q.range(from, to)

  const { data, error, count } = await q
  if (error) throw error

  const parsed = EmpleadoSchema.array().safeParse(data)
  if (!parsed.success) throw new Error("Invalid payload from API")

  return { rows: parsed.data, total: count ?? 0, page, pageSize: PAGE_SIZE }
}

export async function insertEmpleado(payload: unknown) {
  // Validar antes de enviar
  // (opcional) zod schema para alta con campos requeridos
  const { data, error } = await supabase.from(TABLE).insert(payload).select().single()
  if (error) throw error
  return data
}
```

---

## 🧱 Páginas y rutas
- `Home.tsx` (**ruta /**): Listado con **búsqueda**, **filtros**, **paginación**, **ordenación**, **export CSV**.
- `NuevoEmpleado.tsx` (**ruta /nuevo**): Formulario de alta; tras insertar, **navegar a /** y **refetch**.

> Si no hay router instalado, mantener navegación **simple**: botón *Volver al listado* que cambia de vista con estado local.

### Home.tsx (contrato de UI)
- **Header**: `Logo`, título “Empleados”, botón “Nuevo”.
- **FiltersBar**: inputs de búsqueda + selects (sexo, salud, fondo, estado_civil).
- **DataTable**: columnas visibles iniciales:  
  `nombre`, `apellido`, `numero_documento`, `email_personal`, `telefono_particular`, `ciudad`, `direccion`, `banco`, `tipo_cuenta`, `numero_cuenta`, `salud`, `fondo_cotizacion`, `afc`, `created_at`.
- **Pagination**: botones `Anterior/Siguiente` + estado “Página X de Y”.
- **Estados**: `Loader` (cargando), `EmptyState` (sin resultados), `ErrorState` (mensaje y reintentar).

---

## 🧮 Tabla (TanStack Table v8)
`DataTable.tsx` debe:
- Recibir `rows: Empleado[]` + definiciones de columnas.
- Soportar ordenación por columnas (sincrónica con `services`).
- Tamaño compacto y **responsive** (overflow-x para móvil).
- Sin edición inline (solo lectura).
- Accesible (roles ARIA, encabezados `th`, foco visible).

Ejemplo de columnas:
```ts
import { ColumnDef } from "@tanstack/react-table"
import { Empleado } from "@/types/empleados"

export const columns: ColumnDef<Empleado>[] = [
  { header: "Nombre", accessorKey: "nombre" },
  { header: "Apellido", accessorKey: "apellido" },
  { header: "RUT/DNI", accessorKey: "numero_documento" },
  { header: "Email", accessorKey: "email_personal" },
  { header: "Teléfono", accessorKey: "telefono_particular" },
  { header: "Ciudad", accessorKey: "ciudad" },
  { header: "Dirección", accessorKey: "direccion" },
  { header: "Banco", accessorKey: "banco" },
  { header: "Tipo Cuenta", accessorKey: "tipo_cuenta" },
  { header: "N° Cuenta", accessorKey: "numero_cuenta" },
  { header: "Salud", accessorKey: "salud" },
  { header: "Fondo", accessorKey: "fondo_cotizacion" },
  { header: "AFC", accessorKey: "afc" },
  { header: "Creado", accessorKey: "created_at",
    cell: ({ getValue }) => <time>{/* format(getValue()) */}</time> },
]
```

---

## 🧰 React Query (v5)
- Crear `QueryClient` en `src/lib/queryClient.ts` e inicializar en `main.tsx`:
```ts
// lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query"
export const queryClient = new QueryClient()

// main.tsx
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/queryClient"
// ...
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)
```

- Hook de datos en `Home.tsx`:
```ts
import { useQuery } from "@tanstack/react-query"
import { listEmpleados } from "@/services/empleados"

const { data, isLoading, isError, error } = useQuery({
  queryKey: ["empleados", params],
  queryFn: () => listEmpleados(params),
  staleTime: 30_000,
})
```

- Tras insertar en `NuevoEmpleado.tsx`, invocar `queryClient.invalidateQueries({ queryKey: ["empleados"] })`.

---

## 🗓️ Formato de fecha y TZ
- **Zona horaria UI**: `America/Santiago`
- Utilidad `utils/format.ts`:
```ts
export function formatDateIsoToLocal(iso?: string | null) {
  if (!iso) return ""
  const d = new Date(iso)
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Santiago",
  }).format(d)
}
```

---

## 🎨 UI/UX y diseño
- **Branding**: color primario `#d56301` (`bg-primary`, `text-primary`), `Logo.tsx` en header.
- **Desktop-first** con soporte móvil (contenedores con `max-w-7xl` y `p-4`).
- **Accesibilidad**: foco visible (`focus:outline-none focus:ring-2 focus:ring-primary`), labels/aria, contrastes adecuados.
- **Estados** siempre visibles (loading/empty/error). **No** flicker: usar placeholders.
- **Sin animaciones** (preferencia actual).

---

## 🧪 Calidad y convenciones
- **Naming**: `PascalCase` para componentes, `camelCase` para funciones, sin abreviaturas crípticas.
- **Imports** absolutos con alias `@/` (configurar en `tsconfig.json`).
- **Tipos** exportados desde `types/` (evitar `any`).
- **Errores**: mostrar `ErrorState` con mensaje amigable y botón *Reintentar*.
- **Loading**: `Loader` center, skeleton opcional.
- **Empty**: mensaje + tips para refinar filtros/búsqueda.
- **Tests**: opcional en esta fase.

---

## 📜 Tareas sugeridas (orden de implementación)
1. Crear `lib/supabase.ts`, `lib/queryClient.ts`.
2. Implementar `types/empleados.ts` (Zod + TS).
3. Implementar `services/empleados.ts` (`listEmpleados`, `insertEmpleado`).
4. Construir `FiltersBar.tsx` (búsqueda + selects).
5. Construir `DataTable.tsx` (TanStack Table) + `Pagination.tsx`.
6. Crear página `Home.tsx` integrando filtros → servicio → tabla → paginación.
7. Crear `NuevoEmpleado.tsx` (formulario de alta; al insertar, volver a `/` + invalidar query).
8. Añadir utilidades de formato (fechas `America/Santiago`).
9. Pulir accesibilidad y estados (Loader/Empty/Error).
10. Export CSV (opcional temprano; `utils/csv.ts`).

---

## 🔌 API de componentes (resumen)
- `<FiltersBar value={{ search, filters }} onChange={(v) => setParams(v)} />`
- `<DataTable rows={rows} columns={columns} onSortChange={...} />`
- `<Pagination page={page} total={total} pageSize={20} onPageChange={...} />`
- `<Loader />`, `<EmptyState title="Sin resultados" />`, `<ErrorState message={...} onRetry={...} />`

---

## 🧭 Notas
- **RLS** permite `select` e `insert` al público; **no** hay `update/delete`.
- Mantener consistencia con los campos y constraints definidos en `DB-MIGRATIONS.md`.
- Evitar dependencias innecesarias; favorecer **componentes simples** y **contratos claros**.
