import { OpenAIStream } from "@/utils";

export const config = {
  runtime: "edge"
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { prompt, apiKey } = (await req.json()) as {
      prompt: string;
      apiKey: string;
    };

    if (!prompt || !apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      const stream = await OpenAIStream(prompt, apiKey);
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        }
      });
    } catch (error: any) {
      console.error("OpenAI Stream Error:", error.message);
      return new Response(
        JSON.stringify({ error: "Failed to generate response" }), 
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
