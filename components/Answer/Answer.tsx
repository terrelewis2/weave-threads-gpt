import React, { useEffect, useState } from "react";
import { IconRobot, IconUser, IconCopy, IconCheck } from "@tabler/icons-react";

interface AnswerProps {
  text: string;
}

export const Answer: React.FC<AnswerProps> = ({ text }) => {
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setWords(text.split(" "));
  }, [text]);

  useEffect(() => {
    if (currentIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + (prev ? " " : "") + words[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, 40); // Adjust typing speed here

      return () => clearTimeout(timer);
    }
  }, [currentIndex, words]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-start mb-4">
        <div className="flex-shrink-0 mr-4">
          <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <IconRobot size={16} className="text-primary-600 dark:text-primary-300" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            AI Assistant
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Based on Twitter threads
          </p>
        </div>
        <button 
          onClick={handleCopy}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
          aria-label="Copy answer"
          title="Copy answer"
        >
          {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
        </button>
      </div>
      
      <div className="pl-12 text-gray-800 dark:text-gray-200 leading-relaxed">
        {displayedText || <span className="animate-pulse">█</span>}
      </div>
      
      {currentIndex >= words.length && (
        <div className="mt-4 pl-12 pt-3 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            The response is generated based on the content of the Twitter threads and may not represent the exact words of the original authors.
          </p>
        </div>
      )}
    </div>
  );
};
