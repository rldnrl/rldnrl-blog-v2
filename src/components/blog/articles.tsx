"use client";

import Link from "next/link";
import { Post } from "@/types/post";

type ArticlesProps = {
  posts: Post[];
};

export const Articles = ({ posts }: ArticlesProps) => {
  return (
    <ul className="safe-paddings col-span-full dark:text-slate-200 md:col-start-2 md:col-end-12 md:relative md:border-l md:border-gray-200 md:dark:border-gray-700">
      {posts.map((post: Post) => {
        const formattedDate = post.date.toLocaleDateString("ko-kr", {
          year: "numeric",
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        });

        return (
          <li key={post.id} className="md:pl-8">
            <div className="hidden absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700 md:block" />
            <time className="text-sm font-normal leading-none text-gray-400 dark:text-gray-400">
              {formattedDate}
            </time>
            <article className="mt-2">
              <Link
                className="ease-in duration-200 hover:text-green-400"
                href={`/blog/${post.slug}`}>
                <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
                  {post.title}
                </h1>
              </Link>
              <p className="mt-4 lg:mt-5">{post.summary}</p>
              <Link
                className="inline-flex items-center relative transition-colors duration-500 before:absolute before:-bottom-1.5 before:left-0 before:h-1.5 before:w-full before:transition-all before:duration-500 hover:before:bottom-full hover:before:opacity-0 before:pointer-events-none before:bg-green-500 hover:text-green-600 dark:before:bg-green-400 dark:text-white dark:hover:text-green-400 mt-4 font-semibold lg:mt-5"
                href={`/blog/${post.slug}`}>
                <span className="sr-only">{post.title}</span>
                <span>Read more</span>
              </Link>
            </article>
            <div className="safe-paddings col-span-full md:col-start-2 md:col-end-12 my-16 bg-gray-200 border-0 dark:bg-gray-700" />
          </li>
        );
      })}
    </ul>
  );
};
