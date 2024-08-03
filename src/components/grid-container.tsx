import { ReactNode } from "react"
import { cn } from "@/libs/utils"

type GridContainerProps = {
  className?: string
  children?: ReactNode
}

export const GridContainer = ({ className, children }: GridContainerProps) => {
  return (
    <div
      className={cn(
        `grid grid-cols-12 gap-0 md:gap-x-8 lg:gap-x-16`,
        className
      )}
    >
      {children}
    </div>
  )
}
