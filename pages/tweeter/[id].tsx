import { Answer } from "@/components/Answer/Answer";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { AsyncPaginate, LoadOptions } from "react-select-async-paginate";
import { ThreadChunk, Question} from "@/types";
import { IconArrowRight, IconBrandTwitter, IconSearch, IconMessageCircle, IconChevronDown, IconBulb, IconX, IconListSearch } from "@tabler/icons-react";
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
  const [matchCount, setMatchCount] = useState<number>(5);
  const router = useRouter();
  const { id, placeholderQuestion } = router.query;
  const placeholder = Array.isArray(placeholderQuestion)
    ? placeholderQuestion.join(', ')
    : placeholderQuestion || 'Ask a question';

  const imgPath = `/images/${id}.jpeg`;

  const inputRef = useRef<HTMLInputElement>(null);

  const rightLink = {
    href: `http://www.twitter.com/${id}`,
    label: `Checkout @${id} on Twitter`,
  };

  // Add state for dropdown debugging
  const [dropdownDebug, setDropdownDebug] = useState<string>("");
  const [dropdownKey, setDropdownKey] = useState(0);
  // Add state to store and display the last set of options
  const [lastFetchedOptions, setLastFetchedOptions] = useState<OptionType[]>([]);
  
  // Enhanced refresh function to reset debug message
  const refreshQuestionDropdown = () => {
    console.log("Manually refreshing question dropdown");
    setDropdownDebug("Refreshing questions...");
    setLastFetchedOptions([]); // Clear the last fetched options
    setDropdownKey(prev => prev + 1);
  };

  // Improved loadOptions function to debug and track options
  const loadOptions: LoadOptions<any, any, { page: number }> = async (
    searchQuery,
    loadedOptions,
    additional
  ) => {
    const page = additional?.page || 0;
    
    try {
      const start = loadedOptions.length;
      const end = start + LIMIT - 1; // Adjust to be inclusive range
      console.log("Fetching questions:", { twitterHandle: id, from: start, to: end });
      
      // Set a debug message in the UI
      setDropdownDebug(`Fetching questions for @${id}...`);
      
      const response = await fetch("/api/fetchQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ twitterHandle: id, from: start, to: end })
      });

      if (!response.ok) {
        console.error("Error fetching questions:", response.statusText);
        setDropdownDebug(`Error: ${response.status} ${response.statusText}`);
        // Provide fallback questions if API fails
        if (page === 0) {
          return provideFallbackQuestions();
        }
        return {
          options: [],
          hasMore: false,
          additional: { page: page + 1 }
        };
      }

      const json = await response.json();
      console.log("Received questions:", json);
      
      if (!json.questions || !Array.isArray(json.questions)) {
        console.error("Invalid question data format:", json);
        setDropdownDebug("Error: Invalid data format received");
        // Provide fallback questions if data format is invalid
        if (page === 0) {
          return provideFallbackQuestions();
        }
        return {
          options: [],
          hasMore: false,
          additional: { page: page + 1 }
        };
      }

      // Map questions to options format with proper debugging
      const options = json.questions.map((item: any) => {
        const questionText = typeof item === 'object' ? (item.question || `Question ${item.id}`) : item;
        const option = { 
          value: typeof item === 'object' ? (item.id || questionText) : item,
          label: questionText
        };
        console.log("Created option:", option);
        return option;
      });

      // Store the options for display in debug panel
      if (options.length > 0) {
        setLastFetchedOptions(options);
      }
      
      // Set success message with more detail
      const questionCount = options.length;
      const debugMessage = questionCount > 0 
        ? `Found ${questionCount} suggested questions. First question: "${options[0]?.label?.substring(0, 30)}${options[0]?.label?.length > 30 ? '...' : ''}"` 
        : "No questions found in the API response";
      setDropdownDebug(debugMessage);
      
      // If no questions found, provide fallback questions
      if (options.length === 0 && page === 0) {
        return provideFallbackQuestions();
      }
      
      console.log(`Returning ${options.length} options, hasMore: ${!!json.hasMore}`);
      return {
        options,
        hasMore: !!json.hasMore,
        additional: { page: page + 1 }
      };
    } catch (error) {
      console.error("Error in loadOptions:", error);
      setDropdownDebug(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Provide fallback questions if there's an error
      if (page === 0) {
        return provideFallbackQuestions();
      }
      return {
        options: [],
        hasMore: false,
        additional: { page: 0 }
      };
    }
  };

  // Helper function to provide fallback questions
  const provideFallbackQuestions = () => {
    console.log("Providing fallback questions");
    setDropdownDebug("Using fallback questions (API didn't return results)");
    const fallbackQuestions = [
      `What are ${id}&apos;s tips for career growth?`,
      `How does ${id} approach problem-solving?`,
      `What&apos;s ${id}&apos;s opinion on leadership?`,
      `What are ${id}&apos;s favorite books or resources?`
    ];
    
    return {
      options: fallbackQuestions.map((q, i) => ({ value: `fallback-${i}`, label: q })),
      hasMore: false,
      additional: { page: 1 }
    };
  };

  // Add function to select a question and submit
  const handleQuestionSelect = (item: OptionType) => {
    console.log("Selected question:", item);
    setSelectedItem(item);
    setQuery(item.label); 
    inputRef?.current?.focus(); // To keep focus on the input field
    
    // Optional: Auto-submit the selected question
    // setTimeout(handleSubmit, 300);
  };

  const handleSubmit = async () => {
    if (!query) {
      alert("Please enter a query.");
      return;
    }

    setAnswer("");
    setChunks([]);
    setLoading(true);

    try {
      // First, get relevant threads with search API
      const searchResponse = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query, apiKey, matches: matchCount, twitterHandle: id })
      });

      if (!searchResponse.ok) {
        setLoading(false);
        throw new Error(searchResponse.statusText);
      }

      const results: ThreadChunk[] = await searchResponse.json();
      setChunks(results);

      // Then, get AI-generated answer if we have results
      if (results.length > 0) {
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

        if (data) {
          const reader = data.getReader();
          const decoder = new TextDecoder();
          let done = false;

          while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            setAnswer((prev) => prev + chunkValue);
          }
        }
      } else {
        setAnswer("I couldn't find any relevant information in the tweets to answer your question. Please try a different query or check if the Twitter handle has content related to your question.");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error processing query:", error);
      setLoading(false);
      alert("An error occurred. Please try again.");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSave = () => {
    localStorage.setItem("PG_MATCH_COUNT", matchCount.toString());
    setShowSettings(false);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    localStorage.removeItem("PG_MATCH_COUNT");
    setMatchCount(5);
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

    if (PG_MATCH_COUNT) {
      setMatchCount(parseInt(PG_MATCH_COUNT));
    }

    inputRef.current?.focus();
  }, []);

  // Add function to manually trigger the test API
  const testFetchQuestionsAPI = async () => {
    setDropdownDebug("Testing API...");
    try {
      console.log("Testing fetchQuestions API...");
      const response = await fetch("/api/fetchQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          twitterHandle: id, 
          from: 0, 
          to: 10 
        })
      });
      
      if (!response.ok) {
        console.error("API test failed with status:", response.status);
        setDropdownDebug(`API Error: ${response.status} ${response.statusText}`);
        return;
      }
      
      const data = await response.json();
      console.log("API test result:", data);
      
      if (data.questions && data.questions.length > 0) {
        setLastFetchedOptions(data.questions.map((item: any) => ({
          value: typeof item === 'object' ? (item.id || item.question) : item,
          label: typeof item === 'object' ? (item.question || `Question ${item.id}`) : item
        })));
        setDropdownDebug(`Success! Found ${data.questions.length} questions.`);
      } else {
        setDropdownDebug("API returned successfully but no questions were found.");
      }
    } catch (error: any) {
      console.error("API test error:", error);
      setDropdownDebug(`API Test Error: ${error?.message || 'Unknown error'}`);
    }
  };

  // Add better initialization effect - fetch questions on load
  useEffect(() => {
    // Fetch initial questions when component loads
    if (id) {
      testFetchQuestionsAPI();
    }
  }, [id]);

  // Direct question fetching function
  const fetchSuggestedQuestions = async () => {
    setDropdownDebug("Fetching initial suggested questions...");
    try {
      const response = await fetch("/api/fetchQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          twitterHandle: id, 
          from: 0, 
          to: 20 
        })
      });
      
      if (!response.ok) {
        console.error("Failed to fetch initial questions:", response.statusText);
        setDropdownDebug(`Error: ${response.status} ${response.statusText}`);
        setLastFetchedOptions(provideFallbackQuestions().options);
        return;
      }
      
      const data = await response.json();
      console.log("Initial questions loaded:", data);
      
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        const options = data.questions.map((item: any) => {
          const questionText = typeof item === 'object' ? (item.question || `Question ${item.id}`) : item;
          return { 
            value: typeof item === 'object' ? (item.id || questionText) : item,
            label: questionText
          };
        });
        
        setLastFetchedOptions(options);
        setDropdownDebug(`Loaded ${options.length} suggested questions`);
      } else {
        setDropdownDebug("No questions found - using fallbacks");
        setLastFetchedOptions(provideFallbackQuestions().options);
      }
    } catch (error) {
      console.error("Error fetching initial questions:", error);
      setDropdownDebug(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLastFetchedOptions(provideFallbackQuestions().options);
    }
  };
  
  // Add state for dropdown visibility
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <>
      <Head>
        <title>Chat with @{id}&apos;s tweets | ThreadsGPT</title>
        <meta name="description" content={`Chat with ${id}&apos;s Twitter threads using AI.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/weave.ico" />
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar rightLink={rightLink} />

        <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
          {/* Header section with profile */}
          <div className="mb-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 relative rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
              <Image 
                src={imgPath} 
                alt={`${id}&apos;s profile`} 
                fill 
                className="object-cover" 
                sizes="(max-width: 768px) 96px, 96px"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Chat with <span className="gradient-text">@{id}</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Ask questions and get answers based on their Twitter threads.
              </p>
            </div>
          </div>

          {/* Settings button */}
          <div className="mb-6">
            <div className="flex items-center justify-end">
              <button
                className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                onClick={() => setShowSettings(!showSettings)}
              >
                <span>Settings</span>
                <IconChevronDown 
                  size={16} 
                  className={`ml-1 transform transition-transform duration-200 ${showSettings ? 'rotate-180' : ''}`} 
                />
              </button>
            </div>

            {/* Settings panel */}
            {showSettings && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="match-count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Number of matches
                    </label>
                    <input
                      id="match-count"
                      type="number"
                      min="1"
                      max="10"
                      value={matchCount}
                      onChange={(e) => setMatchCount(Number(e.target.value))}
                      className="input-modern w-full sm:w-24"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Number of Twitter thread chunks to search through (1-10)
                    </p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleSave}
                      className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search input */}
          <div className="relative mb-6">
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconMessageCircle size={20} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                ref={inputRef}
                className="input-modern pl-10 pr-14 py-3 text-base sm:text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${placeholder}`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                {query && (
                  <button
                    className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    onClick={() => setQuery("")}
                  >
                    <IconX size={18} />
                  </button>
                )}
                <button
                  className={`pr-3 pl-1 flex items-center justify-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 disabled:opacity-50 disabled:cursor-not-allowed ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={handleSubmit}
                  disabled={loading || query.length === 0}
                >
                  <IconArrowRight size={20} />
                </button>
              </div>
            </div>
            
            <div className="mt-2 flex items-center justify-center sm:justify-start text-xs text-gray-500 dark:text-gray-400">
              <IconBulb size={14} className="mr-1 text-yellow-500" />
              <span>Try asking specific questions about {id}&apos;s expertise or opinions</span>
            </div>
          </div>

          {/* Question recommendations - Clean */}
          <div className="mt-6 mb-8">
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <IconListSearch size={18} className="text-primary-500 dark:text-primary-400 mr-2" />
                Suggested questions
              </span>
            </div>
            
            <AsyncPaginate
              key={dropdownKey}
              isSearchable={false}
              loadOptions={loadOptions}
              placeholder="Pick a question"
              className="mt-2"
              onChange={handleQuestionSelect}
              cacheUniqs={[id, dropdownKey]}
              additional={{ page: 0 }}
              defaultOptions
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: 'var(--bg-dropdown, #ffffff)',
                  borderColor: 'var(--border-dropdown, #e2e8f0)',
                  color: 'var(--text-dropdown, #1e293b)',
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: 'var(--bg-dropdown, #ffffff)',
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused ? 'var(--bg-option-focus, #f1f5f9)' : 'var(--bg-dropdown, #ffffff)',
                  color: 'var(--text-dropdown, #1e293b)',
                  ':hover': {
                    backgroundColor: 'var(--bg-option-hover, #f8fafc)',
                  }
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: 'var(--text-dropdown, #1e293b)',
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: 'var(--text-placeholder, #94a3b8)',
                })
              }}
            />
          </div>

          {/* Results section */}
          <div className="mt-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-primary-500 animate-spin mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">Processing your request...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Display answer when available */}
                {answer && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
                    <div className="p-5">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Answer</h2>
                      <div className="prose dark:prose-invert max-w-none">
                        <Answer text={answer} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Always display related threads when available */}
                {chunks.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Related Tweets
                    </h2>
                    <div className="space-y-4">
                      {chunks.map((chunk, index) => (
                        <div 
                          key={index}
                          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                        >
                          <div className="flex items-start">
                            <div className="mr-3 flex-shrink-0">
                              <Image 
                                src={imgPath} 
                                alt={`${id}&apos;s profile`} 
                                width={48} 
                                height={48} 
                                className="rounded-full"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center mb-1">
                                <span className="font-bold text-gray-900 dark:text-white mr-2">@{chunk.twitter_handle}</span>
                                <span className="text-gray-500 dark:text-gray-400 text-xs">
                                  {new Date(chunk.essay_date).toLocaleDateString(undefined, { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </span>
                              </div>
                              <div className="text-gray-800 dark:text-gray-200 mb-2">
                                {chunk.content}
                              </div>
                              <a 
                                href={chunk.essay_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-blue-500 hover:text-blue-600 text-sm"
                              >
                                <IconBrandTwitter size={16} className="mr-1" />
                                View original thread
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Add CSS variables for styling the select component */}
          <style jsx global>{`
            :root {
              --select-bg: #ffffff;
              --select-border: #e2e8f0;
              --select-border-hover: #cbd5e1;
              --select-text: #1e293b;
              --select-placeholder: #64748b;
              --select-option-focus: #0f172a;
              --select-option-hover: #1e293b;
              --select-menu-bg: #0f172a;
              
              /* Dropdown specific vars */
              --bg-dropdown: #ffffff;
              --border-dropdown: #e2e8f0;
              --text-dropdown: #1e293b;
              --text-placeholder: #94a3b8;
              --bg-option-focus: #f1f5f9;
              --bg-option-hover: #f8fafc;
            }
            
            .dark {
              --select-bg: #1e293b;
              --select-border: #334155;
              --select-border-hover: #475569;
              --select-text: #f1f5f9;
              --select-placeholder: #64748b;
              --select-option-focus: #0f172a;
              --select-option-hover: #1e293b;
              --select-menu-bg: #0f172a;
              
              /* Dropdown specific vars for dark mode */
              --bg-dropdown: #1e293b;
              --border-dropdown: #334155;
              --text-dropdown: #f1f5f9;
              --text-placeholder: #94a3b8;
              --bg-option-focus: #334155;
              --bg-option-hover: #475569;
            }
            
            /* Dark mode-specific styles */
            .dark .mt-2 [class*="select__control"] {
              background-color: #1e293b;
              border-color: #475569;
            }
            
            .dark .mt-2 [class*="select__menu"] {
              background-color: #1e293b;
            }
            
            .dark .mt-2 [class*="select__option"] {
              background-color: #1e293b;
              color: #f1f5f9;
            }
            
            .dark .mt-2 [class*="select__option--is-focused"] {
              background-color: #334155;
            }
            
            .dark .mt-2 [class*="select__single-value"] {
              color: #f1f5f9;
            }
            
            .dark .mt-2 [class*="select__placeholder"] {
              color: #94a3b8;
            }
            
            .dark .mt-2 [class*="select__indicator"] {
              color: #94a3b8;
            }
            
            .question-select .select__control {
              border-radius: 0.5rem;
              min-height: 2.75rem;
              transition: all 0.2s;
            }
            
            .question-select .select__control--is-focused {
              border-color: #3b82f6;
              box-shadow: 0 0 0 1px #3b82f6;
            }
            
            .question-select .select__option {
              border-radius: 0.25rem;
              padding: 0.5rem 0.75rem;
              cursor: pointer;
              font-size: 0.875rem;
            }
            
            .question-select .select__menu {
              z-index: 50;
            }
          `}</style>
        </main>

        <Footer />
      </div>
    </>
  );
}