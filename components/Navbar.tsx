import { IconExternalLink } from "@tabler/icons-react";
import { FC } from "react";
import styles from '../styles/Home.module.css';
import Link from "next/link";


interface NavbarProps {
  rightLink: {
    href: string;
    label: string;
  };
}

export const Navbar: FC<NavbarProps> = ({ rightLink }) => {
  return (
    <div className="flex h-[60px] border-b border-gray-300 py-2 px-8 items-center justify-between">
      <div className="font-bold text-2xl flex items-center">
        <Link className="hover:opacity-50" href="/">
          Weave <span className={styles.highlight}>Threads</span> GPT
        </Link>
      </div>
      <div>
        <a
          className="flex font-bold items-center hover:opacity-50"
          href={rightLink.href}
          target="_blank"
          rel="noreferrer"
        >
          <div className="hidden sm:flex">{rightLink.label}</div>

          <IconExternalLink className="ml-1" size={20} color="#1DA1F2"/>
        </a>
      </div>
    </div>
  );
};