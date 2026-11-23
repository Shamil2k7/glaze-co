'use client';

import React, { useEffect, useRef, useState } from 'react';

const DONUT_IMAGES = [
  '/assets/donuts/chocolate-glazed.webp',
  '/assets/donuts/strawberry-sprinkle.webp',
  '/assets/donuts/oreo-crunch.webp',
  '/assets/donuts/caramel-crunch.webp',
  '/assets/donuts/white-choco.webp'
];

export default function DonutSequence({ scrollProgress = 0, currentStage = 0 }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [frames, setFrames] = useState([]);
  const [donutsLoaded, setDonutsLoaded] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [dragProgressOffset, setDragProgressOffset] = useState(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const frameCount = 94;

  // Preload all transparent sequence frames and donut stage images
  useEffect(() => {
    let active = true;
    const loadedFrames = [];
    const loadedDonuts = [];

    // Preload donut showcase images
    DONUT_IMAGES.forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (!active) return;
        loadedDonuts[idx] = img;
      };
    });
    setDonutsLoaded(loadedDonuts);

    // Preload video sequence frames
    let loadedCount = 0;
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const num = String(i).padStart(3, '0');
      img.src = `/assets/donut-sequence/frame_${num}.webp`;
      img.onload = () => {
        if (!active) return;
        loadedFrames[i] = img;
        loadedCount++;
        if (loadedCount >= Math.min(10, frameCount)) {
          setIsReady(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
      };
    }
    setFrames(loadedFrames);

    return () => {
      active = false;
    };
  }, []);

  // Handle Touch / Mouse Drag Scrubbing for Mobile & Desktop
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - startXRef.current;
    // Map drag distance to sequence rotation offset
    setDragProgressOffset((prev) => {
      const next = prev - deltaX * 0.002;
      return next;
    });
    startXRef.current = clientX;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Canvas drawing loop based on scrollProgress + dragProgressOffset
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = rect.width;
    const h = rect.height;

    // Clear canvas completely
    ctx.clearRect(0, 0, w, h);

    // Combine scroll progress and interactive drag offset
    let rawP = scrollProgress + dragProgressOffset;
    if (rawP < 0) rawP = (rawP % 1) + 1;
    const p = Math.max(0, Math.min(1, rawP));

    // Helper to draw an image centered and scaled with soft shadow
    const drawDonut = (img, scale = 1, rotation = 0, alpha = 1) => {
      if (!img || !img.complete) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      // Translate to center
      ctx.translate(w / 2, h / 2);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);

      // Natural soft shadow under donut
      ctx.shadowColor = 'rgba(64, 32, 20, 0.24)';
      ctx.shadowBlur = 36;
      ctx.shadowOffsetY = 24;

      // Fit inside canvas keeping aspect ratio
      const imgAspect = img.width / img.height;
      let targetW = w * 0.88;
      let targetH = targetW / imgAspect;

      if (targetH > h * 0.88) {
        targetH = h * 0.88;
        targetW = targetH * imgAspect;
      }

      ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
      ctx.restore();
    };

    if (p <= 0.22) {
      // Rotation sequence phase
      const seqProgress = p / 0.22;
      const frameIdx = Math.min(frameCount - 1, Math.floor(seqProgress * frameCount));
      const frameImg = frames[frameIdx] || frames[0];

      if (frameImg && frameImg.complete) {
        const blendAlpha = p > 0.18 ? 1 - (p - 0.18) / 0.04 : 1;
        drawDonut(frameImg, 1.0, 0, blendAlpha);

        if (p > 0.18 && donutsLoaded[1]) {
          const inAlpha = (p - 0.18) / 0.04;
          drawDonut(donutsLoaded[1], 0.95 + inAlpha * 0.05, (1 - inAlpha) * -0.15, inAlpha);
        }
      } else if (donutsLoaded[0]) {
        drawDonut(donutsLoaded[0], 1, 0, 1);
      }
    } else {
      const stageRanges = [
        { idx: 1, start: 0.22, end: 0.42 },
        { idx: 2, start: 0.42, end: 0.62 },
        { idx: 3, start: 0.62, end: 0.82 },
        { idx: 4, start: 0.82, end: 1.00 }
      ];

      for (let i = 0; i < stageRanges.length; i++) {
        const stage = stageRanges[i];
        if (p >= stage.start && p <= stage.end) {
          const localT = (p - stage.start) / (stage.end - stage.start);
          const currentImg = donutsLoaded[stage.idx];
          const nextImg = donutsLoaded[stage.idx + 1];

          const rot = (localT - 0.5) * 0.25;

          if (localT > 0.8 && nextImg && i < stageRanges.length - 1) {
            const fadeT = (localT - 0.8) / 0.2;
            drawDonut(currentImg, 1 - fadeT * 0.05, rot, 1 - fadeT);
            drawDonut(nextImg, 0.95 + fadeT * 0.05, (1 - fadeT) * -0.2, fadeT);
          } else {
            drawDonut(currentImg, 1.0, rot, 1.0);
          }
          break;
        }
      }
    }
  }, [scrollProgress, dragProgressOffset, frames, donutsLoaded, isReady]);

  return (
    <div
      ref={containerRef}
      className="donut-sequence-container"
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Primary Canvas rendering 30 FPS sequence & transitions */}
      <canvas ref={canvasRef} className="donut-sequence-canvas" />

      {/* Floating badge indicator */}
      <div className="donut-floating-chip">
        <span className="donut-chip-dot" />
        <span className="donut-chip-text">Drag or Scroll to 360° Rotate</span>
      </div>

      {/* Fallback image */}
      <noscript>
        <img
          src="/assets/donuts/chocolate-glazed.webp"
          alt="Chocolate Glazed Donut"
          className="donut-sequence-fallback"
        />
      </noscript>
    </div>
  );
}
