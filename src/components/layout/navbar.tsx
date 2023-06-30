"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { routes } from "@/constant/routes"

import { buttonVariants } from "../ui/button"
import { MobileNav } from "./mobile-nav"

export const Navbar = () => {
  const pathname = usePathname()

  return (
    <>
      <MobileNav />
      <div className="md:z-0 hidden md:relative md:left-0 md:top-0 md:flex md:w-auto md:items-center">
        <ul className="rounded-lg border border-gray-100 bg-gray-50 font-medium dark:border-gray-700 dark:bg-gray-900 md:mt-0 md:flex md:flex-row md:space-x-4 md:border-0 md:bg-white md:p-0">
          {routes?.map((route) => (
            <li key={route.title}>
              <Link
                className={buttonVariants({
                  variant: route.href === pathname ? "secondary" : "ghost",
                  size: "sm",
                })}
                href={route.href}
              >
                {route.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
