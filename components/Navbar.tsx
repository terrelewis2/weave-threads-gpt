import { IconBrandTwitter, IconSun, IconMoon, IconMenu2, IconX } from "@tabler/icons-react";
import { FC, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface NavbarProps {
  rightLink: {
    href: string;
    label: string;
  };
}

export const Navbar: FC<NavbarProps> = ({ rightLink }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize dark mode from system preference or localStorage
  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image 
                src="/weave.ico" 
                alt="Logo" 
                width={32} 
                height={32} 
                className="mr-2"
              />
              <h1 className="text-xl font-bold">
                Weave <span className="gradient-text">Threads</span> GPT
              </h1>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <a
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition duration-150"
              href={rightLink.href}
              target="_blank"
              rel="noreferrer"
            >
              <span className="mr-1">{rightLink.label}</span>
              <IconBrandTwitter size={20} className="text-[#1DA1F2]"/>
            </a>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <IconSun size={20} /> : <IconMoon size={20} />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md inline-flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <IconX size={24} aria-hidden="true" />
              ) : (
                <IconMenu2 size={24} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href={rightLink.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium"
          >
            <span className="mr-1">{rightLink.label}</span>
            <IconBrandTwitter size={20} className="text-[#1DA1F2]" />
          </a>
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-base font-medium"
          >
            {darkMode ? (
              <>
                <IconSun size={20} className="mr-2" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <IconMoon size={20} className="mr-2" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};