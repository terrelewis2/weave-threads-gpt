# Weave Threads GPT

GPT-powered search and chat for Twitter threads from your favorite tweeters.

The project currently supports threads from these creators:

[Shreyas Doshi](https://twitter.com/shreyas)

[Julie Zhuo](https://twitter.com/joulee)

[Greg Isenberg](https://twitter.com/gregisenberg)

[Sooraj Chandran](https://twitter.com/soorajchandran_)

All code & data used is 100% open-source.

## Dataset

The threads and book datasets are JSON files file containing all threads & their corresponding chunks respectively.

I recommend getting familiar with fetching, cleaning, and storing data as outlined in the scraping and embedding scripts below, but feel free to skip those steps and just use the dataset.

## How It Works

Weave Threads GPT provides 2 things:

1. A search interface.
2. A chat interface.

### Search

Search was created with [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings) (`text-embedding-ada-002`).

First, we loop over the threads and generate embeddings for each chunk of text.

Then in the app we take the user's search query, generate an embedding, and use the result to find the most similar passages from the book.

The comparison is done using cosine similarity across our database of vectors.

Our database is a Postgres database with the [pgvector](https://github.com/pgvector/pgvector) extension hosted on [Supabase](https://supabase.com/).

Results are ranked by similarity score and returned to the user.

### Chat

Chat builds on top of search. It uses search results to create a prompt that is fed into GPT-3.5-turbo.

This allows for a chat-like experience where the user can ask questions regarding the tweeter's areas of expertise and get answers.

## Running Locally

Here's a quick overview of how to run it locally.

### Requirements

1. Set up OpenAI

You'll need an OpenAI API key to generate embeddings.

2. Set up Supabase and create a database

Note: You don't have to use Supabase. Use whatever method you prefer to store your data. But I like Supabase and think it's easy to use.

There is a schema.sql file in the root of the repo that you can use to set up the database.

Run that in the SQL editor in Supabase as directed.

I recommend turning on Row Level Security and setting up a service role to use with the app.

### Repo Setup

3. Clone repo

```bash
git clone https://github.com/terrelewis2/weave-threads-gpt.git
```

4. Install dependencies

```bash
npm i
```

5. Set up environment variables

Create a .env.local file in the root of the repo with the following variables:

```bash
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY= 
```

### Dataset

6. Run tweet_fetcher script
I wrote this script in Python using the Tweepy library, you can do the equivalent in Node.js as well if you're comformatable with that.

Initialize the `twitter_handle` field with the handle of the user whose tweets you'd like to fetch

```bash
python tweet_fetcher.py
```
This fetches all the twitter threads of the user from the past 3 years. You might need to manually filter out some threads that don't seem necessary.

7. Run formatting script

```bash
npm run format
```

This formats all the threads and splits them into relevant chunks and saves them to a json file.

8. Run embedding script

```bash
npm run embed
```

This reads the json file, generates embeddings for each chunk of text, and saves the results to your database.

There is a 200ms delay between each request to avoid rate limiting.

This process will take 20-30 minutes.

### App

9. Run app

```bash
npm run dev
```

## Credits

Thanks to [Mckay Wrigley](https://twitter.com/mckaywrigley) whose project [PaulGrahamGPT](https://github.com/mckaywrigley/paul-graham-gpt) served as the foundation for this project.

I also want to thank all the tweeters whose threads made this project possible. I've learnt over the years from their threads and I hope this tool can enhance that learning experience

## Contact

If you have any questions, feel free to reach out to me on [Twitter](https://twitter.com/terrelewis2)!
