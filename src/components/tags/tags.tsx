"use client"

import { useRef } from "react"

import useScrollCenter from "@/hooks/use-scroll-center"

import { TagItem } from "./tag-item"

type TagsProps = {
  tags: string[]
  currentTag: string
}

export const Tags = ({ tags, currentTag }: TagsProps) => {
  const tagsRef = useRef<HTMLUListElement>(null)

  useScrollCenter({ ref: tagsRef, targetId: "active" })

  return (
    <div className="col-span-12 mb-8 md:col-start-2 md:col-end-12">
      <div className="w-full justify-between space-y-4">
        <ul
          className="mask-fadeout-right flex space-x-1 overflow-auto whitespace-nowrap scrollbar-hide"
          ref={tagsRef}
        >
          {tags.map((tag) => (
            <TagItem
              key={tag}
              checked={decodeURI(currentTag) === tag}
              tag={tag}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
