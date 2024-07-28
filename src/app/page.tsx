import { siteMetadata } from "@/constant/site-metadata"
import { PostService } from "@/service/posts.service"

import { Articles } from "@/components/blog/articles"
import { GridContainer } from "@/components/grid-container"

const postService = new PostService()

export default async function Home() {
  const posts = await postService.fetchPosts()

  return (
    <section className="safe-paddings pt-6 md:pt-12">
      <GridContainer className="relative mx-auto px-4 md:max-w-none md:px-8 lg:max-w-5xl">
        <div className="safe-paddings col-span-full space-y-2 pb-8 pt-6 md:col-start-2 md:col-end-12 md:space-y-5">
          <p className="text-lg leading-7 text-gray-500 dark:text-slate-300">
            {siteMetadata.description}
          </p>
        </div>
        <hr className="safe-paddings col-span-full mb-8 h-px border-0 bg-gray-200 dark:bg-gray-700 md:col-start-2 md:col-end-12" />
        <Articles posts={posts} />
      </GridContainer>
    </section>
  )
}
