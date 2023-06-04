import { GridContainer } from "@/components/grid-container";
import Link from "next/link";

export default function NotFound() {
  return (
    <GridContainer className="relative mx-auto px-4 md:max-w-none md:px-8 lg:max-w-4xl">
      <div className="safe-paddings col-span-full md:col-start-2 md:col-end-12 dark:text-slate-200">
        <p>Not Found Post</p>
        <Link href="/">Back to Home</Link>
      </div>
    </GridContainer>
  );
}
