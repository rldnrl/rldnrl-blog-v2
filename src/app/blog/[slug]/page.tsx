import md from "markdown-it";
import hljs from "highlight.js";
import { PostService } from "@/service/posts.service";
import { GridContainer } from "@/components/grid-container";

import "@/assets/prism.css?inline";
import "highlight.js/styles/atom-one-dark.css?inline";

export async function generateStaticParams() {
  const allPosts = await PostService.fetchPosts();
  const result = allPosts.reduce<Array<{ slug: string }>>((prev, post) => {
    const slug = `${post.slug.replace(".md", "")}`;

    prev.push({ slug });
    return prev;
  }, []);

  return result;
}

export default async function Blog({ params }: { params: { slug: string } }) {
  const post = await PostService.findPostBySlug(decodeURI(params.slug));

  console.log({ post });

  if (!post) {
    return null;
  }

  return (
    <article>
      <GridContainer className="mx-auto px-4 pt-6 md:max-w-none md:px-6 md:pt-12 lg:max-w-[936px] lg:pt-16 xl:max-w-[1009px] xl:pt-20">
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
        <div
          className="col-span-full md:col-start-2 md:col-end-12 prose-md prose-headings:font-headings prose-headings:leading-tighter container prose prose-lg prose-headings:font-bold prose-headings:tracking-tighter prose-a:text-primary-600 prose-img:rounded-md prose-img:shadow-lg dark:prose-invert dark:prose-headings:text-slate-200 dark:prose-a:text-primary-400 prose-code:before:content-none prose-code:after:content-none"
          dangerouslySetInnerHTML={{
            __html: md({
              html: true,
              highlight: (str, lang) => {
                if (lang && hljs.getLanguage(lang)) {
                  try {
                    return hljs.highlight(str, { language: lang }).value;
                  } catch (_) {
                    // empty
                  }
                }

                return "";
              },
            }).render(post.content),
          }}
        />
      </GridContainer>
    </article>
  );
}
