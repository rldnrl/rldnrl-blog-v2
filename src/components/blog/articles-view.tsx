"use client";

import { Post } from "@/types/post";
import { Tags } from "../tags";
import { useSearchParams } from "next/navigation";
import { sort } from "@/utils/sort";
import { Pagination } from "../pagination";
import { Articles } from "./articles";
import { EnvService } from "@/service/env.service";

const POSTS_PER_PAGE = 3;

type ArticlesViewProps = {
  tags: string[];
  posts: Post[];
};

export const ArticlesView = ({ tags, posts }: ArticlesViewProps) => {
  const searchParams = useSearchParams();

  const currentTag = searchParams.get("tag") ?? ("all" as string);
  const currentPage = parseInt(searchParams.get("page") ?? "1");
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const sortedAllPosts = sort(posts, (post: Post) => post.date.getTime(), true);

  const filteredPostsByTag =
    currentTag === "all"
      ? [...sortedAllPosts]
          .filter((post) => !(post.draft && EnvService.isProduction()))
          .slice(
            POSTS_PER_PAGE * (currentPage - 1),
            POSTS_PER_PAGE * currentPage
          )
      : sortedAllPosts
          .filter((post) => post.tags?.includes(currentTag as string))
          .slice(
            POSTS_PER_PAGE * (currentPage - 1),
            POSTS_PER_PAGE * currentPage
          );

  return (
    <>
      <Tags tags={tags} currentTag={currentTag as string} />
      <Articles posts={filteredPostsByTag} />
      {currentTag === "all" && totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </>
  );
};
