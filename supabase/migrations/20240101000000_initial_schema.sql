-- Enable pgvector for semantic similarity
create extension if not exists vector;

-- Main notes table
create table notes (
  id          uuid        primary key default gen_random_uuid(),
  content     text        not null,
  category    text,
  created_at  timestamptz not null default now(),
  embedding   vector(1536)
);

-- Bidirectional links between notes
create table note_links (
  source_id  uuid        not null references notes(id) on delete cascade,
  target_id  uuid        not null references notes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (source_id, target_id),
  check (source_id != target_id)
);

-- ANN index for vector similarity search (cosine distance)
create index notes_embedding_idx on notes
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Row Level Security
alter table notes      enable row level security;
alter table note_links enable row level security;

-- Open policies for MVP (add auth-based scoping when adding multi-user support)
create policy "all_notes"      on notes      for all using (true) with check (true);
create policy "all_note_links" on note_links for all using (true) with check (true);
