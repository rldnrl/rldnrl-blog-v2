import { useLayoutEffect } from "react"

interface UseScrollCenterProps {
  ref: React.RefObject<HTMLUListElement>
  targetId: string
}

const useScrollCenter = ({ ref, targetId }: UseScrollCenterProps) => {
  useLayoutEffect(() => {
    const tagsWrapElement = ref.current

    if (!tagsWrapElement) {
      return
    }

    const isScrollActivated =
      tagsWrapElement.scrollWidth >= tagsWrapElement.offsetWidth

    if (!isScrollActivated) {
      return
    }

    const activeTagElement = tagsWrapElement.querySelector<HTMLUListElement>(
      `#${targetId}`
    )

    if (!activeTagElement) {
      return
    }

    const offsetX = activeTagElement.offsetLeft - tagsWrapElement.offsetLeft
    tagsWrapElement.scrollTo(
      offsetX -
        tagsWrapElement.offsetWidth / 2 +
        activeTagElement.offsetWidth / 2,
      0
    )
  }, [ref, targetId])
}

export default useScrollCenter
