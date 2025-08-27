-- sql/empleados_policies.sql

-- 1) Asegurar RLS ON
alter table if exists public.empleados enable row level security;

-- 2) Otorgar privilegios mínimos a 'anon'
grant usage on schema public to anon;
grant select on table public.empleados to anon;

-- 3) Eliminar policy duplicada (idempotencia)
drop policy if exists empleados_read_anon on public.empleados;

-- 4) Crear policy de SELECT para 'anon'
create policy empleados_read_anon
  on public.empleados
  for select
  to anon
  using (true);

-- Nota: No hay policies de INSERT/UPDATE/DELETE -> quedan bloqueadas por RLS.
