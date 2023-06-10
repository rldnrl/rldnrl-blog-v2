"use client";

import { TagItem } from "./tag-item";
import { useRef } from "react";
import useScrollCenter from "@/hooks/use-scroll-center";

type TagsProps = {
  tags: string[];
  currentTag: string;
};

export const Tags = ({ tags, currentTag }: TagsProps) => {
  const tagsRef = useRef<HTMLUListElement>(null);

  useScrollCenter({ ref: tagsRef, targetId: "active" });

  return (
    <div className="col-span-12 md:col-start-2 md:col-end-12 mb-8">
      <div className="w-full justify-between space-y-4">
        <ul
          className="flex space-x-1 overflow-auto whitespace-nowrap scrollbar-hide mask-fadeout-right"
          ref={tagsRef}>
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
  );
};
