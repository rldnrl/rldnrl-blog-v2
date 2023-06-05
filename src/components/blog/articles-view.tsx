"use client";

import { Post } from "@/types/post";
import { Tags } from "../tags";
import { useSearchParams } from "next/navigation";
import { sort } from "@/utils/sort";

type ArticlesViewProps = {
  tags: string[];
  posts: Post[];
};

export const ArticlesView = ({ tags, posts }: ArticlesViewProps) => {
  const searchParams = useSearchParams();

  const currentTag = searchParams.get("tag") ?? ("all" as string);
  const sortedAllPosts = sort(posts, (post: Post) => post.date.getTime(), true);
  const filteredPostsByTag =
    currentTag === "all"
      ? [...sortedAllPosts]
      : sortedAllPosts.filter((post) =>
          post.tags?.includes(currentTag as string)
        );

  return (
    <>
      <Tags tags={tags} currentTag={currentTag as string} />
      <ol className="safe-paddings col-span-full dark:text-slate-200 md:col-start-2 md:col-end-12 md:relative md:border-l md:border-gray-200 md:dark:border-gray-700">
        {filteredPostsByTag.map((post: Post) => {
          if (post.draft && process.env.NODE_ENV !== "development") return null;

          return (
            <li key={post.id} className="md:pl-8">
              <div className="hidden absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700 md:block" />
              <time className="text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                {post.date.toLocaleDateString("ko-kr", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </time>
              <article className="mt-2">
                <a
                  className="ease-in duration-200 hover:text-green-400"
                  href={`/blog/${post.slug}`}>
                  <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
                    {post.title}
                  </h1>
                </a>
                <p className="mt-4 !leading-normal lg:mt-5">{post.summary}</p>
                <a
                  className="inline-flex !leading-none items-center relative transition-colors duration-500 before:absolute before:-bottom-1.5 before:left-0 before:h-1.5 before:w-full before:transition-all before:duration-500 hover:before:bottom-full hover:before:opacity-0 before:pointer-events-none before:bg-green-300 hover:text-green-400 dark:before:bg-green-400 dark:text-white dark:hover:text-green-400 mt-4 font-semibold lg:mt-5"
                  href={`/blog/${post.slug}`}>
                  Read more
                </a>
              </article>
              <div className="safe-paddings col-span-full md:col-start-2 md:col-end-12 my-16 bg-gray-200 border-0 dark:bg-gray-700" />
            </li>
          );
        })}
      </ol>
    </>
  );
};