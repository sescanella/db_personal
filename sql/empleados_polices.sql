-- sql/empleados_policies.sql

-- 1) Asegurar RLS ON
alter table if exists public.empleados enable row level security;

-- 2) Otorgar privilegios mínimos a 'anon'
grant usage on schema public to anon;
grant select, insert on table public.empleados to anon;

-- 3) Eliminar policies duplicadas (idempotencia)
drop policy if exists empleados_read_anon on public.empleados;
drop policy if exists empleados_insert_anon on public.empleados;

-- 4) Crear policy de SELECT para 'anon'
create policy empleados_read_anon
  on public.empleados
  for select
  to anon
  using (true);

-- 5) Crear policy de INSERT para 'anon'
create policy empleados_insert_anon
  on public.empleados
  for insert
  to anon
  with check (true);
