import { Mail as MailIcon } from "@/icons/mail";
import { Github } from "@/icons/github";
import { SITE_MAP } from "@/constant/site-map";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="dark:border-gray-700 dark:bg-gray-900 dark:text-white">
      <div className="flex flex-col items-center mt-16">
        <div className="flex mb-3 space-x-4 items-center">
          <a
            className="text-sm text-gray-500 transition hover:text-gray-600"
            target="_blank"
            rel="noopener noreferrer">
            <span className="sr-only">mail</span>
            <MailIcon className="fill-current text-gray-700 dark:text-gray-200 hover:text-green-500 dark:hover:text-green-400 h-6 w-6" />
          </a>
          <a
            className="text-sm text-gray-500 transition hover:text-gray-600"
            target="_blank"
            href={SITE_MAP.github}>
            <span className="sr-only">Github</span>
            <Github className="fill-current text-gray-700 dark:text-gray-200 hover:text-green-500 dark:hover:text-green-400 h-6 w-6" />
          </a>
        </div>
        <div className="flex mb-2 space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>Kiwook</div>
          <div> • </div>
          <div>© 2023</div>
          <div> • </div>
          <Link href="/">rldnrl</Link>
        </div>
        <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          <a target="_blank" rel="noopener noreferrer">
            Next13 Blog Theme
          </a>
        </div>
      </div>
    </footer>
  );
};
