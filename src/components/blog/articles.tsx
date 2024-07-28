"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { isEmpty } from "radash"

import { Post } from "@/types/post"

import { Badge } from "../ui/badge"
import { Skeleton } from "../ui/skeleton"

type ArticlesProps = {
  posts: Post[]
}

export const Articles = ({ posts }: ArticlesProps) => {
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([])
  const [page, setPage] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const observer = useRef<IntersectionObserver>()

  const POSTS_PER_PAGE = 10

  const lastPostElementRef = useCallback(
    (node: HTMLLIElement) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [isLoading]
  )

  useEffect(() => {
    const loadMorePosts = () => {
      setIsLoading(true)
      const newPosts = posts.slice(
        (page - 1) * POSTS_PER_PAGE,
        page * POSTS_PER_PAGE
      )
      setVisiblePosts((prevPosts) => [...prevPosts, ...newPosts])
      setIsLoading(false)
    }

    loadMorePosts()
  }, [page, posts])

  return (
    <ul className="safe-paddings col-span-full dark:text-slate-200 md:relative md:col-start-2 md:col-end-12 md:border-l md:border-gray-200 md:dark:border-gray-700">
      {visiblePosts.map((post, index) => {
        const formattedDate = post.date.toLocaleDateString("ko-kr", {
          year: "numeric",
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        })

        return (
          <li
            key={post.id}
            className="md:pl-8"
            ref={index === visiblePosts.length - 1 ? lastPostElementRef : null}
          >
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
              {!isEmpty(post.tags) && (
                <ul className="mt-2 flex gap-2">
                  {post.tags?.map((tag, index) => (
                    <li key={`tag-${index}`}>
                      <Badge variant="secondary">{tag}</Badge>
                    </li>
                  ))}
                </ul>
              )}
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
