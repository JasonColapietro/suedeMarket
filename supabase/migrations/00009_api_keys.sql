-- API keys for agent auth
create table api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  key_hash text not null unique,
  key_prefix text not null,
  label text,
  is_active boolean not null default true,
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

create index api_keys_hash_idx on api_keys(key_hash) where is_active = true;
create index api_keys_user_idx on api_keys(user_id);

-- RLS
alter table api_keys enable row level security;

create policy "Users can view own API keys"
  on api_keys for select
  using (user_id = auth.uid());

create policy "Users can create own API keys"
  on api_keys for insert
  with check (user_id = auth.uid());

create policy "Users can update own API keys"
  on api_keys for update
  using (user_id = auth.uid());

create policy "Users can delete own API keys"
  on api_keys for delete
  using (user_id = auth.uid());
