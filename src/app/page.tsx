import { GridContainer } from "@/components/grid-container";
import { siteMetadata } from "@/constant/site-metadata";
import { PostService } from "@/service/posts.service";
import { Post } from "@/types/post";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welcome to Rldnrl Blog",
  description: siteMetadata.description,
};

export default async function Home() {
  const posts = await PostService.findLatestPosts();

  return (
    <section className="safe-paddings pt-6 md:pt-12">
      <GridContainer className="relative mx-auto px-4 md:max-w-none md:px-8 lg:max-w-4xl">
        <div className="safe-paddings col-span-full md:col-start-2 md:col-end-12 pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-4xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-slate-200 sm:leading-10 md:text-6xl md:leading-14">
            Latest
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-slate-300">
            {siteMetadata.description}
          </p>
        </div>
        <hr className="safe-paddings col-span-full md:col-start-2 md:col-end-12 h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700" />
        <ol className="safe-paddings col-span-full dark:text-slate-200 md:col-start-2 md:col-end-12 md:relative md:border-l md:border-gray-200 md:dark:border-gray-700">
          {posts.map((post: Post) => {
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
                  <Link
                    className="ease-in duration-200 hover:text-[#00E599]"
                    href={`/blog/${post.slug}`}>
                    <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
                      {post.title}
                    </h1>
                  </Link>
                  <p className="mt-4 !leading-normal lg:mt-5">{post.summary}</p>
                  <Link
                    className="inline-flex !leading-none items-center relative transition-colors duration-500 before:absolute before:-bottom-1.5 before:left-0 before:h-1.5 before:w-full before:transition-all before:duration-500 hover:before:bottom-full hover:before:opacity-0 before:pointer-events-none before:bg-[#31C48D] hover:text-[#31C48D] dark:before:bg-[#00E599] dark:text-white dark:hover:text-[#00E599] mt-4 font-semibold lg:mt-5"
                    href={`/blog/${post.slug}`}>
                    Read more
                  </Link>
                </article>
                <div className="safe-paddings col-span-full md:col-start-2 md:col-end-12 my-16 bg-gray-200 border-0 dark:bg-gray-700" />
              </li>
            );
          })}
        </ol>
        <div className="safe-paddings grid justify-end col-span-full mt-16 md:col-start-10 md:col-end-12">
          <Link
            className="text-green-300 hover:text-[#00E599] cursor-pointer"
            href="/blog">
            All Posts →
          </Link>
        </div>
      </GridContainer>
    </section>
  );
}
