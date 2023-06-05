export const siteMetadata = {
  headerTitle: "rldnrl",
  description: "개발하면서 공부한 내용과 생각했던 것들을 정리하고 있습니다.",
  author: "Kiwook",
  siteName: "Rldnrl Blog",
  github: "https://github.com/rldnrl",
  locale: "ko",
  language: "ko",
  siteUrl: "https://rldnrl-blog-next13.vercel.app",
  siteRepo: "https://github.com/rldnrl/rldnrl-blog-next13",
  email: "rldnrl1002@gmail.com",
  comment: {
    provider: "giscus",
    giscusConfig: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO as string,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID as string,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY as string,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID as string,
      mapping: "pathname", // supported options: pathname, url, title
      reactions: "1", // Emoji reactions: 1 = enable / 0 = disable
      metadata: "0",
      theme: "light",
      lang: "ko",
      darkTheme: "transparent_dark",
      themeURL: "",
    },
  },
};