import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/utils/cn";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/assets/globals.css";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        className={cn("relative flex min-h-[100vh] flex-col scrollbar-hide")}>
        <ThemeProvider>
          <Header blogTitle="rldnrl" />
          <main className="flex flex-1 flex-col dark:bg-gray-900">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
