import { ThreadChunk, ThreadEssay, TweeterJSON, Thread } from "@/types";
import fs from "fs";
import { encode } from "gpt-3-encoder";

const CHUNK_SIZE = 200;

const getThreads = async () => {
    const jsonString = fs.readFileSync("/Users/terrellewis/Desktop/weave-threads-gpt/scripts/joulee-threads.json", 'utf8');
    const data = JSON.parse(jsonString);
    return data.threads;
};

const getEssay = async (threadObj: Thread) => {
  const { thread, url , date, tweeter, status_id} = threadObj;

  let essay: ThreadEssay = {
    twitter_handle: "",
    url: "",
    date: "",
    content: "",
    length: 0,
    tokens: 0,
    chunks: []
  };

  const trimmedContent = thread.trim();
  essay = {
    twitter_handle: tweeter,
    url: url,
    date: date,
    content: trimmedContent,
    length: trimmedContent.length,
    tokens: encode(trimmedContent).length,
    chunks: []
  };
  return essay;
};

const chunkEssay = async (essay: ThreadEssay) => {
  const { twitter_handle, url, date, content, ...chunklessSection } = essay;

  let essayTextChunks = [];

  if (encode(content).length > CHUNK_SIZE) {
    const split = content.split(". ");
    let chunkText = "";

    for (let i = 0; i < split.length; i++) {
      const sentence = split[i];
      const sentenceTokenLength = encode(sentence);
      const chunkTextTokenLength = encode(chunkText).length;

      if (chunkTextTokenLength + sentenceTokenLength.length > CHUNK_SIZE) {
        essayTextChunks.push(chunkText);
        chunkText = "";
      }

      if (sentence[sentence.length - 1].match(/[a-z0-9]/i)) {
        chunkText += sentence + ". ";
      } else {
        chunkText += sentence + " ";
      }
    }

    essayTextChunks.push(chunkText.trim());
  } else {
    essayTextChunks.push(content.trim());
  }

  const essayChunks = essayTextChunks.map((text) => {
    const trimmedText = text.trim();

    const chunk: ThreadChunk = {
      twitter_handle: twitter_handle,
      essay_url: url,
      essay_date: date,
      content: trimmedText,
      content_length: trimmedText.length,
      content_tokens: encode(trimmedText).length,
      embedding: []
    };

    return chunk;
  });

  if (essayChunks.length > 1) {
    for (let i = 0; i < essayChunks.length; i++) {
      const chunk = essayChunks[i];
      const prevChunk = essayChunks[i - 1];

      if (chunk.content_tokens < 100 && prevChunk) {
        prevChunk.content += " " + chunk.content;
        prevChunk.content_length += chunk.content_length;
        prevChunk.content_tokens += chunk.content_tokens;
        essayChunks.splice(i, 1);
        i--;
      }
    }
  }

  const chunkedSection: ThreadEssay = {
    ...essay,
    chunks: essayChunks
  };

  return chunkedSection;
};

(async () => {
  const threads = await getThreads();

  let essays = [];

  for (let i = 0; i < threads.length; i++) {
    const essay = await getEssay(threads[i]);
    const chunkedEssay = await chunkEssay(essay);
    essays.push(chunkedEssay);
  }

  const json: TweeterJSON = {
    current_date: "2023-03-01",
    author: "Julie Zhuo",
    url: "https://twitter.com/joulee",
    length: essays.reduce((acc, essay) => acc + essay.length, 0),
    tokens: essays.reduce((acc, essay) => acc + essay.tokens, 0),
    essays
  };

  fs.writeFileSync("scripts/julie-book.json", JSON.stringify(json));
})();
