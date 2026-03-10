-- Offer status enum
create type offer_status as enum ('pending', 'accepted', 'rejected', 'countered', 'expired', 'withdrawn');

-- Offers
create table offers (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  buyer_id uuid not null references profiles(id) on delete cascade,
  seller_id uuid not null references profiles(id) on delete cascade,
  amount_cents integer not null check (amount_cents > 0),
  status offer_status not null default 'pending',
  parent_offer_id uuid references offers(id),
  message text,
  expires_at timestamptz not null default (now() + interval '48 hours'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index offers_listing_idx on offers(listing_id);
create index offers_buyer_idx on offers(buyer_id);
create index offers_seller_idx on offers(seller_id);

create trigger offers_updated_at
  before update on offers
  for each row execute function update_updated_at();

-- RLS
alter table offers enable row level security;

create policy "Users can view own offers"
  on offers for select
  using (buyer_id = auth.uid() or seller_id = auth.uid());

create policy "Buyers can create offers"
  on offers for insert
  with check (buyer_id = auth.uid());

create policy "Participants can update offers"
  on offers for update
  using (buyer_id = auth.uid() or seller_id = auth.uid());
