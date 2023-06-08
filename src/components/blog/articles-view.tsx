"use client";

import { Post } from "@/types/post";
import { Tags } from "../tags";
import { notFound } from "next/navigation";
import { sort } from "@/utils/sort";
import { Pagination } from "../pagination";
import { Articles } from "./articles";
import { EnvService } from "@/service/env.service";
import { siteMetadata } from "@/constant/site-metadata";

type ArticlesViewProps = {
  tags: string[];
  posts: Post[];
  page?: string;
  tag?: string;
};

export const ArticlesView = ({
  tags,
  posts,
  page = "1",
  tag = "all",
}: ArticlesViewProps) => {
  const currentTag = tag;
  const currentPage = parseInt(page);
  const sortedAllPosts = sort(
    posts,
    (post: Post) => post.date.getTime(),
    true
  ).filter((post) => !(post.draft && EnvService.isProduction()));
  const totalPages = Math.ceil(sortedAllPosts.length / siteMetadata.perPage);

  if (!tags.includes(decodeURI(currentTag))) {
    return notFound();
  }

  if (
    Number.isNaN(Number(page)) ||
    currentPage < 1 ||
    currentPage > totalPages
  ) {
    return notFound();
  }

  const filteredPostsByTag =
    currentTag === "all"
      ? sortedAllPosts.slice(
          siteMetadata.perPage * (currentPage - 1),
          siteMetadata.perPage * currentPage
        )
      : sortedAllPosts.filter((post) =>
          post.tags?.includes(decodeURI(currentTag))
        );

  return (
    <>
      <Tags tags={tags} currentTag={currentTag} />
      <Articles posts={filteredPostsByTag} />
      {currentTag === "all" && totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </>
  );
};
