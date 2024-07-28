"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { Post } from "@/types/post"

import { ArticleItem } from "./article-item"

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
      {visiblePosts.map((post, index) => (
        <ArticleItem key={`article-${index}`} post={post} />
      ))}
    </ul>
  )
}
