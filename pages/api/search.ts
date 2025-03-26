import { supabaseAdmin } from "@/utils";

export const config = {
  runtime: "edge"
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { query, apiKey, matches, twitterHandle } = (await req.json()) as {
      query: string;
      apiKey: string;
      matches: number;
      twitterHandle: string;
    };

    const input = query.replace(/\n/g, " ");
    const twitter_handle = twitterHandle;

    try {
      const res = await fetch("https://api.openai.com/v1/embeddings", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        method: "POST",
        body: JSON.stringify({
          model: "text-embedding-ada-002",
          input
        })
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("OpenAI API Error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to generate embeddings" }),
          { status: res.status, headers: { "Content-Type": "application/json" } }
        );
      }

      const json = await res.json();
      const embedding = json.data[0].embedding;

      const { data: chunks, error } = await supabaseAdmin.rpc("tweeter_search", {
        query_embedding: embedding,
        similarity_threshold: 0.01,
        match_count: matches,
        input_handle: twitter_handle
      });

      if (error) {
        console.error("Supabase Error:", error);
        return new Response(
          JSON.stringify({ error: "Database search failed" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(chunks), { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("OpenAI API Request Error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to process search request" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Request Parsing Error:", error);
    return new Response(
      JSON.stringify({ error: "Invalid request format" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
};

export default handler;
