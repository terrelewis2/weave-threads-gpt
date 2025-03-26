import { supabaseAdmin } from "@/utils";

export const config = {
  runtime: "edge"
};

const handler = async (req: Request): Promise<Response> => {
  try {
    // Parse the request body
    const { twitterHandle, from, to } = (await req.json()) as {
      twitterHandle: string;
      from: number;
      to: number;
    };

    console.log("Fetching questions:", { twitterHandle, from, to });

    if (!twitterHandle) {
      console.error("Missing twitterHandle parameter");
      return new Response(
        JSON.stringify({ 
          error: "Missing twitterHandle parameter",
          questions: [],
          hasMore: false
        }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Query the database
    const { data: questions, error, count: totalCount } = await supabaseAdmin
      .from("questions")
      .select("question, id", { count: "exact" })
      .eq("twitter_handle", twitterHandle)
      .range(from, to);
    
    if (error) {
      console.error("Supabase query error:", error);
      return new Response(
        JSON.stringify({ 
          error: "Database error: " + error.message,
          questions: [],
          hasMore: false
        }), 
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    console.log(`Found ${questions?.length || 0} questions, total: ${totalCount || 0}`);
    
    const hasMore = totalCount !== null && to + 1 < totalCount;

    // Format the response
    const responsePayload = {
      questions: questions || [],
      hasMore: hasMore,
      debug: {
        totalCount,
        range: { from, to }
      }
    };

    return new Response(
      JSON.stringify(responsePayload), 
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error: any) {
    console.error("API handler error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Server error: " + (error?.message || "Unknown error"),
        questions: [],
        hasMore: false
      }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

export default handler;
