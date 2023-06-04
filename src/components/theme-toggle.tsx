"use client";

import { Moon as MoonIcon } from "@/icons/moon";
import { Light as LightIcon } from "@/icons/light";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  console.log({ theme });

  useEffect(() => setMounted(true), []);

  return (
    <button
      className="text-gray-500 ml-2 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-gray-200  rounded-lg text-sm p-2 dark:text-white dark:focus:ring-gray-700 dark:hover:bg-gray-700"
      id="theme-toggle"
      type="button"
      onClick={() =>
        setTheme(
          theme === "dark" || resolvedTheme === "dark" ? "light" : "dark"
        )
      }>
      {mounted && (theme === "dark" || resolvedTheme === "dark") ? (
        <LightIcon className="w-6 h-6 " />
      ) : (
        <MoonIcon className="w-6 h-6" />
      )}
    </button>
  );
};
