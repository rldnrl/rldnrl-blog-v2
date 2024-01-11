import { Metadata } from "next"
import { Inter } from "next/font/google"
import { siteMetadata } from "@/constant/site-metadata"
import { cn } from "@/utils/cn"
import { Analytics } from "@vercel/analytics/react"

import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"

import "@/assets/prism.css"
import "@/assets/globals.css"

import { ThemeProvider } from "@/providers/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Welcome to Rldnrl Blog",
  description: siteMetadata.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={cn(
          "relative flex min-h-[100vh] flex-col scrollbar-hide",
          inter.className
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header blogTitle="rldnrl" />
          <main className="flex flex-1 flex-col dark:bg-gray-900">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
