import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, ...rest } = props

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  )
import React, { useState } from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string;
};

export function ImageWithFallback({ src, alt, fallback, ...rest }: Props) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    // small inline SVG fallback or a neutral placeholder path
    return (
      <img
        src={fallback ?? 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="88" height="88"><rect width="100%" height="100%" fill="%23ececec"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23888" font-size="12">No image</text></svg>'}
        alt={alt ?? 'fallback'}
        {...(rest as any)}
      />
    );
  }

  return <img src={src} alt={alt} onError={() => setErrored(true)} {...(rest as any)} />;
}
