import { GridContainer } from "@/components/grid-container";
import Link from "next/link";

export default function NotFound() {
  return (
    <GridContainer className="relative mx-auto px-4 md:max-w-none md:px-8 lg:max-w-4xl">
      <div className="safe-paddings col-span-full md:col-start-2 md:col-end-12">
        <p className="text-center text-[7.5rem] text-[#E9ECEF] font-black dark:text-[#373A40] md:text-[13.75rem]">
          404
        </p>
        <h1 className="text-center font-black text-[2rem] md:text-[2.375rem] dark:text-[#c1c2c5]">
          Ooops! Page not found...
        </h1>
        <div className="text-center mt-8">
          <Link className="hover:text-primary-1" href="/">
            Back to Home
          </Link>
        </div>
      </div>
    </GridContainer>
  );
}
