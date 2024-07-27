import fs from "fs"
import { remarkCodeTitle } from "@/libs/remark-code-title"
import { compileMDX } from "next-mdx-remote/rsc"
import { select, sort } from "radash"
import rehypePrism from "rehype-prism-plus"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import remarkToc from "remark-toc"

import type { Frontmatter, Post } from "@/types/post"
import { CustomImage } from "@/components/custom-image"

import { EnvService } from "./env.service"

const BLOG_DIR = "src/contents/blog"

export class PostService {
  private _posts: Post[]

  constructor() {
    this._posts = []
  }

  private async load(): Promise<Post[]> {
    const files = fs.readdirSync(BLOG_DIR)

    const posts = await Promise.all(
      files
        .filter(
          (filename) => filename.endsWith(".md") || filename.endsWith(".mdx")
        )
        .map(async (filename) => {
          const slug = filename.replace(/\.(md|mdx)$/, "")
          return await this.findPostBySlug(slug)
        })
    )

    return posts as Post[]
  }

  public async fetchPosts(): Promise<Post[]> {
    if (this._posts.length === 0) {
      this._posts = await this.load()
    }

    return sort(this._posts, (post: Post) => post.date.getTime(), true).filter(
      (post) => !(post.draft && EnvService.isProduction())
    )
  }

  public async findPostBySlug(slug: string): Promise<Post | null> {
    if (!slug) return null

    try {
      const fileExtension = fs.existsSync(`${BLOG_DIR}/${slug}.mdx`)
        ? ".mdx"
        : ".md"
      const readFile = fs.readFileSync(
        `${BLOG_DIR}/${slug}${fileExtension}`,
        "utf-8"
      )

      const { frontmatter, content } = await compileMDX<Frontmatter>({
        source: readFile,
        components: { CustomImage },
        options: {
          parseFrontmatter: true,
          mdxOptions: {
            rehypePlugins: [rehypeSlug, [rehypePrism, { ignoreMissing: true }]],
            remarkPlugins: [remarkToc, remarkCodeTitle, remarkGfm],
          },
        },
      })

      const {
        date: rawPublishDate = new Date(),
        title,
        image,
        tags = [],
        category,
        author,
        draft = false,
        metadata = {},
        summary,
      } = frontmatter

      const date = new Date(rawPublishDate)

      return {
        id: slug,
        slug: slug,
        date,
        title,
        image,
        category,
        tags,
        author,
        draft,
        metadata,
        summary,
        content,
      }
    } catch (e) {
      //
    }

    return null
  }

  public async getTags(): Promise<string[]> {
    const posts = await this.fetchPosts()

    const tagsSet = new Set(
      select(
        posts,
        (post) => {
          return post.tags
        },
        (post) => !(post.draft && EnvService.isProduction())
      ).flat()
    )

    if (tagsSet.size === 0) {
      return ["all"]
    }

    const tags = []

    for (const tag of tagsSet) {
      tags.push(tag)
    }

    return ["all", ...(tags as string[])]
  }
}
