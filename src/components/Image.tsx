import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    /** Image priority. If true, disables lazy loading. Use for above-the-fold images. */
    priority?: boolean;
    /** Determines the resizing parameter for Unsplash. Default is 'full'. */
    size?: 'thumbnail' | 'medium' | 'full';
}

export default function Image({ 
    src, 
    alt, 
    className, 
    priority = false, 
    size = 'full',
    ...props 
}: ImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Optimize Unsplash images automatically
    const getOptimizedSrc = (originalSrc: string, targetSize: 'thumbnail' | 'medium' | 'full') => {
        if (!originalSrc) return '';
        
        // Only apply Unsplash Imgix optimizations if it's an Unsplash URL
        if (originalSrc.includes('images.unsplash.com')) {
            const url = new URL(originalSrc);
            // Default optimizations
            url.searchParams.set('auto', 'format,compress'); // Automatically format to WebP/AVIF depending on browser
            url.searchParams.set('q', '80'); // Quality 80%
            
            // Resize based on size prop
            if (targetSize === 'thumbnail') {
                url.searchParams.set('w', '400');
                url.searchParams.set('fit', 'crop');
            } else if (targetSize === 'medium') {
                url.searchParams.set('w', '800');
            } else {
                url.searchParams.set('w', '1200'); // Cap at 1200 max
            }
            
            return url.toString();
        }
        
        return originalSrc;
    };

    const optimizedSrc = getOptimizedSrc(src, size);

    return (
        <img
            src={hasError ? 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png' : optimizedSrc}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${hasError ? 'object-contain bg-slate-100 dark:bg-slate-800' : ''}`}
            {...props}
        />
    );
}
