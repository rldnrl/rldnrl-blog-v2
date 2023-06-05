"use client";

import { cn } from "@/utils/cn";
import { ReactNode } from "react";

type TagProps = {
  checked: boolean;
  onClick: () => void;
  children?: ReactNode;
};

export const TagItem = ({ checked, onClick, children }: TagProps) => {
  return (
    <button
      className={cn(
        "relative cursor-pointer flex items-center space-x-2 px-4 py-2 text-sm text-center transition shadow-sm rounded border focus:outline-none focus-visible:ring focus-visible:ring-[#808080] focus-visible:border-[#808080]",
        {
          "bg-[#F5F5F5] text-[#333333] border-[#CCCCCC] dark:bg-[#343434] dark:text-[#ededed] dark:border-[#505050]":
            checked,
          "bg-white border-gray-300 hover:border-gray-400 text-gray-800 hover:text-[#707070] dark:bg-[#1c1c1c] dark:border-[#3e3e3e] dark:hover:border-[#707070] dark:text-[#707070] dark:hover:text-[#ededed]":
            !checked,
        }
      )}
      onClick={onClick}>
      <span>{children}</span>
    </button>
  );
};
