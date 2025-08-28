# THEME.md - Sistema de Diseño

> **Propósito**: Sistema de diseño completo para `db_personal`. Define tokens visuales, componentes base y convenciones de estilo para Tailwind CSS v4 y React.

---

## 1. Tokens Base

### Paleta de Colores (iOS Dark + Primario #d56301)
```css
:root {
  --color-primary: 213 99 1;
  --color-primary-hover: 191 89 1;
  --bg: #0B0B0F;
  --card: #141418;
  --card-elevated: #1B1B20;
  --border: #26262B;
  --border-input: #33333A;
  --text: #EDEDEF;
  --text-muted: #A8A8AE;
  --text-subtle: #6B6B73;
}
```

### Escalas y Tipografía

| Elemento | Valores |
|----------|---------|
| **Radios** | `rounded-lg` (8px), `rounded-xl` (12px), `rounded-2xl` (16px) |
| **Espaciados** | `gap-1/2/3` (4/8/12px), `p-3/4` (12/16px) |
| **Alturas mín** | Inputs/botones ≥ 44px |
| **Texto** | `text-sm` (14px), `text-base` (16px) |
| **Pesos** | `font-medium`, `font-semibold` |
| **Z-Index** | Dropdowns (50), Modales (40), Overlays (30) |

---

## 2. Clases Utilitarias

```css
.bg-primary { background: rgb(var(--color-primary)); }
.bg-surface { background: var(--card); }
.bg-elevated { background: var(--card-elevated); }
.text-muted { color: var(--text-muted); }
.text-subtle { color: var(--text-subtle); }
.border-default { border-color: var(--border); }
.border-input { border-color: var(--border-input); }

.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary;
  @apply focus:ring-offset-2 focus:ring-offset-[var(--bg)];
}
```

---

## 3. Componentes Esenciales

### Botones
```css
.btn-primary {
  @apply rounded-2xl px-4 py-2 min-h-[44px] bg-primary hover:bg-[rgb(191_89_1)];
  @apply text-white font-medium transition-colors focus-ring;
}

.btn-secondary {
  @apply rounded-2xl px-4 py-2 min-h-[44px] bg-surface hover:bg-elevated;
  @apply border border-default font-medium transition-colors focus-ring;
}
```

### Inputs y Selects
```css
.input-base {
  @apply bg-surface border border-input rounded-lg px-3 py-2 min-h-[44px];
  @apply text-base focus:border-primary focus:ring-1 focus:ring-primary;
  @apply placeholder:text-muted;
}

.select-base {
  @apply input-base appearance-none pr-10;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23A8A8AE' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}
```

### Cards y Layout
```css
.card {
  @apply rounded-2xl bg-surface border border-default;
}

.card-elevated {
  @apply rounded-2xl bg-elevated border border-default;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.4);
}

.card-compact {
  @apply card p-3 space-y-1 leading-tight;
  font-size: 14px;
}

.table-grid {
  display: grid;
  grid-template-columns: 1.4fr 1.2fr 1fr 1fr 0.8fr;
  gap: 1rem;
}
```

---

## 4. Patrones de Uso

### Celda de Tabla (Card Compacta)
```tsx
<div className="card-compact">
  <div className="font-semibold">Juan Pérez González</div>
  <div className="text-sm text-muted">12.345.678-9</div>
  <div className="text-sm text-subtle">15 FEB 1985 (39 años)</div>
</div>
```

### Botón con Estado de Carga
```tsx
<button className="btn-primary focus-ring disabled:opacity-50">
  {loading && <Spinner />}
  Guardar Empleado
</button>
```

### Input con Validación
```tsx
<input className="input-base focus-ring w-full" placeholder="+56 9 1234 5678" />
{error && <p className="text-red-400 text-sm mt-1">{error}</p>}
```

### Select Estilizado
```tsx
<select className="select-base focus-ring w-full">
  <option value="">Seleccionar región...</option>
  <option value="RM">Región Metropolitana</option>
</select>
```

---

## 5. Responsive y Accesibilidad

### Breakpoints
| Dispositivo | Ancho mín | Layout |
|-------------|-----------|--------|
| **Desktop** | 1280px | `table-grid` + `max-w-7xl` |
| **Tablet** | 768px | Stack vertical |
| **Mobile** | 320px | `max-w-lg` + `p-4` |

### Criterios WCAG AA
| Elemento | Ratio mín | Estado |
|----------|-----------|--------|
| Texto normal vs fondo | 4.5:1 | ✅ |
| Texto large vs fondo | 3:1 | ✅ |
| Primary vs white | 4.5:1 | ✅ |
| Área táctil mínima | 44x44px | ✅ |

---

## 6. Referencias Rápidas

### Estados de Componentes
```css
.loading { @apply animate-spin rounded-full border-2 border-primary border-t-transparent; }
.empty-state { @apply text-center py-12 text-muted; }
.error-state { @apply bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400; }
```

### Iconografía
- **Banderas**: `fi fi-{código}` (ej: `fi fi-cl`)
- **Iconos UI**: Lucide React (`import { Icon } from "lucide-react"`)
- **Tamaño estándar**: `w-5 h-4` para banderas, `w-4 h-4` para UI

### Jerarquía Tipográfica en Celdas
1. **Principal**: `font-semibold`
2. **Secundario**: `text-sm text-muted`
3. **Terciario**: `text-sm text-subtle`
4. **Metadatos**: `text-xs text-subtle`

### Extensión de Tokens
Para agregar nuevos colores temáticos:
```css
:root {
  --color-success: 34 197 94;
  --color-warning: 245 158 11;
  --color-danger: 239 68 68;
}
```

---

## 7. Implementación

### Importación
```tsx
// main.tsx
import './index.css'  // Contiene todas las variables CSS
```

### Uso Prioritario
- **Clases definidas**: `card-compact`, `btn-primary`, `input-base`
- **Clases Tailwind**: Como complemento, no reemplazo
- **Variables CSS**: Usar `rgb(var(--color-primary))` para consistencia

### Validación Visual
- ✅ Modo oscuro por defecto
- ✅ Contraste AA en todos los elementos
- ✅ Área táctil ≥44px
- ✅ Focus ring visible

---

**Nota**: Para ejemplos extendidos y casos de uso específicos, consultar documentación completa del proyecto.