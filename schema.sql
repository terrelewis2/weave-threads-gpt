--  RUN 1st
create extension vector;

-- RUN 2nd
create table tweeter (
  id bigserial primary key,
  twitter_handle text,
  essay_url text,
  essay_date text,
  content text,
  content_length bigint,
  content_tokens bigint,
  embedding vector (1536)
);

-- RUN to create questions table
create table questions (
  id bigserial primary key,
  twitter_handle text,
  essay_url text,
  essay_date text,
  question text
);

-- RUN 3rd after running the scripts
create or replace function tweeter_search (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int,
  input_handle text
)
returns table (
  id bigint,
  twitter_handle text,
  essay_url text,
  essay_date text,
  content text,
  content_length bigint,
  content_tokens bigint,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    tweeter.id,
    tweeter.twitter_handle,
    tweeter.essay_url,
    tweeter.essay_date,
    tweeter.content,
    tweeter.content_length,
    tweeter.content_tokens,
    1 - (tweeter.embedding <=> query_embedding) as similarity
  from tweeter
  where tweeter.twitter_handle = input_handle
  and 1 - (tweeter.embedding <=> query_embedding) > similarity_threshold
  order by tweeter.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- RUN 4th
-- the code creates an index on the "tweeter" dataset using the IVFFlat method to enable efficient similarity search based on cosine similarity for embedding vectors.
-- The index is configured to use 100 lists or partitions to speed up search times.
create index on tweeter 
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);