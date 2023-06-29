"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { GridContainer } from "@/components/grid-container"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const router = useRouter()
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <GridContainer className="relative mx-auto px-4 md:max-w-none md:px-8 lg:max-w-4xl">
      <div className="safe-paddings col-span-full md:col-start-2 md:col-end-12">
        <h1 className="text-center text-[7.5rem] font-black text-[#E9ECEF] dark:text-[#373A40] md:text-[13.75rem]">
          500
        </h1>
        <h2 className="text-center text-[2rem] font-black dark:text-[#c1c2c5] md:text-[2.375rem]">
          Something bad just happened...
        </h2>
        <p className="mt-4 text-center dark:text-white">
          Our servers could not handle your request. Don&apos;t worry, our
          <br />
          development team was already notified. Try refreshing the page.
        </p>
        <div className="mt-8 text-center">
          <button
            className="cursor-pointer dark:text-green-300 dark:hover:text-primary-1"
            onClick={() => router.refresh()}
          >
            Refresh the page
          </button>
        </div>
      </div>
    </GridContainer>
  )
}
