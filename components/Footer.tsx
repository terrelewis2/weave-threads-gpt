import { IconBrandGithub, IconBrandTwitter, IconHeart } from "@tabler/icons-react";
import { FC } from "react";
import Link from "next/link";
import Image from "next/image";

export const Footer: FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center">
              <Image 
                src="/weave.ico" 
                alt="Logo" 
                width={32} 
                height={32} 
                className="mr-2"
              />
              <h2 className="text-xl font-bold">
                Weave <span className="gradient-text">Threads</span> GPT
              </h2>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              GPT-powered search and chat for Twitter threads from your favorite thought leaders.
            </p>
          </div>
          
          {/* Links */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Resources
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="https://github.com/terrelewis2/weave-threads-gpt" className="text-base text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a href="https://platform.openai.com/" className="text-base text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                    OpenAI API
                  </a>
                </li>
                <li>
                  <a href="https://supabase.com/" className="text-base text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                    Supabase
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Connect
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="https://twitter.com/terrelewis2" className="text-base text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 flex items-center">
                    <IconBrandTwitter size={20} className="mr-2" />
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="https://github.com/terrelewis2" className="text-base text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 flex items-center">
                    <IconBrandGithub size={20} className="mr-2" />
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col items-center">
          <p className="text-base text-gray-500 dark:text-gray-400 text-center">
            Inspired by <a href="https://github.com/mckaywrigley/paul-graham-gpt" className="hover:text-primary-600 dark:hover:text-primary-400 font-medium">PaulGrahamGPT</a> by <a href="https://twitter.com/mckaywrigley" className="hover:text-primary-600 dark:hover:text-primary-400 font-medium">Mckay Wrigley</a>
          </p>
          <p className="mt-4 text-base text-gray-500 dark:text-gray-400 flex items-center">
            Made with <IconHeart size={16} className="mx-1 text-red-500" /> by <a href="https://twitter.com/terrelewis2" className="ml-1 hover:text-primary-600 dark:hover:text-primary-400 font-medium">Terrel Lewis</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
