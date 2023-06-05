"use client";

import { Moon as MoonIcon } from "@/icons/moon";
import { Light as LightIcon } from "@/icons/light";
import { useTheme } from "next-themes";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const handleClick = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      className="text-gray-500 ml-2 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-gray-200  rounded-lg text-sm p-2 dark:text-white dark:focus:ring-gray-700 dark:hover:bg-gray-700"
      id="theme-toggle"
      type="button"
      aria-label={theme === "dark" ? "Theme Light Mode" : "Theme Dark Mode"}
      onClick={handleClick}>
      {theme === "dark" ? (
        <MoonIcon className="w-6 h-6" />
      ) : (
        <LightIcon className="w-6 h-6 " />
      )}
    </button>
  );
};
