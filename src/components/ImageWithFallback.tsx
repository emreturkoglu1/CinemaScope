import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc: string;
  onLoadingChange?: (loading: boolean) => void;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc,
  alt,
  className,
  onLoadingChange,
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setError(true);
    setLoading(false);
    onLoadingChange?.(false);
    
    // Mevcut onError çağrılsın
    if (props.onError) {
      props.onError(e);
    }
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setLoading(false);
    onLoadingChange?.(false);
    
    // Mevcut onLoad çağrılsın
    if (props.onLoad) {
      props.onLoad(e);
    }
  };

  return (
    <img
      src={error ? fallbackSrc : src}
      alt={alt}
      className={className}
      {...props}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
};

export default ImageWithFallback; 