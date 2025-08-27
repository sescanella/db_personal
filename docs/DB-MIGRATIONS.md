# DB-MIGRATIONS

## 📌 Propósito
Este documento centraliza la **definición del esquema**, **migraciones** y **políticas** aplicadas a la tabla principal `public.empleados`.  
Sirve como referencia para desarrolladores y administradores que gestionen la base de datos.

---

## 🗄️ Esquema actual (`public.empleados`)

```sql
create table public.empleados (
  id uuid not null default gen_random_uuid (),
  nombre text not null,
  apellido text not null,
  segundo_apellido text null,
  numero_documento text not null,
  pais_nacimiento text not null,
  sexo text not null,
  estado_civil text not null,
  fecha_nacimiento date not null,
  telefono_particular text not null,
  email_personal text not null,
  comuna text not null,
  ciudad text not null,
  depto_oficina text null,
  banco text not null,
  tipo_cuenta text not null,
  numero_cuenta text not null,
  contacto_emergencia_nombre text not null,
  contacto_emergencia_telefono text not null,
  fondo_cotizacion text not null,
  salud text not null,
  afc text not null,
  created_at timestamp with time zone null default now(),
  direccion text not null,
  talla_superior text null,
  talla_inferior text null,
  talla_zapato integer null,
  calle text null,
  numero_calle text null,
  constraint empleados_pkey primary key (id)
);
```

---

## ✅ Constraints de validación

- **Bancos válidos (`banco`):** CHILE EDWARDS, BANCOESTADO, SCOTIABANK, BCI TBANC, CORPBANCA, BICE, HSBC, SANTANDER, ITAU, SECURITY, BBVA, DEL DESARROLLO, FALABELLA, RIPLEY, RABOBANK, CONSORCIO, PARIS, INTERNACIONAL.
- **Email válido (`email_personal`):** debe contener `@`.
- **Estado civil (`estado_civil`):** Casado/a, Divorciado/a, Soltero/a, Viudo/a, Acuerdo de Unión Civil, Separado/a.
- **Fondo cotización (`fondo_cotizacion`):** Capital, Cuprum, Habitat, Modelo, PlanVital, ProVida, Uno.
- **Salud (`salud`):** Fonasa, Banmedica, Colmena, Consalud, Cruz Blanca, Nueva Masvida, Vida Tres, Banco Estado, ISALUD, Cruz del Norte, Esencial, No Cotiza Salud.
- **Sexo (`sexo`):** Masculino, Femenino.
- **Talla inferior (`talla_inferior`):** 38 (S), 40 (M), 42 (M), 44 (L), 46 (L), 48 (XL), 50 (XL), 52–60 (XXL).
- **Talla superior (`talla_superior`):** XS, S, M, L, XL, XXL.
- **Talla zapato (`talla_zapato`):** 36–46 (enteros).
- **AFC (`afc`):** Menos de 11 Años, Más de 11 Años, No Cotiza.
- **Tipo de cuenta (`tipo_cuenta`):** Cuenta Corriente, Cuenta de Ahorro, Cuenta Vista.

---

## 🔄 Trigger asociado

```sql
create trigger trg_empleados_direccion
before insert or update on empleados
for each row
execute function actualizar_direccion();
```

- Mantiene sincronizada la dirección compuesta.
- Se ejecuta antes de cada `INSERT` o `UPDATE`.

---

## 🔐 Políticas de seguridad (RLS)

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

> **Nota:** `UPDATE` y `DELETE` permanecen denegados.

---

## 📜 Migraciones esperadas

1. **Inicial**  
   - Crear tabla `empleados` con columnas y `constraints` descritas.
   - Registrar trigger `trg_empleados_direccion`.

2. **Policies**  
   - Habilitar RLS.
   - Agregar políticas `empleados_read_anon` y `empleados_insert_anon`.

---

## 🧭 Buenas prácticas de migración

- Mantener un archivo `sql/schema.sql` actualizado con la definición completa.
- Versionar los cambios en `migrations/NNN_nombre.sql`.
- Incluir **rollback scripts** si un cambio es destructivo.
- Validar en **staging** antes de aplicar en producción.

---
