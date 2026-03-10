-- Message type enum
create type message_type as enum ('text', 'offer', 'system');

-- Conversations (one per buyer+listing)
create table conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  buyer_id uuid not null references profiles(id) on delete cascade,
  seller_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(listing_id, buyer_id)
);

create trigger conversations_updated_at
  before update on conversations
  for each row execute function update_updated_at();

-- Messages
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  message_type message_type not null default 'text',
  content text not null,
  offer_amount_cents integer,
  created_at timestamptz not null default now()
);

create index messages_conversation_idx on messages(conversation_id, created_at);

-- Enable realtime
alter publication supabase_realtime add table messages;

-- RLS
alter table conversations enable row level security;
alter table messages enable row level security;

create policy "Users can view own conversations"
  on conversations for select
  using (buyer_id = auth.uid() or seller_id = auth.uid());

create policy "Users can create conversations as buyer"
  on conversations for insert
  with check (buyer_id = auth.uid());

create policy "Users can view messages in own conversations"
  on messages for select
  using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );

create policy "Users can send messages in own conversations"
  on messages for insert
  with check (
    sender_id = auth.uid() and
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );
