import Image from "next/image"

type CustomImageProps = {
  src: string
  alt: string
  priority?: string
}

export const CustomImage = ({ src, alt, priority }: CustomImageProps) => {
  return (
    <div className="h-full w-full">
      <Image
        className="mx-auto rounded-lg"
        src={src}
        alt={alt}
        width={650}
        height={650}
        priority={priority ? true : false}
      />
    </div>
  )
}
