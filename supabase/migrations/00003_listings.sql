-- Condition and status enums
create type listing_condition as enum ('mint', 'excellent', 'good', 'fair', 'poor');
create type listing_status as enum ('draft', 'active', 'sold', 'archived');

-- Listings
create table listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  category_id uuid references categories(id),
  title text not null,
  description text,
  price_cents integer not null check (price_cents > 0),
  condition listing_condition not null default 'good',
  brand text,
  model text,
  year integer,
  status listing_status not null default 'active',
  images text[] not null default '{}',
  tags text[] not null default '{}',
  location text,
  shipping_info text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Full-text search index
alter table listings add column fts tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(brand, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(model, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) stored;

create index listings_fts_idx on listings using gin(fts);
create index listings_category_idx on listings(category_id);
create index listings_seller_idx on listings(seller_id);
create index listings_status_idx on listings(status);
create index listings_price_idx on listings(price_cents);

create trigger listings_updated_at
  before update on listings
  for each row execute function update_updated_at();

-- RLS
alter table listings enable row level security;

create policy "Active listings are viewable by everyone"
  on listings for select using (status = 'active' or seller_id = auth.uid());

create policy "Users can create own listings"
  on listings for insert with check (seller_id = auth.uid());

create policy "Users can update own listings"
  on listings for update using (seller_id = auth.uid());

create policy "Users can delete own listings"
  on listings for delete using (seller_id = auth.uid());
