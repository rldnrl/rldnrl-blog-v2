import { Metadata } from "next"
import { PostService } from "@/service/posts.service"

import { ArticlesView } from "@/components/blog/articles-view"
import { GridContainer } from "@/components/grid-container"

export const metadata: Metadata = {
  title: "Rldnrl Blog",
  description: "Rldnrl Blog Description",
}

export async function generateStaticParams() {
  const allTags = await PostService.getTags()

  return allTags.map((tag) => ({
    tag,
  }))
}

type BlogListByTagProps = {
  params: {
    tag: string
  }
}

export default async function BlogListByTag({ params }: BlogListByTagProps) {
  const tags = await PostService.getTags()
  const posts = await PostService.fetchPosts()

  return (
    <div className="safe-paddings pt-6 md:pt-12">
      <GridContainer className="relative mx-auto px-4 md:max-w-none md:px-8 lg:max-w-5xl">
        <ArticlesView posts={posts} tags={tags} tag={params.tag} />
      </GridContainer>
    </div>
  )
}
