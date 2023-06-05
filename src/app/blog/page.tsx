import { Metadata } from "next";
import { GridContainer } from "@/components/grid-container";
import { PostService } from "@/service/posts.service";
import type { Post } from "@/types/post";
import { sort } from "@/utils/sort";

export const metadata: Metadata = {
  title: "Rldnrl Blog",
  description: "Rldnrl Blog Description",
};

export default async function BlogList() {
  const posts = await PostService.fetchPosts();
  const sortedPosts = sort(posts, (post: Post) => post.date.getTime(), true);

  return (
    <div className="safe-paddings pt-6 md:pt-12">
      <GridContainer className="relative mx-auto px-4 md:max-w-none md:px-8 lg:max-w-[860px]">
        {/* <Tags currentTag={currentTag.value} onClick$={handleClick} /> */}
        <ol className="safe-paddings col-span-full dark:text-slate-200 md:col-start-2 md:col-end-12 md:relative md:border-l md:border-gray-200 md:dark:border-gray-700">
          {sortedPosts.map((post: Post) => {
            if (post.draft && process.env.NODE_ENV !== "development")
              return null;

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
      </GridContainer>
    </div>
  );
}
