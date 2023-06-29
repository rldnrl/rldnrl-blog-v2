"use client"

import Link from "next/link"

import { Post } from "@/types/post"

type ArticlesProps = {
  posts: Post[]
}

export const Articles = ({ posts }: ArticlesProps) => {
  return (
    <ul className="safe-paddings col-span-full dark:text-slate-200 md:relative md:col-start-2 md:col-end-12 md:border-l md:border-gray-200 md:dark:border-gray-700">
      {posts.map((post: Post) => {
        const formattedDate = post.date.toLocaleDateString("ko-kr", {
          year: "numeric",
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        })

        return (
          <li key={post.id} className="md:pl-8">
            <div className="absolute -left-1.5 mt-1.5 hidden h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700 md:block" />
            <time className="text-sm font-normal leading-none text-gray-400 dark:text-gray-400">
              {formattedDate}
            </time>
            <article className="mt-2">
              <Link
                className="duration-200 ease-in hover:text-green-400"
                href={`/blog/${post.slug}`}
              >
                <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
                  {post.title}
                </h1>
              </Link>
              <p className="mt-4 lg:mt-5">{post.summary}</p>
              <Link
                className="relative mt-4 inline-flex items-center font-semibold transition-colors duration-500 before:pointer-events-none before:absolute before:-bottom-1.5 before:left-0 before:h-1.5 before:w-full before:bg-green-500 before:transition-all before:duration-500 hover:text-green-600 hover:before:bottom-full hover:before:opacity-0 dark:text-white dark:before:bg-green-400 dark:hover:text-green-400 lg:mt-5"
                href={`/blog/${post.slug}`}
              >
                <span className="sr-only">{post.title}</span>
                <span>Read more</span>
              </Link>
            </article>
            <div className="safe-paddings col-span-full my-16 border-0 bg-gray-200 dark:bg-gray-700 md:col-start-2 md:col-end-12" />
          </li>
        )
      })}
    </ul>
  )
}
