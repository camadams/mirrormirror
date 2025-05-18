"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

type SafeImageProps = Omit<ImageProps, "src"> & {
  src?: string;
  fallbackSrc: string;
};

export default function SafeImage({
  src,
  fallbackSrc,
  alt,
  ...rest
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  return (
    <Image
      {...rest}
      src={imgSrc && !error ? imgSrc : fallbackSrc}
      alt={alt}
      onError={() => setError(true)}
    />
  );
}
