"use client";

import { useEffect, useRef, useState } from "react";
import { Menu as MenuIcon } from "@/icons/menu";
import { cn } from "@/utils/cn";
import { routes } from "@/constant/routes";
import Link from "next/link";
import { buttonVariants } from "../button";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const menuIconRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuIconRef.current?.contains(event.target as HTMLElement)) {
        return;
      }
      if (
        !menuContainerRef.current ||
        menuContainerRef.current.contains(event.target as HTMLElement)
      ) {
        return;
      }

      setIsMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <>
      <button
        ref={menuIconRef}
        aria-label="Menu Toggle"
        id="menu-icon"
        className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 400 dark:text-white dark:focus:ring-gray-700 dark:hover:bg-gray-700 md:hidden"
        onClick={toggleMenu}>
        <span className="sr-only">Open main menu</span>
        <MenuIcon className="w-6 h-6" />
      </button>
      <div
        ref={menuContainerRef}
        className={cn(
          "absolute left-0 top-16 z-nav w-full px-4 md:relative md:z-0 md:flex md:items-center md:left-0 md:top-0 md:w-auto",
          {
            hidden: !isMenuOpen,
          }
        )}>
        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-4 md:mt-0 md:border-0 md:bg-white dark:bg-gray-900 dark:border-gray-700">
          {routes?.map((route) => (
            <li key={route.pathname}>
              <Link
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
                href={route.path}
                onClick={() => setIsMenuOpen(false)}>
                {route.pathname}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
