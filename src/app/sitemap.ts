import { MetadataRoute } from "next";
import { siteMetadata } from "@/constant/site-metadata";
import { PostService } from "@/service/posts.service";
import { Post } from "@/types/post";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await PostService.fetchPosts();

  return [
    {
      url: siteMetadata.siteUrl,
      lastModified: new Date(),
    },
    { url: `${siteMetadata.siteUrl}/about`, lastModified: new Date() },
    ...posts.map((post: Post) => ({
      url: `${siteMetadata.siteUrl}/blog/${post.slug}`,
      lastModified: `${siteMetadata.siteUrl}/${post.date}`,
    })),
  ];
}
