import { ThreadEssay, TweeterJSON, OpenAIModel } from "@/types";
import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import { Configuration} from "openai";


loadEnvConfig("");

const generateQuestions = async (essays: ThreadEssay[]) => {
  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  for (let i = 0; i < essays.length; i++) {
    const essay = essays[i];
    const { twitter_handle, url, date, content} = essay;
    const prompt: string = `Generate potential questions for the following essay:\n\n${content}`;
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${configuration.apiKey}`
        },
        method: "POST",
        body: JSON.stringify({
          model: OpenAIModel.DAVINCI_TURBO,
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that accurately returns a list of plausible questions from the essay. The questions should be more generic than specific. The questions should be such that if asked that question, the provided essay should be able to be referenced for the answer to the question. Try to use your own words when possible. Your questions shouldn't be too long, just one liners. Do not generate more than 2 questions per essay. The 2 questions must be the most relevant and something that people would want to search for. Be accurate, concise, and clear."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 150,
          temperature: 0.0
    })
      });

      if (res.status !== 200) {
        throw new Error("OpenAI API returned an error");
      }

      
    const data = await res.json();
    console.log(data.choices[0].message.content);
    const questions = data.choices[0].message.content.split("\n");
    //for each question in questions, insert into db
    for (let j = 0; j < questions.length; j++) {
        const question = questions[j].split(". ")[1];
        const { data, error } = await supabase
        .from("questions")
        .insert({
            twitter_handle,
            essay_url: url,
            essay_date: date,
            question: question,
        })
        .select("*");

        if (error) {
            console.log("error", error);
          } else {
            console.log("saved", i, j);
          }

      /**const { data, error } = await supabase
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
      }*/

      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
};

(async () => {
  const book: TweeterJSON = JSON.parse(fs.readFileSync("scripts/greg-book.json", "utf8"));

  await generateQuestions(book.essays);
})();
