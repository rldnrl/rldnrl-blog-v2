import fs from "fs";
import matter from "gray-matter";
import type { Post } from "@/types/post";
import { select } from "@/utils/select";
import { sort } from "@/utils/sort";

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
    return this._posts;
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
      const { data, content } = matter(readFile);

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
      } = data;

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
        content,
        summary,
      };
    } catch (e) {
      /* empty */
    }

    return null;
  }

  public static async findPostsByIds(ids: string[]): Promise<Post[]> {
    if (!Array.isArray(ids)) return [];

    const posts = await this.fetchPosts();

    return ids.reduce((result: Post[], id: string) => {
      posts.some((post: Post) => {
        return id === post.id && result.push(post);
      });
      return result;
    }, []);
  }

  public static async getTags(): Promise<string[]> {
    const posts = await this.fetchPosts();

    const tagsSet = new Set(select(posts, (post) => post.tags).flat());

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
