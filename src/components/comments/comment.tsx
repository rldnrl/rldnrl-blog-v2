"use client"

import { siteMetadata } from "@/constant/site-metadata"

import { Frontmatter } from "@/types/post"

import { Giscus } from "./giscus"

type CommentsProps = {
  frontMatter: Frontmatter
}

export const Comments = ({ frontMatter }: CommentsProps) => {
  return (
    <div id="comment">
      {siteMetadata.comment && siteMetadata.comment.provider === "giscus" && (
        <Giscus mapping={frontMatter.slug} />
      )}
    </div>
  )
}
