import Image from "next/image";

type CustomImageProps = {
  src: string;
  alt: string;
  priority?: string;
};

export const CustomImage = ({ src, alt, priority }: CustomImageProps) => {
  return (
    <div className="w-full h-full">
      <Image
        className="rounded-lg mx-auto"
        src={src}
        alt={alt}
        width={650}
        height={650}
        priority={priority ? true : false}
      />
    </div>
  );
};
