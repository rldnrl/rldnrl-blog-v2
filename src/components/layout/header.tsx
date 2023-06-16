import { ThemeToggle } from "../theme-toggle";
import { Navbar } from "./navbar";
import Link from "next/link";

type HeaderProps = {
  blogTitle: string;
};

export const Header = ({ blogTitle }: HeaderProps) => {
  return (
    <header className="dark:border-gray-700 dark:bg-gray-900 dark:text-white">
      <nav>
        <div className="px-4 flex justify-between items-center h-16 container mx-auto sm:max-w-4xl ">
          <div className="flex items-center flex-1 justify-between">
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
  );
};
