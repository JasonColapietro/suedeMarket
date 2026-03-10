-- Order status and payment method enums
create type order_status as enum ('pending', 'confirmed', 'shipped', 'delivered', 'completed', 'cancelled');
create type payment_method as enum ('placeholder', 'crypto', 'virtuals_protocol');

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id),
  buyer_id uuid not null references profiles(id),
  seller_id uuid not null references profiles(id),
  offer_id uuid references offers(id),
  amount_cents integer not null check (amount_cents > 0),
  total_cents integer generated always as (amount_cents) stored,
  status order_status not null default 'pending',
  payment_method payment_method not null default 'placeholder',
  payment_ref text,
  shipping_address text,
  tracking_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_buyer_idx on orders(buyer_id);
create index orders_seller_idx on orders(seller_id);
create index orders_listing_idx on orders(listing_id);

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- RLS
alter table orders enable row level security;

create policy "Users can view own orders"
  on orders for select
  using (buyer_id = auth.uid() or seller_id = auth.uid());

create policy "System can create orders"
  on orders for insert
  with check (buyer_id = auth.uid());

create policy "Participants can update orders"
  on orders for update
  using (buyer_id = auth.uid() or seller_id = auth.uid());
