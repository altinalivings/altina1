// src/components/ClientImage.tsx
"use client";

import { useState } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string;
};

export default function ClientImage({ src, fallback = "/placeholder/1200x800.jpg", alt = "", ...rest }: Props) {
  const [current, setCurrent] = useState<string>(String(src || fallback));

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
      {...rest}
    />
  );
}
