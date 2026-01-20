-- Create a table for comments
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  content_id bigint references content(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  parent_id uuid references comments(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table comments enable row level security;

-- Policies
-- 1. Everyone can view newly created comments (assuming public content)
create policy "Public comments are viewable by everyone"
  on comments for select
  using ( true );

-- 2. Authenticated users can insert comments
create policy "Authenticated users can insert comments"
  on comments for insert
  with check ( auth.uid() = user_id );

-- 3. Users can update their own comments
create policy "Users can update own comments"
  on comments for update
  using ( auth.uid() = user_id );

-- 4. Users can delete their own comments
create policy "Users can delete own comments"
  on comments for delete
  using ( auth.uid() = user_id );

-- Add a function to handle updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for updated_at
create trigger on_comment_update
  before update on comments
  for each row execute procedure handle_updated_at();
