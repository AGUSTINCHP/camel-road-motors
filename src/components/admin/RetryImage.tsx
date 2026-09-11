import { useState } from "react";

// El dev server tarda un instante en "enterarse" de una foto recién subida a
// /public/uploads: la primera carga puede devolver 404 aunque el archivo ya
// esté en disco. Reintenta un par de veces antes de darse por vencido.
const MAX_IMAGE_RETRIES = 3;

export function RetryImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [attempt, setAttempt] = useState(0);

  return (
    <img
      key={src}
      src={attempt === 0 ? src : `${src}?retry=${attempt}`}
      alt={alt}
      className={className}
      onError={() => {
        if (attempt < MAX_IMAGE_RETRIES) {
          setTimeout(() => setAttempt((a) => a + 1), 400 * (attempt + 1));
        }
      }}
    />
  );
}
