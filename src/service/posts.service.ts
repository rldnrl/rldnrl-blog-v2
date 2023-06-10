import fs from "fs";
import rehypeHighlight from "rehype-highlight/lib";
import rehypeSlug from "rehype-slug";
import remarkToc from "remark-toc";
import remarkGfm from "remark-gfm";
import { compileMDX } from "next-mdx-remote/rsc";
import type { Frontmatter, Post } from "@/types/post";
import { select } from "@/utils/select";
import { sort } from "@/utils/sort";
import { CustomImage } from "@/components/custom-image";
import { EnvService } from "./env.service";

type FindLatestPostsParams = {
  count?: number;
  page?: number;
};

const BLOG_DIR = "src/contents/blog";

export class PostService {
  private static _posts: Post[];

  private static load(): Promise<Post[]> {
    const files = fs.readdirSync(BLOG_DIR);

    const posts = Promise.all(
      files
        .filter((filename) => filename.endsWith(".md"))
        .map(async (filename) => {
          const slug = filename.replace(".md", "");
          return await this.findPostBySlug(slug);
        })
    );

    return posts as Promise<Post[]>;
  }

  public static async fetchPosts(): Promise<Post[]> {
    this._posts = this._posts || (await this.load());

    return sort(this._posts, (post: Post) => post.date.getTime(), true).filter(
      (post) => !(post.draft && EnvService.isProduction())
    );
  }

  public static async findLatestPosts({
    count,
    page,
  }: FindLatestPostsParams = {}): Promise<Post[]> {
    const _count = count ?? 4;
    const _page = page ?? 1;
    const posts = await this.fetchPosts();

    return posts
      ? sort(posts, (post) => post.date.getTime(), true).slice(
          (_page - 1) * _count,
          (_page - 1) * _count + _count
        )
      : [];
  }

  public static async findPostBySlug(slug: string): Promise<Post | null> {
    if (!slug) return null;

    try {
      const readFile = fs.readFileSync(BLOG_DIR + `/${slug}.md`, "utf-8");

      const { frontmatter, content } = await compileMDX<Frontmatter>({
        source: readFile,
        components: { CustomImage },
        options: {
          parseFrontmatter: true,
          mdxOptions: {
            rehypePlugins: [rehypeHighlight, rehypeSlug, remarkGfm],
            remarkPlugins: [remarkToc],
          },
        },
      });

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
      } = frontmatter;

      const date = new Date(rawPublishDate);

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
      };
    } catch (e) {
      //
    }

    return null;
  }

  public static async getTags(): Promise<string[]> {
    const posts = await this.fetchPosts();

    const tagsSet = new Set(
      select(posts, (post) => {
        if (post.draft && EnvService.isProduction()) {
          return;
        }

        return post.tags;
      }).flat()
    );

    if (tagsSet.size === 0) {
      return ["all"];
    }

    const tags = [];

    for (const tag of tagsSet) {
      tags.push(tag);
    }

    return ["all", ...(tags as string[])];
  }
}
