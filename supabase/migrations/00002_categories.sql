-- Categories (hierarchical)
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  parent_id uuid references categories(id),
  icon text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- RLS (read-only for everyone)
alter table categories enable row level security;

create policy "Categories are viewable by everyone"
  on categories for select using (true);
