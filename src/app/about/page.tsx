import { GridContainer } from "@/components/grid-container";
import { AboutService } from "@/service/about.service";
import { notFound } from "next/navigation";

export default async function About() {
  const about = await AboutService.fetchAbout();

  if (!about) {
    notFound();
  }

  return (
    <div className="safe-paddings pt-6 md:pt-12">
      <GridContainer className="relative mx-auto px-4 md:max-w-none md:px-8 lg:max-w-4xl">
        <section className="safe-paddings col-span-full md:col-start-2 md:col-end-12 dark:text-slate-200">
          <div className="col-span-full md:col-start-2 md:col-end-12 prose-md prose-headings:font-headings prose-h1:mb-8 prose-h2:mb-4 prose-h2:mt-0 prose-ul:mb-8 prose-headings:leading-tighter container prose prose-lg prose-headings:font-bold prose-headings:tracking-tighter prose-a:decoration-[#00e599] prose-img:rounded-md prose-img:shadow-lg dark:prose-invert dark:prose-headings:text-slate-200 dark:prose-a:text-primary-400 prose-code:before:content-none prose-code:after:content-none prose-pre:p-0">
            {about?.content}
          </div>
        </section>
      </GridContainer>
    </div>
  );
}
