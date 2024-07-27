import { MetadataRoute } from "next"
import { siteMetadata } from "@/constant/site-metadata"
import { EnvService } from "@/service/env.service"
import { PostService } from "@/service/posts.service"

import { Post } from "@/types/post"

const postService = new PostService()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await postService.fetchPosts()
  const filteredPosts = posts.filter(
    (post) => !(post.draft && EnvService.isProduction())
  )
  const tags = await postService.getTags()

  return [
    {
      url: siteMetadata.siteUrl,
      lastModified: new Date(),
    },
    { url: `${siteMetadata.siteUrl}/about`, lastModified: new Date() },
    ...filteredPosts.map((post: Post) => ({
      url: `${siteMetadata.siteUrl}/blog/${post.slug}`,
      lastModified: post.date,
    })),
    ...tags.map((tag: string) => ({
      url: `${siteMetadata.siteUrl}/blog/tag/${tag}`,
      lastModified: new Date(),
    })),
  ]
}
