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
        <section className="safe-paddings col-span-full md:col-start-2 md:col-end-12 dark:text-slate-200 prose dark:prose-invert">
          <h1>{about.title}</h1>
          {about.description && <p className="text-xl">{about.description}</p>}
          <hr />
          {about?.content}
        </section>
      </GridContainer>
    </div>
  );
}
