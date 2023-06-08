import { About, Frontmatter } from "@/types/about";
import fs from "fs";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight/lib";
import rehypeSlug from "rehype-slug";

const ABOUT_DIR = "src/contents/about";

export class AboutService {
  public static async fetchAbout(): Promise<About | null> {
    try {
      const readFile = fs.readFileSync(ABOUT_DIR + `/about.md`, "utf-8");

      const { frontmatter, content } = await compileMDX<Frontmatter>({
        source: readFile,
        options: {
          parseFrontmatter: true,
          mdxOptions: {
            rehypePlugins: [rehypeHighlight, rehypeSlug],
          },
        },
      });

      const { title, description } = frontmatter;

      return {
        title,
        description,
        content,
      };
    } catch (e) {
      //
    }

    return null;
  }
}
