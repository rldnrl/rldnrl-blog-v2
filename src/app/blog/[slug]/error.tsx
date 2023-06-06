"use client";

import { useEffect } from "react";
import { GridContainer } from "@/components/grid-container";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <GridContainer className="relative mx-auto px-4 md:max-w-none md:px-8 lg:max-w-4xl">
      <div className="safe-paddings col-span-full md:col-start-2 md:col-end-12">
        <p className="text-center text-[7.5rem] text-[#E9ECEF] font-black dark:text-[#373A40] md:text-[13.75rem]">
          500
        </p>
        <h1 className="text-center font-black text-[2rem] md:text-[2.375rem] dark:text-[#c1c2c5]">
          Something bad just happened...
        </h1>
        <p className="text-center dark:text-white mt-4">
          Our servers could not handle your request. Don&apos;t worry, our
          <br />
          development team was already notified. Try refreshing the page.
        </p>
        <div className="text-center mt-8">
          <button
            className="dark:text-green-300 dark:hover:text-primary-1 cursor-pointer"
            onClick={() => router.refresh()}>
            Refresh the page
          </button>
        </div>
      </div>
    </GridContainer>
  );
}
