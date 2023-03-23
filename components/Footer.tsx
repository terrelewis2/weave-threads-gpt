import { IconBrandGithub, IconBrandTwitter } from "@tabler/icons-react";
import { FC } from "react";
import styles from '../styles/Home.module.css';


export const Footer: FC = () => {
  return (
    <div className="flex h-[50px] font-bold border-t border-gray-300 py-2 px-8 items-center sm:justify-between justify-center">
      <div className="hidden sm:flex"></div>

      <div className="hidden sm:flex text-sm">
        Created by
        <a
          className="hover:opacity-50 mx-1"
          href="https://twitter.com/terrelewis2"
          target="_blank"
          rel="noreferrer"
        >
          <span className={styles.highlightBold}>Terrel Lewis.</span>
        </a>
        Inspired from 
        <a
          className="hover:opacity-50 ml-1"
          href="https://twitter.com/mckaywrigley"
          target="_blank"
          rel="noreferrer"
        >
          <span className={styles.highlightBold}>Mckay Wrigley&apos;s</span>
        </a>
        &nbsp;project,
        <a
          className="hover:opacity-50 ml-1"
          href="https://github.com/mckaywrigley/paul-graham-gpt"
          target="_blank"
          rel="noreferrer"
        >
          <span className={styles.highlightBold}>PaulGrahamGPT</span>
        </a>
      </div>

      <div className="flex space-x-4">
        <a
          className="flex items-center hover:opacity-50"
          href="https://twitter.com/terrelewis2"
          target="_blank"
          rel="noreferrer"
        >
          <IconBrandTwitter size={24} />
        </a>
        <a
          className="flex items-center hover:opacity-50"
          href="https://github.com/mckaywrigley/paul-graham-gpt"
          target="_blank"
          rel="noreferrer"
        >
          <IconBrandGithub size={24} />
        </a>
      </div>
    </div>
  );
};
