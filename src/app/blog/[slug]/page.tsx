import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { siteMetadata } from "@/constant/site-metadata"
import { PostService } from "@/service/posts.service"

import { Comments } from "@/components/comments"
import { GridContainer } from "@/components/grid-container"

type BlogProps = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const allPosts = await PostService.fetchPosts()
  const result = allPosts.reduce<Array<{ slug: string }>>((prev, post) => {
    const slug = `${post.slug.replace(".md", "")}`

    prev.push({ slug })
    return prev
  }, [])

  return result
}

export async function generateMetadata({
  params,
}: BlogProps): Promise<Metadata> {
  const post = await PostService.findPostBySlug(decodeURI(params.slug))

  if (!post) {
    return {
      title: "해당 글을 찾을 수 없습니다.",
    }
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.siteName,
    },
  }
}

export default async function Blog({ params }: BlogProps) {
  const post = await PostService.findPostBySlug(decodeURI(params.slug))

  if (!post) {
    return notFound()
  }

  const { content, ...frontMatter } = post

  return (
    <article>
      <GridContainer className="relative mx-auto mt-6 px-4 md:mt-12 md:max-w-none md:px-8 lg:mt-16 lg:max-w-4xl">
        <header className="safe-paddings col-span-full dark:text-slate-200 md:col-start-2 md:col-end-12">
          <p>
            <time dateTime={String(post.date.getTime())}>
              {post.date.toLocaleDateString("ko-kr", {
                year: "numeric",
                month: "short",
                day: "numeric",
                timeZone: "UTC",
              })}
            </time>
          </p>
          <h1 className="leading-tighter font-heading mb-8 text-4xl font-bold tracking-tighter md:text-5xl md:leading-tight">
            {post.title}
          </h1>
        </header>
        <div className="prose-md prose-headings:font-headings prose-headings:leading-tighter dark:prose-a:text-primary-400 container prose prose-lg col-span-full dark:prose-invert prose-headings:font-bold prose-headings:tracking-tighter prose-a:decoration-primary-1 prose-img:rounded-md prose-img:shadow-lg dark:prose-headings:text-slate-200 dark:prose-pre:bg-[#262626] md:col-start-2 md:col-end-12">
          {content}
        </div>
        <hr className="safe-paddings col-span-full my-8 h-px border-0 bg-gray-200 dark:bg-gray-700 md:col-start-2 md:col-end-12" />
        <div className="safe-paddings col-span-full md:col-start-2 md:col-end-12">
          <Comments frontMatter={frontMatter} />
        </div>
        <div className="safe-paddings col-span-full mt-16 md:col-start-2 md:col-end-12">
          <Link
            className="cursor-pointer dark:text-green-300 dark:hover:text-primary-1"
            href="/"
          >
            ← Back to the blog
          </Link>
        </div>
      </GridContainer>
    </article>
  )
}
