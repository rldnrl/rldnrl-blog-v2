import { Metadata } from "next"
import { siteMetadata } from "@/constant/site-metadata"
import { PostService } from "@/service/posts.service"

import { ArticlesView } from "@/components/blog/articles-view"
import { GridContainer } from "@/components/grid-container"

export const metadata: Metadata = {
  title: "Rldnrl Blog",
  description: "Rldnrl Blog Description",
}

export async function generateStaticParams() {
  const allPosts = await PostService.fetchPosts()

  return [
    ...Array(Math.ceil(allPosts.length / siteMetadata.perPage)).keys(),
  ].map((i) => ({
    page: `${i + 1}`,
  }))
}

type BlogListByPageProps = {
  params: {
    page: string
  }
}

export default async function BlogListByPage({ params }: BlogListByPageProps) {
  const tags = await PostService.getTags()
  const posts = await PostService.fetchPosts()

  return (
    <div className="safe-paddings pt-6 md:pt-12">
      <GridContainer className="relative mx-auto px-4 md:max-w-none md:px-8 lg:max-w-4xl">
        <ArticlesView posts={posts} tags={tags} page={params.page} />
      </GridContainer>
    </div>
  )
}
