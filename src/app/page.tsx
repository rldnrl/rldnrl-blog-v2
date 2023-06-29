import Link from "next/link"
import { siteMetadata } from "@/constant/site-metadata"
import { PostService } from "@/service/posts.service"

import { Articles } from "@/components/blog/articles"
import { GridContainer } from "@/components/grid-container"

export default async function Home() {
  const posts = await PostService.findLatestPosts()

  return (
    <section className="safe-paddings pt-6 md:pt-12">
      <GridContainer className="relative mx-auto px-4 md:max-w-none md:px-8 lg:max-w-5xl">
        <div className="safe-paddings col-span-full space-y-2 pb-8 pt-6 md:col-start-2 md:col-end-12 md:space-y-5">
          <h1 className="md:leading-14 text-4xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-slate-200 sm:leading-10 md:text-6xl">
            Latest
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-slate-300">
            {siteMetadata.description}
          </p>
        </div>
        <hr className="safe-paddings col-span-full mb-8 h-px border-0 bg-gray-200 dark:bg-gray-700 md:col-start-2 md:col-end-12" />
        <Articles posts={posts} />
        <div className="safe-paddings col-span-full mt-16 grid justify-end md:col-start-10 md:col-end-12">
          <Link
            className="cursor-pointer text-green-500 hover:text-green-600 dark:text-green-300 dark:hover:text-primary-1"
            href="/blog/page/1"
          >
            All Posts →
          </Link>
        </div>
      </GridContainer>
    </section>
  )
}
