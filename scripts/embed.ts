import { ThreadEssay, TweeterJSON } from "@/types";
import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import OpenAI from "openai";

loadEnvConfig("");

const generateEmbeddings = async (essays: ThreadEssay[]) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  for (let i = 0; i < essays.length; i++) {
    const section = essays[i];

    for (let j = 0; j < section.chunks.length; j++) {
      const chunk = section.chunks[j];

      const { twitter_handle, essay_url, essay_date, content, content_length, content_tokens } = chunk;

      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: content
      });

      const embedding = embeddingResponse.data[0].embedding;

      const { data, error } = await supabase
        .from("tweeter")
        .insert({
          twitter_handle,
          essay_url,
          essay_date,
          content,
          content_length,
          content_tokens,
          embedding
        })
        .select("*");

      if (error) {
        console.log("error", error);
      } else {
        console.log("saved", i, j);
      }

      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
};

(async () => {
  const book: TweeterJSON = JSON.parse(fs.readFileSync("scripts/wes-book.json", "utf8"));

  await generateEmbeddings(book.essays);
})();
