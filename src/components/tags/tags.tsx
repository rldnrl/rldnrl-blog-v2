"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { TagItem } from "./tag-item";

type TagsProps = {
  tags: string[];
  currentTag: string;
};

export const Tags = ({ tags, currentTag }: TagsProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (tag: string) => {
    // @ts-ignore
    const current = new URLSearchParams(searchParams);

    if (tag === "all") {
      current.delete("tag");
    } else {
      current.set("tag", tag);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  return (
    <div className="col-span-12 md:col-start-2 md:col-end-12 mb-8">
      <div className="w-full justify-between space-y-4">
        <div className="flex space-x-1 overflow-auto whitespace-nowrap scrollbar-hide mask-fadeout-right">
          {tags.map((tag) => (
            <TagItem
              key={tag}
              checked={currentTag === tag}
              onClick={() => {
                handleClick(tag);
              }}>
              {tag}
            </TagItem>
          ))}
        </div>
      </div>
    </div>
  );
};
