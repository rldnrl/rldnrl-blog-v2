"use client";

import { useRouter } from "next/navigation";
import { TagItem } from "./tag-item";

type TagsProps = {
  tags: string[];
  currentTag: string;
};

export const Tags = ({ tags, currentTag }: TagsProps) => {
  const router = useRouter();

  const handleClick = (tag: string) => {
    if (tag === "all") {
      router.push("/blog/page/1");
    } else {
      router.push(`/blog/tag/${tag}`);
    }
  };

  return (
    <div className="col-span-12 md:col-start-2 md:col-end-12 mb-8">
      <div className="w-full justify-between space-y-4">
        <ul className="flex space-x-1 overflow-auto whitespace-nowrap scrollbar-hide mask-fadeout-right">
          {tags.map((tag) => (
            <TagItem
              key={tag}
              checked={decodeURI(currentTag) === tag}
              onClick={() => {
                handleClick(tag);
              }}>
              {tag}
            </TagItem>
          ))}
        </ul>
      </div>
    </div>
  );
};
