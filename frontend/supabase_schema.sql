-- ─────────────────────────────────────────────────────────────────────────────
-- HUSTLEHUB SUPABASE DATABASE SCHEMA
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. PROFILES TABLE (linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('student', 'employer', 'admin')) not null default 'student',
  name text not null,
  email text not null,
  avatar_url text,
  trust_score integer default 100,
  is_verified boolean default false,
  student_status boolean default false,
  badge text,
  rating numeric(3, 2) default 5.0,
  total_reviews integer default 0,
  skills text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- 2. JOBS TABLE
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete cascade not null,
  provider_id uuid references public.profiles(id) on delete set null,
  title text not null,
  category text not null,
  description text not null,
  location text not null,
  budget numeric(10, 2) not null,
  status text check (status in ('open', 'in_progress', 'completed', 'cancelled', 'disputed')) not null default 'open',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- Enable RLS for jobs
alter table public.jobs enable row level security;

-- Policies for jobs
create policy "Jobs are viewable by everyone" on public.jobs
  for select using (true);

create policy "Authenticated users can create jobs" on public.jobs
  for insert with check (auth.role() = 'authenticated');

create policy "Clients or assigned providers can update jobs" on public.jobs
  for update using (auth.uid() = client_id or auth.uid() = provider_id or exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- 3. VERIFICATIONS TABLE (Student Verification requests)
create table public.verifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  id_card_url text,
  guarantor_form_url text,
  status text check (status in ('pending', 'approved', 'rejected')) not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for verifications
alter table public.verifications enable row level security;

-- Policies for verifications
create policy "Users can view their own verification status" on public.verifications
  for select using (auth.uid() = user_id or exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

create policy "Students can request verification" on public.verifications
  for insert with check (auth.uid() = user_id);

create policy "Admins can update verifications" on public.verifications
  for update using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- 4. DISPUTES TABLE
create table public.disputes (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) on delete cascade not null,
  opened_by uuid references public.profiles(id) on delete cascade not null,
  reason text not null,
  status text check (status in ('open', 'resolved', 'dismissed')) not null default 'open',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for disputes
alter table public.disputes enable row level security;

-- Policies for disputes
create policy "Users involved can view disputes" on public.disputes
  for select using (
    opened_by = auth.uid() or 
    exists (
      select 1 from public.jobs j 
      where j.id = job_id and (j.client_id = auth.uid() or j.provider_id = auth.uid())
    ) or
    exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users involved can open disputes" on public.disputes
  for insert with check (
    opened_by = auth.uid() and (
      exists (
        select 1 from public.jobs j 
        where j.id = job_id and (j.client_id = auth.uid() or j.provider_id = auth.uid())
      )
    )
  );

create policy "Admins can update disputes" on public.disputes
  for update using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));


-- ─────────────────────────────────────────────────────────────────────────────
-- TRIGGER FUNCTIONS & AUTOMATIONS
-- ─────────────────────────────────────────────────────────────────────────────

-- Create trigger function to sync new auth users into public profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', 'User'),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function on every auth signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ─────────────────────────────────────────────────────────────────────────────
-- INITIAL MOCK/SEED DATA SQL SCRIPT (Optional testing template)
-- ─────────────────────────────────────────────────────────────────────────────
/*
-- Run these only if you want manual test accounts:
-- User IDs here match Supabase Auth UUID format.

-- Insert Admin Account
-- insert into public.profiles (id, name, email, role, is_verified)
-- values ('admin-uuid-here', 'System Admin', 'admin@hustlehub.com', 'admin', true);
*/


