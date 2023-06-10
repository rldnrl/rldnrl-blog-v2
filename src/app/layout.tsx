import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/utils/cn";
import { Metadata } from "next";
import { siteMetadata } from "@/constant/site-metadata";

import "@/assets/prism.css";
import "@/assets/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Welcome to Rldnrl Blog",
  description: siteMetadata.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body
        className={cn(
          "relative flex min-h-[100vh] flex-col scrollbar-hide",
          inter.className
        )}>
        <Header blogTitle="rldnrl" />
        <main className="flex flex-1 flex-col dark:bg-gray-900">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
