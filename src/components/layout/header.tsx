import Link from "next/link"

import { ThemeToggle } from "../theme-toggle"
import { Navbar } from "./navbar"

type HeaderProps = {
  blogTitle: string
}

export const Header = ({ blogTitle }: HeaderProps) => {
  return (
    <header className="dark:border-gray-700 dark:bg-gray-900 dark:text-white">
      <nav>
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:max-w-4xl ">
          <div className="flex flex-1 items-center justify-between">
            <Link className="text-2xl font-semibold" href="/">
              {blogTitle}
            </Link>
            <div className="flex items-center">
              <Navbar />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
