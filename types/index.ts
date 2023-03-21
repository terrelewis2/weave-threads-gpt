export enum OpenAIModel {
  DAVINCI_TURBO = "gpt-3.5-turbo"
}

export type ThreadEssay = {
  twitter_handle: string;
  url: string;
  date: string;
  content: string;
  length: number;
  tokens: number;
  chunks: ThreadChunk[];
};

export type ThreadChunk = {
  twitter_handle: string;
  essay_url: string;
  essay_date: string;
  content: string;
  content_length: number;
  content_tokens: number;
  embedding: number[];
};

export type TweeterJSON = {
  current_date: string;
  author: string;
  url: string;
  length: number;
  tokens: number;
  essays: ThreadEssay[];
};


export type Thread = {
  thread: string;
  url: string;
  date: string;
  tweeter: string;
  status_id: string;
};
