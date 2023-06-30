import fs from "fs"
import { compileMDX } from "next-mdx-remote/rsc"
import rehypeHighlight from "rehype-highlight/lib"
import rehypeSlug from "rehype-slug"

import { About, Frontmatter } from "@/types/about"
import { GithubCalendar } from "@/components/github-calendar"

const ABOUT_DIR = "src/contents/about"

export class AboutService {
  public static async fetchAbout(): Promise<About | null> {
    try {
      const fileExtension = fs.existsSync(`${ABOUT_DIR}/about.mdx`)
        ? ".mdx"
        : ".md"
      const readFile = fs.readFileSync(
        `${ABOUT_DIR}/about${fileExtension}`,
        "utf-8"
      )

      const { frontmatter, content } = await compileMDX<Frontmatter>({
        source: readFile,
        components: { GithubCalendar },
        options: {
          parseFrontmatter: true,
          mdxOptions: {
            rehypePlugins: [rehypeHighlight, rehypeSlug],
          },
        },
      })

      const { title, description } = frontmatter

      return {
        title,
        description,
        content,
      }
    } catch (e) {
      //
    }

    return null
  }
}
