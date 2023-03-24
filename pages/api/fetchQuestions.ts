import { supabaseAdmin } from "@/utils";

export const config = {
  runtime: "edge"
};


const handler = async (req: Request): Promise<Response> => {
  try {
    const {twitterHandle, from, to} = (await req.json()) as {
      twitterHandle: string;
      from: number;
      to: number;
    };

    console.log("from", from);
    console.log("to", to);
    console.log("twitter_handle", twitterHandle);

    const { data: questions, error, count: totalCount} = await supabaseAdmin
        .from("questions")
        .select("*, id", { count: "exact" })
        .eq("twitter_handle", twitterHandle)
        .range(from, to);
    
    if (error) {
        console.error(error);
        return new Response("Error", { status: 500 });
    }

    const hasMore = totalCount !== null && to + 1 < totalCount;

    const responsePayload = {
        questions: questions,
        hasMore: hasMore,
    };

    return new Response(JSON.stringify(responsePayload), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Error", { status: 500 });
    }
};

export default handler;
