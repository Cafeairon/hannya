
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  cpf text not null default '',
  email text not null default '',
  phone text not null default '',
  birth_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

create policy "Profiles: select own" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "Profiles: insert own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "Profiles: update own" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- Devices
create table public.devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tracking_code text not null unique,
  status text not null default 'connected',
  battery int not null default 80,
  paired_at timestamptz not null default now()
);

grant select, insert, update, delete on public.devices to authenticated;
grant all on public.devices to service_role;

alter table public.devices enable row level security;

create policy "Devices: select own" on public.devices
  for select to authenticated using (auth.uid() = user_id);
create policy "Devices: insert own" on public.devices
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Devices: update own" on public.devices
  for update to authenticated using (auth.uid() = user_id);
create policy "Devices: delete own" on public.devices
  for delete to authenticated using (auth.uid() = user_id);

-- Auto-create profile on signup with metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, cpf, email, phone, birth_date)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'cpf', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    nullif(new.raw_user_meta_data->>'birth_date','')::date
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
