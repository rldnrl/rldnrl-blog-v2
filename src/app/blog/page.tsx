import { Metadata } from "next";
import { GridContainer } from "@/components/grid-container";
import { PostService } from "@/service/posts.service";
import { ArticlesView } from "@/components/blog/articles-view";

export const metadata: Metadata = {
  title: "Rldnrl Blog",
  description: "Rldnrl Blog Description",
};

export default async function BlogList() {
  const tags = await PostService.getTags();
  const posts = await PostService.fetchPosts();

  return (
    <div className="safe-paddings pt-6 md:pt-12">
      <GridContainer className="relative mx-auto px-4 md:max-w-none md:px-8 lg:max-w-4xl">
        <ArticlesView posts={posts} tags={tags} />
      </GridContainer>
    </div>
  );
}
