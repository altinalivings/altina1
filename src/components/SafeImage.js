export default function SafeImage({ src, alt, className, width, height, fill }) {
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
    />
  )
}
