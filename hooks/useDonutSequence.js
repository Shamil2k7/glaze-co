'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Hook to preload and manage the 94-frame donut image sequence.
 * Provides loaded state, current frame canvas drawing, and smooth preloading.
 */
export function useDonutSequence(frameCount = 94) {
  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    let loadedCount = 0;
    const loadedImages = new Array(frameCount);
    let isCancelled = false;

    // Load first frame immediately for instant visual
    const firstImg = new Image();
    firstImg.src = '/assets/donut-sequence/frame_000.webp';
    firstImg.onload = () => {
      if (isCancelled) return;
      loadedImages[0] = firstImg;
      loadedCount++;
      setLoadProgress(Math.round((loadedCount / frameCount) * 100));

      // Load remaining frames
      for (let i = 1; i < frameCount; i++) {
        const img = new Image();
        const frameIndexStr = String(i).padStart(3, '0');
        img.src = `/assets/donut-sequence/frame_${frameIndexStr}.webp`;
        img.onload = () => {
          if (isCancelled) return;
          loadedImages[i] = img;
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / frameCount) * 100));
          if (loadedCount === frameCount) {
            setImages(loadedImages);
            setIsLoaded(true);
          }
        };
        img.onerror = () => {
          if (isCancelled) return;
          loadedCount++;
          if (loadedCount === frameCount) {
            setImages(loadedImages);
            setIsLoaded(true);
          }
        };
      }
    };

    return () => {
      isCancelled = true;
    };
  }, [frameCount]);

  return {
    images,
    isLoaded,
    loadProgress,
    canvasRef
  };
}
