import Link from "next/link"
import { siteMetadata } from "@/constant/site-metadata"
import { Github } from "@/icons/github"
import { Mail as MailIcon } from "@/icons/mail"

export const Footer = () => {
  return (
    <footer className="dark:border-gray-700 dark:bg-gray-900 dark:text-white">
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex items-center space-x-4">
          <a
            className="text-sm text-gray-500 transition hover:text-gray-600"
            href={`mailto:${siteMetadata.email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sr-only">mail</span>
            <MailIcon className="h-6 w-6 fill-current text-gray-700 hover:text-green-500 dark:text-gray-200 dark:hover:text-green-400" />
          </a>
          <a
            className="text-sm text-gray-500 transition hover:text-gray-600"
            target="_blank"
            href={siteMetadata.github.url}
          >
            <span className="sr-only">Github</span>
            <Github className="h-6 w-6 fill-current text-gray-700 hover:text-green-500 dark:text-gray-200 dark:hover:text-green-400" />
          </a>
        </div>
        <div className="flex space-x-2 pb-10 text-sm text-gray-500 dark:text-gray-400">
          <div>{siteMetadata.author}</div>
          <div> • </div>
          <div>© 2023</div>
          <div> • </div>
          <Link href="/">rldnrl</Link>
        </div>
      </div>
    </footer>
  )
}
