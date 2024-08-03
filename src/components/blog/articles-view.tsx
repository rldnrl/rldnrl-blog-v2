"use client"

import { notFound } from "next/navigation"
import { siteMetadata } from "@/constant/site-metadata"
import { EnvService } from "@/service/env.service"
import { sort } from "@/libs/sort"

import { Post } from "@/types/post"

import { Articles } from "./articles"

type ArticlesViewProps = {
  tags: string[]
  posts: Post[]
  page?: string
  tag?: string
}

export const ArticlesView = ({
  tags,
  posts,
  page = "1",
  tag = "all",
}: ArticlesViewProps) => {
  const currentTag = tag
  const currentPage = parseInt(page)
  const sortedAllPosts = sort(
    posts,
    (post: Post) => post.date.getTime(),
    true
  ).filter((post) => !(post.draft && EnvService.isProduction()))
  const totalPages = Math.ceil(sortedAllPosts.length / siteMetadata.perPage)

  if (!tags.includes(decodeURI(currentTag))) {
    return notFound()
  }

  if (
    Number.isNaN(Number(page)) ||
    currentPage < 1 ||
    currentPage > totalPages
  ) {
    return notFound()
  }

  const filteredPostsByTag =
    currentTag === "all"
      ? sortedAllPosts.slice(
          siteMetadata.perPage * (currentPage - 1),
          siteMetadata.perPage * currentPage
        )
      : sortedAllPosts.filter((post) =>
          post.tags?.includes(decodeURI(currentTag))
        )

  return <Articles posts={filteredPostsByTag} />
}
