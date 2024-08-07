import { Metadata } from "next"
import { notFound } from "next/navigation"
import { siteMetadata } from "@/constant/site-metadata"
import { AboutService } from "@/service/about.service"

import { GridContainer } from "@/components/grid-container"

export async function generateMetadata(): Promise<Metadata> {
  const about = await AboutService.fetchAbout()

  if (!about) {
    return {
      title: "해당 글을 찾을 수 없습니다.",
    }
  }

  return {
    title: about.title,
    openGraph: {
      title: about.title,
      description: about.description,
      siteName: siteMetadata.siteName,
    },
  }
}

export default async function About() {
  const about = await AboutService.fetchAbout()

  if (!about) {
    notFound()
  }

  return (
    <div className="safe-paddings pt-6 md:pt-12">
      <GridContainer className="relative mx-auto px-4 md:max-w-none md:px-8 lg:max-w-5xl">
        <section className="safe-paddings prose col-span-full dark:prose-invert dark:text-slate-200 md:col-start-2 md:col-end-12">
          <h1>{about?.title ?? About}</h1>
          {about.description && <p className="text-xl">{about.description}</p>}
          <hr />
          {about?.content}
        </section>
      </GridContainer>
    </div>
  )
}
