import { MetadataRoute } from "next"
import { siteMetadata } from "@/constant/site-metadata"
import { EnvService } from "@/service/env.service"
import { PostService } from "@/service/posts.service"

import { Post } from "@/types/post"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await PostService.fetchPosts()
  const filteredPosts = posts.filter(
    (post) => !(post.draft && EnvService.isProduction())
  )
  const tags = await PostService.getTags()
  const totalPages = [...Array(Math.ceil(filteredPosts.length / 3)).keys()].map(
    (i) => i + 1
  )

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
    ...totalPages.map((page) => ({
      url: `${siteMetadata.siteUrl}/blog/page/${page}`,
      lastModified: new Date(),
    })),
  ]
}
