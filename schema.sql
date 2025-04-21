create table api_keys (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  key text not null unique,
  type text not null check (type in ('dev', 'prod')),
  usage integer not null default 0,
  limit integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
); 