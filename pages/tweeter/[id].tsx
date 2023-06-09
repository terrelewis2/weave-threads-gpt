import { Answer } from "@/components/Answer/Answer";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { AsyncPaginate, LoadOptions } from "react-select-async-paginate";
import { ThreadChunk, Question} from "@/types";
import { IconArrowRight, IconBrandTwitter, IconSearch } from "@tabler/icons-react";
import endent from "endent";
import Head from "next/head";
import Image from "next/image";
import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';

interface OptionType {
  value: string;
  label: string;
}

export default function Home() {
  const apiKey = process.env.OPENAI_API_KEY || ""; // get the value of the API_KEY variable, or set it to an empty string if it's not defined
  const [query, setQuery] = useState<string>("");

  const [chunks, setChunks] = useState<ThreadChunk[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<OptionType>({ value: "", label: "" });


  const LIMIT = 20;

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [mode, setMode] = useState<"search" | "chat">("chat");
  const [matchCount, setMatchCount] = useState<number>(5);
  const router = useRouter();
  const { id, placeholderQuestion } = router.query;
  const placeholder = Array.isArray(placeholderQuestion)
  ? placeholderQuestion.join(', ') // Join the array elements into a single string
  : placeholderQuestion || 'Ask a question'; // Use a default value if the variable is undefined

  const imgPath = `/images/${id}.jpeg`;

  const inputRef = useRef<HTMLInputElement>(null);

  const rightLink = {
    href: `http://www.twitter.com/${id}`,
    label: `Checkout @${id} on Twitter`,
  };

  const loadOptions: LoadOptions<any, any, { page: number }> = async (
    searchQuery,
    loadedOptions,
    
  ) => {
    const start = loadedOptions.length;
    const end = start + LIMIT;
    console.log("start", start, "end", end);
    const response = await fetch("/api/fetchQuestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        },
      body: JSON.stringify({ twitterHandle: id, from: start, to: end })
    });
    const json = await response.json();

    return {
      options: json.questions.map((item: Question) => ({ value: item.question, label: item.question })),
      hasMore: json.hasMore
    };
  };

  const handleSearch = async () => {
    if (!query) {
      alert("Please enter a query.");
      return;
    }

    setAnswer("");
    setChunks([]);

    setLoading(true);

    const searchResponse = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, apiKey, matches: matchCount, twitterHandle:id})
    });

    if (!searchResponse.ok) {
      setLoading(false);
      throw new Error(searchResponse.statusText);
    }

    const results: ThreadChunk[] = await searchResponse.json();

    setChunks(results);

    setLoading(false);

    //inputRef.current?.focus();

    return results;
  };

  const handleItemSelect = (item:OptionType) => {
    console.log("Selected item:", item);

    setSelectedItem(item);
    setQuery(item.label); // Or use item.value if you want to show the selected value
    inputRef?.current?.focus(); // To keep focus on the input field
  };

  const handleAnswer = async () => {
    if (!apiKey) {
      alert("Please enter an API key.");
      return;
    }

    if (!query) {
      alert("Please enter a query.");
      return;
    }

    setAnswer("");
    setChunks([]);

    setLoading(true);

    const searchResponse = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, apiKey, matches: matchCount, twitterHandle:id})
    });

    if (!searchResponse.ok) {
      setLoading(false);
      throw new Error(searchResponse.statusText);
    }

    const results: ThreadChunk[] = await searchResponse.json();

    setChunks(results);

    const prompt = endent`
    Use the following passages to provide an answer to the query: "${query}"

    ${results?.map((d: any) => d.content).join("\n\n")}
    `;

    const answerResponse = await fetch("/api/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt, apiKey })
    });

    if (!answerResponse.ok) {
      setLoading(false);
      throw new Error(answerResponse.statusText);
    }

    const data = answerResponse.body;

    if (!data) {
      return;
    }

    setLoading(false);

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setAnswer((prev) => prev + chunkValue);
    }

    //inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (mode === "search") {
        handleSearch();
      } else {
        handleAnswer();
      }
    }
  };

  const handleSave = () => {
    localStorage.setItem("PG_MATCH_COUNT", matchCount.toString());
    localStorage.setItem("PG_MODE", mode);

    setShowSettings(false);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    localStorage.removeItem("PG_MATCH_COUNT");
    localStorage.removeItem("PG_MODE");

    setMatchCount(5);
    setMode("chat");
  };

  useEffect(() => {
    if (matchCount > 10) {
      setMatchCount(10);
    } else if (matchCount < 1) {
      setMatchCount(1);
    }
  }, [matchCount]);

  useEffect(() => {
    const PG_MATCH_COUNT = localStorage.getItem("PG_MATCH_COUNT");
    const PG_MODE = localStorage.getItem("PG_MODE");

    if (PG_MATCH_COUNT) {
      setMatchCount(parseInt(PG_MATCH_COUNT));
    }

    if (PG_MODE) {
      setMode(PG_MODE as "search" | "chat");
    }

    inputRef.current?.focus();
  }, []);

  return (
    <>
      <Head>
        <title>Weave Threads GPT</title>
        <meta
          name="description"
          content={`AI-powered search and chat for Twitter Threads from @${id}`}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/weave.ico"
        />
      </Head>

      <div className="flex flex-col h-screen">
        <Navbar rightLink={rightLink} />
        <div className="flex-1 overflow-auto">
          <div className="mx-auto flex h-full w-full max-w-[750px] flex-col items-center px-3 pt-4 sm:pt-8">
            <button
              className="mt-4 flex cursor-pointer items-center space-x-2 rounded-full border border-zinc-600 px-3 py-1 text-sm hover:opacity-50"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? "Hide" : "Show"} Settings
            </button>

            {showSettings && (
              <div className="w-[340px] sm:w-[400px]">
                <div>
                  <div>Mode</div>
                  <select
                    className="max-w-[400px] block w-full cursor-pointer rounded-md border border-gray-300 p-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    value={mode}
                    onChange={(e) => setMode(e.target.value as "search" | "chat")}
                  >
                    <option value="search">Search</option>
                    <option value="chat">Chat</option>
                  </select>
                </div>

                <div className="mt-2">
                  <div>Passage Count</div>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={matchCount}
                    onChange={(e) => setMatchCount(Number(e.target.value))}
                    className="max-w-[400px] block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div className="mt-4 flex space-x-2 justify-center">
                  <div
                    className="flex cursor-pointer items-center space-x-2 rounded-full bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
                    onClick={handleSave}
                  >
                    Save
                  </div>

                  <div
                    className="flex cursor-pointer items-center space-x-2 rounded-full bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                    onClick={handleClear}
                  >
                    Clear
                  </div>
                </div>
              </div>
            )}

              <div className="relative w-full mt-4">
                <IconSearch className="absolute top-3 w-10 left-1 h-6 rounded-full opacity-50 sm:left-3 sm:top-4 sm:h-8" />

                <input
                  ref={inputRef}
                  className="h-12 w-full rounded-full border border-zinc-600 pr-12 pl-11 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 sm:h-16 sm:py-2 sm:pr-16 sm:pl-16 sm:text-lg"
                  type="text"
                  placeholder={placeholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

                <button>
                  <IconArrowRight
                    onClick={mode === "search" ? handleSearch : handleAnswer}
                    className="absolute right-2 top-2.5 h-7 w-7 rounded-full bg-[#1da1f2] p-1 hover:cursor-pointer hover:bg-blue-600 sm:right-3 sm:top-3 sm:h-10 sm:w-10 text-white"
                  />
                </button>

                <AsyncPaginate 
                  isSearchable={false}
                  loadOptions={loadOptions} 
                  placeholder="Pick a question"
                  className="mt-8"
                  onChange={handleItemSelect}
                  />

              </div>

            {loading ? (
              <div className="mt-6 w-full">
                {mode === "chat" && (
                  <>
                    <div className="font-bold text-2xl">Answer</div>
                    <div className="animate-pulse mt-2">
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded mt-2"></div>
                      <div className="h-4 bg-gray-300 rounded mt-2"></div>
                      <div className="h-4 bg-gray-300 rounded mt-2"></div>
                      <div className="h-4 bg-gray-300 rounded mt-2"></div>
                    </div>
                  </>
                )}

                <div className="font-bold text-2xl mt-6">Passages</div>
                <div className="animate-pulse mt-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2"></div>
                </div>
              </div>
            ) : answer ? (
              <div className="mt-6 flex h-full w-full max-w-[750px] flex-col px-3 pt-4 sm:pt-8">
                <div className="font-bold text-2xl mb-2">Answer</div>
                <Answer text={answer} />

                <div className="mt-6 mb-16">
                  <div className="font-bold text-2xl">Related Threads</div>

                  {chunks.map((chunk, index) => (
                    <div key={index}>
                      <div className="mt-4 border border-zinc-600 rounded-lg p-4">
                        <div className="flex auto">
                            <div className="flex items-center">
                            <div className="mr-4">
                              <Image
                                src={imgPath}
                                alt="Profile picture"
                                width={50}
                                height={50}
                                style={{ borderRadius: "50%" }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <div className="me-4 font-bold text-xl">View Thread</div>
                              <div className="mt-1 font-bold text-sm">{new Date(chunk.essay_date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</div>
                            </div>
                          </div>
                          <a
                            className="hover:opacity-50 ml-2"
                            href={chunk.essay_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <IconBrandTwitter
                              color="#1DA1F2"
                            />
                          </a>
                        </div>
                        <div className="mt-3">{chunk.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : chunks.length > 0 ? (
              <div className="mt-6 pb-16">
                <div className="font-bold text-2xl">Passages</div>
                {chunks.map((chunk, index) => (
                  <div key={index}>
                    <div className="mt-4 border border-zinc-600 rounded-lg p-4">
                        <div className="flex auto">
                        <div className="flex items-center">
                            <div className="mr-4">
                              <Image
                                src={imgPath}
                                alt="Profile picture"
                                width={50}
                                height={50}
                                style={{ borderRadius: "50%" }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <div className="me-4 font-bold text-xl">View Thread</div>
                              <div className="mt-1 font-bold text-sm">{new Date(chunk.essay_date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</div>
                            </div>
                          </div>
                          <a
                            className="hover:opacity-50 ml-2"
                            href={chunk.essay_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <IconBrandTwitter
                              color="#1DA1F2"
                            />
                          </a>
                        </div>
                      <div className="mt-2">{chunk.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 text-center text-lg">{`AI-powered search & chat for threads written by @${id}`}</div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
