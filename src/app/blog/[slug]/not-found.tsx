import Link from "next/link"

import { GridContainer } from "@/components/grid-container"

export default function NotFound() {
  return (
    <GridContainer className="relative mx-auto px-4 md:max-w-none md:px-8 lg:max-w-5xl">
      <div className="safe-paddings col-span-full md:col-start-2 md:col-end-12">
        <h1 className="text-center text-[7.5rem] font-black text-[#E9ECEF] dark:text-[#373A40] md:text-[13.75rem]">
          404
        </h1>
        <h2 className="text-center text-[2rem] font-black dark:text-[#c1c2c5] md:text-[2.375rem]">
          Ooops! Page not found...
        </h2>
        <div className="mt-8 text-center">
          <Link
            className="cursor-pointer dark:text-green-300 dark:hover:text-primary-1"
            href="/"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </GridContainer>
  )
}
