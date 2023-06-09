"use client"

import Link from "next/link"
import { cn } from "@/utils/cn"

type TagItemProps = {
  checked: boolean
  tag?: string
  targetId?: string
}

export const TagItem = ({ checked, tag }: TagItemProps) => {
  return (
    <Link
      id={checked ? "active" : `${tag}`}
      aria-label={`${tag} Tag`}
      className={cn(
        "relative flex cursor-pointer items-center space-x-2 rounded border px-4 py-2 text-center text-sm shadow-sm transition focus:outline-none focus-visible:border-[#808080] focus-visible:ring focus-visible:ring-[#808080]",
        {
          "bg-[#F5F5F5] text-[#333333] border-[#CCCCCC] dark:bg-[#343434] dark:text-[#ededed] dark:border-[#505050]":
            checked,
          "bg-white border-gray-300 hover:border-gray-400 text-gray-800 hover:text-[#707070] dark:bg-[#1c1c1c] dark:border-[#3e3e3e] dark:hover:border-[#707070] dark:text-[#979797] dark:hover:text-[#ededed]":
            !checked,
        }
      )}
      href={tag === "all" ? "/blog/page/1" : `/blog/tag/${tag}`}
    >
      <span>{tag}</span>
    </Link>
  )
}
