"use client";

import { siteMetadata } from "@/constant/site-metadata";
import { Giscus } from "./giscus";
import { Frontmatter } from "@/types/post";

type CommentsProps = {
  frontMatter: Frontmatter;
};

export const Comments = ({ frontMatter }: CommentsProps) => {
  return (
    <div id="comment">
      {siteMetadata.comment && siteMetadata.comment.provider === "giscus" && (
        <Giscus mapping={frontMatter.slug} />
      )}
    </div>
  );
};
