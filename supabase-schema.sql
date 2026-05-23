-- ============================================================
-- VendeBYD - Supabase Schema
-- Run this in: supabase.com → SQL Editor → Run
-- ============================================================

-- 1. User profiles (extends Supabase auth.users)
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text not null,
  name        text not null,
  phone       text,
  user_type   text check (user_type in ('seller','buyer','dealer')) default 'buyer',
  cuit        text,
  rating      numeric default 5,
  created_at  timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view all profiles"  on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- 2. Listings
create table public.listings (
  id                   uuid default gen_random_uuid() primary key,
  seller_id            uuid references auth.users(id) on delete cascade not null,
  seller_name          text not null,
  seller_rating        numeric default 5,
  brand                text default 'BYD',
  model                text not null,
  year                 integer not null,
  vin                  text not null,
  odometer             integer default 0,
  condition            text check (condition in ('excellent','good','fair','poor')) default 'good',
  color                text,
  city                 text not null,
  province             text not null,
  description          text,
  price                bigint not null,
  vat                  bigint default 0,
  final_price          bigint not null,
  photo_urls           text[] default '{}',
  status               text check (status in ('active','pending','sold')) default 'active',
  verification_status  text check (verification_status in ('pending','verified','rejected')) default 'verified',
  is_first_sale        boolean default true,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);
alter table public.listings enable row level security;
create policy "Anyone can view active listings" on public.listings for select using (status = 'active');
create policy "Sellers can insert own listings" on public.listings for insert with check (auth.uid() = seller_id);
create policy "Sellers can update own listings" on public.listings for update using (auth.uid() = seller_id);

-- 3. Conversations
create table public.conversations (
  id               uuid default gen_random_uuid() primary key,
  listing_id       uuid references public.listings(id) on delete cascade not null,
  buyer_id         uuid references auth.users(id) on delete cascade not null,
  buyer_name       text not null,
  seller_id        uuid references auth.users(id) on delete cascade not null,
  seller_name      text not null,
  last_message     text default '',
  last_message_at  timestamptz default now(),
  created_at       timestamptz default now(),
  unique(listing_id, buyer_id)
);
alter table public.conversations enable row level security;
create policy "Participants can view conversations" on public.conversations for select using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "Buyers can create conversations"    on public.conversations for insert with check (auth.uid() = buyer_id);
create policy "Participants can update conversations" on public.conversations for update using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- 4. Messages
create table public.messages (
  id               uuid default gen_random_uuid() primary key,
  conversation_id  uuid references public.conversations(id) on delete cascade not null,
  sender_id        uuid references auth.users(id) on delete cascade not null,
  sender_name      text not null,
  text             text not null,
  read             boolean default false,
  created_at       timestamptz default now()
);
alter table public.messages enable row level security;
create policy "Participants can view messages" on public.messages for select using (
  exists (select 1 from public.conversations c where c.id = conversation_id and (c.buyer_id = auth.uid() or c.seller_id = auth.uid()))
);
create policy "Participants can insert messages" on public.messages for insert with check (auth.uid() = sender_id);

-- 5. Offers
create table public.offers (
  id               uuid default gen_random_uuid() primary key,
  listing_id       uuid references public.listings(id) on delete cascade not null,
  buyer_id         uuid references auth.users(id) on delete cascade not null,
  buyer_name       text not null,
  amount           bigint not null,
  status           text check (status in ('pending','accepted','rejected')) default 'pending',
  deposit_amount   bigint default 0,
  message          text,
  created_at       timestamptz default now()
);
alter table public.offers enable row level security;
create policy "Buyers can view own offers"   on public.offers for select using (auth.uid() = buyer_id);
create policy "Sellers can view their offers" on public.offers for select using (
  exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = auth.uid())
);
create policy "Buyers can insert offers"     on public.offers for insert with check (auth.uid() = buyer_id);
create policy "Sellers can update offers"    on public.offers for update using (
  exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = auth.uid())
);

-- 6. Storage bucket for listing photos
insert into storage.buckets (id, name, public) values ('listing-photos', 'listing-photos', true);
create policy "Anyone can view photos"      on storage.objects for select using (bucket_id = 'listing-photos');
create policy "Auth users can upload photos" on storage.objects for insert with check (bucket_id = 'listing-photos' and auth.role() = 'authenticated');

-- 7. Realtime (enable for messaging)
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.listings;
alter publication supabase_realtime add table public.conversations;
