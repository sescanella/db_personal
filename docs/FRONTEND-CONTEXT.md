# FRONTEND-CONTEXT.md (Versión Optimizada)

> Guía funcional optimizada para Claude Code. Ver THEME.md para aspectos visuales.

## Índice de Referencia Rápida

**Vistas**: `Table.tsx` (desktop), `Forms.tsx` (mobile) | **URLs**: `/personaltabla`, `/personalformulario`  
**Componentes**: PhoneInputIntl, CountryPicker, ChileComunasSelect | **Servicios**: React Query + Supabase  
**Datos**: 5 columnas temáticas, validación Zod, scroll infinito | **Utils**: formateo, países, comunas Chile

---

## 1. Stack y Arquitectura Base

### Stack Técnico
- **Core**: Vite 5 + React 18 + TypeScript 5 + Tailwind v4
- **Estado**: `@tanstack/react-query@^5` + `@tanstack/react-table@^8` + `@tanstack/react-virtual@^3`
- **Datos**: `@supabase/supabase-js@^2` + `zod@^3`
- **Forms**: `react-hook-form@^7` + `@hookform/resolvers@^3`
- **Especiales**: `react-phone-number-input`, `libphonenumber-js`, `i18n-iso-countries`, `flag-icons`

### Estructura de Carpetas
```
src/
  pages/Table.tsx, Forms.tsx
  components/
    data-table/DataTable.tsx, InfiniteScroller.tsx
    data-table/columns/[Personal|Contact|Bank|Prevision|Sizes]Col.tsx
    forms/PhoneInputIntl.tsx, CountryPicker.tsx, ChileComunasSelect.tsx
    FiltersBar.tsx, Loader.tsx, EmptyState.tsx, ErrorState.tsx
  services/empleados.ts
  types/empleados.ts
  utils/format.ts, chile-regiones-comunas.ts, countries.ts
  lib/supabase.ts, queryClient.ts
```

---

## 2. Vistas Principales

### Table.tsx - Desktop-first (≥1280px)
**Comportamiento**: 5 columnas temáticas, búsqueda OR, filtros AND, scroll infinito, virtualización
```tsx
interface TableProps {
  // Columnas: Personal, Contacto, Bancaria, Previsión, Tallas
  // Búsqueda: nombre, apellido, numero_documento, email_personal
  // Filtros: sexo, salud, fondo_cotizacion, estado_civil
  // Orden: nombre A-Z/Z-A, created_at desc (default)
}
```

### Forms.tsx - Mobile-first (≥44px controles)
**Comportamiento**: Validación Zod + React Hook Form, componentes internacionales
```tsx
interface FormsProps {
  // Campos especiales: PhoneInputIntl, CountryPicker, ChileComunasSelect
  // Submit: insert → invalidate cache → feedback
  // Validación: tiempo real + submit
}
```

---

## 3. Componentes Especializados

### PhoneInputIntl
```tsx
interface PhoneInputIntlProps {
  name: string; defaultCountry?: string; // Default: "CL"
  value?: string; onChange?: (value: string) => void; // E.164 format
}
// Validación libphonenumber-js, output E.164, display legible
```

### CountryPicker
```tsx
interface CountryPickerProps {
  name: string; value?: string; // ISO alpha-2
  onChange?: (country: {code: string, name: string}) => void;
  suggestedCountries?: string[]; // Default: ["CL", "VE", "AR", "PE", "CU"]
}
// i18n-iso-countries + flag-icons, buscador, sugeridos arriba
```

### ChileComunasSelect
```tsx
interface ChileComunasSelectProps {
  name: string;
  value?: { region: string, comuna: string };
  onChange?: (value: { region: string, comuna: string }) => void;
}
// Dataset local utils/chile-regiones-comunas.ts, selects encadenados
// Reset comuna al cambiar región, buscador independiente
```

---

## 4. Servicios y Datos

### React Query Service (services/empleados.ts)
```tsx
interface ListParams {
  search?: string;
  sort?: { field: string; asc: boolean } | null;
  filters?: Partial<{sexo: string; salud: string; fondo_cotizacion: string; estado_civil: string}>;
}

// PAGE_SIZE = 30, useInfiniteQuery con getNextPageParam
// listEmpleadosPage(params, pageIndex) → server-side filtering/search
// insertEmpleado(data: EmpleadoInput) → invalidate queries
```

### Tipos Zod (types/empleados.ts)
```tsx
const EmpleadoSchema = z.object({
  // Identidad: nombre, apellido, segundo_apellido, numero_documento, pais_nacimiento (ISO), sexo, fecha_nacimiento, estado_civil
  // Contacto: telefono_particular (E.164), email_personal, direccion, contacto_emergencia_*
  // Bancaria: banco, tipo_cuenta, numero_cuenta
  // Previsión: fondo_cotizacion, salud, afc
  // Tallas: talla_superior, talla_inferior, talla_zapato
});

type Empleado = z.infer<typeof EmpleadoSchema>;
type EmpleadoInput = Omit<Empleado, 'id' | 'created_at'>;
```

---

## 5. Interacción y UX

### FiltersBar
```tsx
interface FiltersBarProps {
  value: ListParams; onChange: (params: ListParams) => void;
}
// Controles: input búsqueda (debounce 300ms), select ordenación, selects filtro, botón limpiar
// Cualquier cambio resetea scroll infinito
```

### Utilidades de Formateo (utils/format.ts)
- `fullName()` - Concatenar nombre completo
- `formatRUT()` - Formato chileno con puntos y guión  
- `edadFrom()` - Calcular edad desde fecha ISO
- `formatPhoneCL()` - E.164 a formato legible Chile
- `formatDateCL()` - Fecha con zona horaria Chile

---

## 6. Criterios de Aceptación

### Funcionalidad Core
- **Table**: 5 columnas temáticas, búsqueda OR (4 campos), filtros AND, scroll infinito, virtualización >1000 registros
- **Forms**: Validación Zod + RHF, componentes internacionales, flujo submit completo, UX móvil ≥44px
- **Datos**: React Query cache, invalidación automática, tipos seguros TypeScript + Zod

### Accesibilidad Funcional
- **Teclado**: Tab order lógico, Escape/Enter/Arrow keys, focus visible
- **Screen readers**: Labels apropiados, ARIA roles (table, gridcell), live regions para estados
- **Estados**: Loading/error/empty accesibles, mensajes claros por campo en validación

### Performance y UX
- **Desktop**: Funcional desde 1280px, layout desktop-first
- **Mobile**: Controles ≥44px, navegación táctil cómoda  
- **Búsqueda**: Debounce 300ms, reset automático filtros
- **Datos**: Server-side filtering, formateo correcto (fechas, teléfonos, RUT)

---

## 7. Integración y Referencias

### Compatibilidad con Otros Contextos
- **THEME.md**: TODO lo visual (colores, espacios, componentes UI) - referenciado una sola vez
- **Límites**: No duplicar backend/DB, solo funcionalidad frontend
- **Modularización futura**: Estructura preparada para división en sub-archivos

### Referencias Técnicas
- **Tailwind v4**: Variables CSS + clases utilitarias core únicamente
- **TanStack**: Table v8 + Virtual v3 + Query v5 APIs
- **Accesibilidad**: WCAG AA delegado a THEME.md para contrastes
- **Convenciones**: PascalCase componentes, camelCase variables, absolute imports @/

### Implementación Sugerida
1. Setup Tailwind + variables THEME.md
2. Utils (format, countries, chile-regiones)  
3. Tipos Zod + servicios React Query
4. Componentes forms especializados
5. Tabla (renderers columnas + DataTable + scroll)
6. FiltersBar + vistas completas
7. Estados feedback + QA funcional

### Stack Fijo y Limitaciones
- **Sin dependencias adicionales** fuera de sección 1
- **Supabase única fuente** de datos, no localStorage
- **Validación dual**: cliente Zod + servidor RLS
- **Virtualización obligatoria** >100 items, debounce búsqueda, memoización componentes pesados

---

**Target**: 300 líneas, ~4,000 tokens | **Enfoque**: Solo arquitectura y comportamientos funcionales | **Visual**: Exclusivamente THEME.md