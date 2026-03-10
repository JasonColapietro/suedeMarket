-- Review role enum
create type review_role as enum ('buyer', 'seller');

-- Reviews
create table reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id),
  reviewer_id uuid not null references profiles(id),
  reviewee_id uuid not null references profiles(id),
  rating integer not null check (rating >= 1 and rating <= 5),
  title text,
  body text,
  role review_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(order_id, reviewer_id)
);

create index reviews_reviewee_idx on reviews(reviewee_id);

create trigger reviews_updated_at
  before update on reviews
  for each row execute function update_updated_at();

-- Auto-update reputation score
create or replace function update_reputation_score()
returns trigger as $$
begin
  update profiles set
    reputation_score = (
      select coalesce(round(avg(rating)::numeric, 2), 0)
      from reviews where reviewee_id = new.reviewee_id
    ),
    total_reviews = (
      select count(*) from reviews where reviewee_id = new.reviewee_id
    )
  where id = new.reviewee_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_review_created
  after insert on reviews
  for each row execute function update_reputation_score();

-- RLS
alter table reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on reviews for select using (true);

create policy "Users can create reviews for their orders"
  on reviews for insert
  with check (
    reviewer_id = auth.uid() and
    exists (
      select 1 from orders o
      where o.id = reviews.order_id
      and o.status = 'completed'
      and (o.buyer_id = auth.uid() or o.seller_id = auth.uid())
    )
  );
