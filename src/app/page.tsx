import Link from "next/link";
import { Articles } from "@/components/blog/articles";
import { GridContainer } from "@/components/grid-container";
import { siteMetadata } from "@/constant/site-metadata";
import { PostService } from "@/service/posts.service";

export default async function Home() {
  const posts = await PostService.findLatestPosts();

  return (
    <section className="safe-paddings pt-6 md:pt-12">
      <GridContainer className="relative mx-auto px-4 md:max-w-none md:px-8 lg:max-w-5xl">
        <div className="safe-paddings col-span-full md:col-start-2 md:col-end-12 pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-4xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-slate-200 sm:leading-10 md:text-6xl md:leading-14">
            Latest
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-slate-300">
            {siteMetadata.description}
          </p>
        </div>
        <hr className="safe-paddings col-span-full md:col-start-2 md:col-end-12 h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700" />
        <Articles posts={posts} />
        <div className="safe-paddings grid justify-end col-span-full mt-16 md:col-start-10 md:col-end-12">
          <Link
            className="text-green-500 hover:text-green-600 dark:text-green-300 dark:hover:text-primary-1 cursor-pointer"
            href="/blog/page/1">
            All Posts →
          </Link>
        </div>
      </GridContainer>
    </section>
  );
}
