import { PostService } from "@/service/posts.service";
import { GridContainer } from "@/components/grid-container";

import "@/assets/prism.css";
import "highlight.js/styles/atom-one-dark.css";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { siteMetadata } from "@/constant/site-metadata";
import Link from "next/link";
import { Comments } from "@/components/comments";

type BlogProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const allPosts = await PostService.fetchPosts();
  const result = allPosts.reduce<Array<{ slug: string }>>((prev, post) => {
    const slug = `${post.slug.replace(".md", "")}`;

    prev.push({ slug });
    return prev;
  }, []);

  return result;
}

export async function generateMetadata({
  params,
}: BlogProps): Promise<Metadata> {
  const post = await PostService.findPostBySlug(decodeURI(params.slug));

  if (!post) {
    return {
      title: "해당 글을 찾을 수 없습니다.",
    };
  }

  return {
    title: post.title,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.siteName,
    },
  };
}

export default async function Blog({ params }: BlogProps) {
  const post = await PostService.findPostBySlug(decodeURI(params.slug));

  if (!post) {
    return notFound();
  }

  const { content, ...frontMatter } = post;

  return (
    <article>
      <GridContainer className="relative mx-auto px-4 mt-6 md:max-w-none md:px-8 md:mt-12 lg:max-w-4xl lg:mt-16">
        <header className="safe-paddings col-span-full md:col-start-2 md:col-end-12 dark:text-slate-200">
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
        <div className="col-span-full md:col-start-2 md:col-end-12 prose-md prose-headings:font-headings prose-headings:leading-tighter container prose prose-lg prose-headings:font-bold prose-headings:tracking-tighter prose-a:decoration-[#00e599] prose-img:rounded-md prose-img:shadow-lg dark:prose-invert dark:prose-headings:text-slate-200 dark:prose-a:text-primary-400 prose-code:before:content-none prose-code:after:content-none prose-pre:p-0">
          {content}
        </div>
        <div className="col-span-full md:col-start-2 md:col-end-12 prose-md prose-headings:font-headings prose-headings:leading-tighter container prose prose-lg prose-headings:font-bold prose-headings:tracking-tighter prose-a:decoration-[#00e599] prose-img:rounded-md prose-img:shadow-lg dark:prose-invert dark:prose-headings:text-slate-200 dark:prose-a:text-primary-400 prose-code:before:content-none prose-code:after:content-none prose-pre:p-0">
          <Comments frontMatter={frontMatter} />
        </div>
        <div className="safe-paddings col-span-full md:col-start-2 md:col-end-12 mt-16">
          <Link
            className="text-green-300 hover:text-[#00E599] cursor-pointer"
            href="/blog">
            ← Back to the blog
          </Link>
        </div>
      </GridContainer>
    </article>
  );
}
