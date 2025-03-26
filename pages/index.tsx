import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { IconBrandTwitter, IconMessageCircle, IconSearch, IconChevronRight } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

// Define creator data
const creators = [
  {
    id: "shreyas",
    name: "Shreyas Doshi",
    title: "Product Leader",
    placeholderQuestion: "What is product management?",
    bio: "Led & scaled products at Stripe, Twitter, Google, and Yahoo. Expert in product management.",
    threadCount: 113,
    image: "/images/shreyas.jpeg"
  },
  {
    id: "joulee",
    name: "Julie Zhuo",
    title: "Design & Leadership",
    placeholderQuestion: "How to share feedback with my manager?",
    bio: "Founder at Sundial, former VP design at Meta and author of 'The Making of a Manager'.",
    threadCount: 92,
    image: "/images/joulee.jpeg"
  },
  {
    id: "gregisenberg",
    name: "Greg Isenberg",
    title: "Community Building",
    placeholderQuestion: "How to build an online community?",
    bio: "Expert on building internet communities and products that serve them effectively.",
    threadCount: 109,
    image: "/images/gregisenberg.jpeg"
  },
  {
    id: "soorajchandran_",
    name: "Sooraj Chandran",
    title: "Tech Career",
    placeholderQuestion: "How do I move to Europe with a tech job?",
    bio: "Your guide to pursuing a tech career in Europe with practical insights.",
    threadCount: 61,
    image: "/images/soorajchandran_.jpeg"
  },
  {
    id: "AliAbdaal",
    name: "Ali Abdaal",
    title: "Creator & Productivity",
    placeholderQuestion: "How can you find your niche as a creator on YouTube?",
    bio: "Doctor turned YouTuber specializing in productivity and creator economy.",
    threadCount: 114,
    image: "/images/AliAbdaal.jpeg"
  },
  {
    id: "wes_kao",
    name: "Wes Kao",
    title: "Marketing & Courses",
    placeholderQuestion: "What are some effective ways to market a course without being salesy?",
    bio: "Co-founder of Maven, expert in marketing and online course creation.",
    threadCount: 82,
    image: "/images/wes_kao.jpeg"
  }
];

export default function Home(): JSX.Element {
  const [mounted, setMounted] = useState(false);
  const [hoveredCreator, setHoveredCreator] = useState<string | null>(null);

  // After mounting, we can safely show the UI that depends on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Weave Threads GPT</title>
        <link rel="icon" href="/weave.ico" />
        <meta name="description" content="GPT-powered search and chat for Twitter threads from your favorite tweeters" />
        <meta property="og:title" content="Weave Threads GPT" />
        <meta property="og:description" content="GPT-powered search and chat for Twitter threads from your favorite tweeters" />
        <meta property="og:image" content="/og-image.png" />
      </Head>

      <Navbar rightLink={{ href: "https://twitter.com/terrelewis2", label: "Follow @terrelewis2" }} />

      <main className="flex-grow">
        {/* Hero section */}
        <section className="relative bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
                <span className="block">Weave</span>
                <span className="gradient-text">Threads GPT</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-600 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Gain knowledge and insights from Twitter threads of your 
                <span className="font-semibold"> favorite thought leaders</span>. Search, chat, and learn from curated content.
              </p>
              <div className="mt-8 sm:mt-12 flex justify-center space-x-4">
                <a href="#browse" className="btn btn-primary px-6 py-3 flex items-center space-x-2">
                  <IconBrandTwitter size={20} />
                  <span>Browse Creators</span>
                </a>
                <a href="https://github.com/terrelewis2/weave-threads-gpt" target="_blank" rel="noopener noreferrer" className="btn btn-outline px-6 py-3">
                  View on GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Abstract background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 dark:bg-primary-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-float"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-200 dark:bg-secondary-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-12 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Powered by AI, Curated by Humans
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Access the wisdom of top thinkers through our AI-powered interface.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="card-modern p-6">
                <div className="h-12 w-12 rounded-md bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-200 flex items-center justify-center mb-4">
                  <IconSearch size={24} />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  Smart Search
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Find relevant Twitter threads using semantic search powered by OpenAI embeddings.
                </p>
              </div>

              <div className="card-modern p-6">
                <div className="h-12 w-12 rounded-md bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-200 flex items-center justify-center mb-4">
                  <IconMessageCircle size={24} />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  Chat Interface
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Ask questions and get answers from the collective wisdom of curated threads.
                </p>
              </div>

              <div className="card-modern p-6">
                <div className="h-12 w-12 rounded-md bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-200 flex items-center justify-center mb-4">
                  <IconBrandTwitter size={24} />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  Curated Content
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Access insights from top thought leaders in product, design, community building, and more.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Browse creators section */}
        <section id="browse" className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Browse Creators
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Select a creator to explore their threads and interact with their knowledge.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mounted && creators.map((creator) => (
                <Link
                  key={creator.id}
                  href={{
                    pathname: `/tweeter/${creator.id}`,
                    query: {
                      id: creator.id,
                      placeholderQuestion: creator.placeholderQuestion
                    }
                  }}
                  className="card-modern group transition-all duration-300 hover:translate-y-[-4px] overflow-hidden"
                  onMouseEnter={() => setHoveredCreator(creator.id)}
                  onMouseLeave={() => setHoveredCreator(null)}
                >
                  <div className={`h-32 bg-gradient-to-r ${
                    hoveredCreator === creator.id 
                      ? 'from-primary-600 to-secondary-600' 
                      : 'from-primary-500 to-secondary-500'
                  } transition-colors duration-300`}></div>
                  <div className="px-6 pt-0 pb-6 relative">
                    <div className="relative -mt-16 mb-4">
                      <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden mx-auto shadow-lg">
                        <Image 
                          src={creator.image} 
                          alt={creator.name} 
                          width={96} 
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {creator.name}
                      </h3>
                      <p className="text-sm text-primary-600 dark:text-primary-400 mb-3">
                        {creator.title}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {creator.bio}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 py-1 px-3 rounded-full">
                          {creator.threadCount} Threads
                        </span>
                        <span className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:underline">
                          Explore
                          <IconChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform"/>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
