'use client';

import React, { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isHiding, setIsHiding] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Smooth progress simulation synced with assets
    let current = 0;
    const interval = setInterval(() => {
      // Faster progression at start, natural pacing
      const step = Math.max(1, Math.floor((100 - current) * 0.15));
      current = Math.min(100, current + step);
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        // Pause briefly at 100% then trigger exit animation
        setTimeout(() => {
          setIsHiding(true);
          setTimeout(() => {
            setIsDone(true);
          }, 600); // Duration of fade-out animation
        }, 400);
      }
    }, 60);

    return () => clearInterval(interval);
  }, []);

  if (isDone) return null;

  return (
    <div className={`loading-screen-overlay ${isHiding ? 'hide' : ''}`} aria-hidden="true">
      <div className="loading-content">
        {/* Animated Donut Graphic */}
        <div className="loading-donut-wrapper">
          <div className="loading-donut-ring">
            {/* SVG Donut with animated glaze drip and sprinkles */}
            <svg
              viewBox="0 0 200 200"
              className="loading-donut-svg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Golden Dough */}
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="#E5A642"
                strokeWidth="40"
                fill="none"
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="#D99732"
                strokeWidth="38"
                fill="none"
              />

              {/* Glossy Strawberry / Chocolate Glaze Swirl */}
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="#F04469"
                strokeWidth="28"
                strokeDasharray="420"
                strokeDashoffset={420 - (420 * progress) / 100}
                strokeLinecap="round"
                className="loading-glaze-progress"
                fill="none"
              />

              {/* Colorful Sprinkles */}
              <rect x="75" y="40" width="12" height="4" rx="2" fill="#FFFFFF" transform="rotate(25 75 40)" />
              <rect x="120" y="45" width="12" height="4" rx="2" fill="#FFD900" transform="rotate(-35 120 45)" />
              <rect x="145" y="85" width="12" height="4" rx="2" fill="#3B82F6" transform="rotate(45 145 85)" />
              <rect x="135" y="130" width="12" height="4" rx="2" fill="#10B981" transform="rotate(-20 135 130)" />
              <rect x="90" y="150" width="12" height="4" rx="2" fill="#FFFFFF" transform="rotate(60 90 150)" />
              <rect x="50" y="115" width="12" height="4" rx="2" fill="#FFD900" transform="rotate(-15 50 115)" />
              <rect x="45" y="70" width="12" height="4" rx="2" fill="#EC4899" transform="rotate(30 45 70)" />

              {/* Donut Center Hole */}
              <circle cx="100" cy="100" r="38" fill="#FFD900" />
            </svg>
          </div>

          {/* Soft Shadow beneath donut */}
          <div className="loading-donut-shadow" />
        </div>

        {/* Brand Wordmark & Animated Text */}
        <div className="loading-brand">
          <h2 className="loading-brand-title">
            GLAZE<span>&amp;CO.</span>
          </h2>
          <p className="loading-brand-subtitle">
            Baking your experience...
          </p>
        </div>

        {/* Progress Bar & Number */}
        <div className="loading-progress-container">
          <div className="loading-progress-bar">
            <div
              className="loading-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="loading-progress-number">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
