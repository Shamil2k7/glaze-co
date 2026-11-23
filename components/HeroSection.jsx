'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import DonutSequence from './DonutSequence';
import { heroStages, donuts } from '../data/products';
import { useCart } from '../context/CartContext';
import { ArrowRight, Sparkles, ShoppingBag, RotateCw } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const heroWrapperRef = useRef(null);
  const heroPinRef = useRef(null);
  const contentRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const pinEl = heroPinRef.current;
    const wrapperEl = heroWrapperRef.current;
    if (!pinEl || !wrapperEl) return;

    const mm = gsap.matchMedia();

    // DESKTOP: Pinned Scroll-Driven Sequence (min-width: 769px)
    mm.add('(min-width: 769px)', () => {
      ScrollTrigger.create({
        trigger: wrapperEl,
        start: 'top top',
        end: '+=300%',
        pin: pinEl,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const prog = self.progress;
          setScrollProgress(prog);

          let stage = 0;
          if (prog < 0.22) stage = 0;
          else if (prog < 0.42) stage = 1;
          else if (prog < 0.62) stage = 2;
          else if (prog < 0.82) stage = 3;
          else stage = 4;

          setActiveStageIdx(stage);
        }
      });
    });

    // MOBILE: Unpinned natural scroll with interactive tap & swipe (max-width: 768px)
    mm.add('(max-width: 768px)', () => {
      // Gentle parallax / scroll progress tracking without locking the screen
      ScrollTrigger.create({
        trigger: wrapperEl,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          // On mobile, keep sequence responsive to scroll without pinning
          const prog = self.progress * 0.3; // subtle ambient rotation
          setScrollProgress((prev) => (prev < 0.25 ? prog : prev));
        }
      });
    });

    return () => {
      mm.revert();
    };
  }, []);

  const activeStage = heroStages[activeStageIdx] || heroStages[0];
  const matchingDonut = donuts[activeStageIdx] || donuts[0];

  const handleStageSelect = (idx) => {
    setActiveStageIdx(idx);
    const targetProg = idx === 0 ? 0.05 : 0.22 + (idx - 1) * 0.2 + 0.1;
    setScrollProgress(targetProg);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={heroWrapperRef} className="hero-scroll-wrapper" id="hero">
      <div ref={heroPinRef} className="hero-pin-container">
        <div className="hero-grid">
          {/* LEFT / TOP COLUMN: Donut Sequence Canvas */}
          <div className="hero-left-col">
            <DonutSequence scrollProgress={scrollProgress} currentStage={activeStageIdx} />
          </div>

          {/* RIGHT / BOTTOM COLUMN: Premium Typography & Interactive Bar */}
          <div ref={contentRef} className="hero-right-col">
            <div className="hero-badge">
              <Sparkles className="hero-badge-icon" size={16} />
              <span>FRESHLY MADE, ALWAYS DELICIOUS</span>
            </div>

            <h1 className="hero-headline">
              A LITTLE BIT OF
              <span className="hero-headline-highlight"> HAPPINESS.</span>
            </h1>

            <p className="hero-description">
              Freshly baked donuts, delicious toppings and irresistible flavours.
              Every bite is a little moment of happiness.
            </p>

            {/* CTAs */}
            <div className="hero-actions">
              <button
                onClick={() => scrollToSection('donuts')}
                className="btn-primary"
              >
                <span>Explore Donuts</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => scrollToSection('treats')}
                className="btn-secondary"
              >
                <span>View Our Menu</span>
              </button>
            </div>

            {/* Live Interactive Flavor Showcase (Responsive on both desktop & mobile) */}
            <div className="hero-spotlight-card">
              <div className="spotlight-header">
                <div className="spotlight-badge">
                  <span className="spotlight-pulse" />
                  <span>Interactive Donut Bar</span>
                </div>
                <span className="spotlight-step">
                  0{activeStageIdx + 1} / 05
                </span>
              </div>

              <div className="spotlight-body">
                <div className="spotlight-info">
                  <h3 className="spotlight-title">{activeStage.donutName}</h3>
                  <p className="spotlight-subtitle">{activeStage.subtitle}</p>
                </div>
                <div className="spotlight-pricing">
                  <span className="spotlight-price">{activeStage.price}</span>
                  <button
                    onClick={() => addToCart(matchingDonut)}
                    className="spotlight-add-btn"
                    title={`Add ${matchingDonut.name} to bag`}
                  >
                    <ShoppingBag size={16} />
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>

              {/* Stage Progress Pills (Touch-scrollable on mobile) */}
              <div className="spotlight-pills">
                {heroStages.map((stg, i) => (
                  <button
                    key={stg.index}
                    onClick={() => handleStageSelect(i)}
                    className={`spotlight-pill ${i === activeStageIdx ? 'active' : ''}`}
                    title={stg.donutName}
                    aria-label={`Switch to ${stg.donutName}`}
                  >
                    <span className="pill-dot" />
                    <span className="pill-name">{stg.donutName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Scroll Indicator helper (Desktop only) */}
            <div className="hero-scroll-hint">
              <span className="scroll-hint-mouse">
                <span className="scroll-hint-wheel" />
              </span>
              <span className="scroll-hint-text">Scroll down to rotate & taste flavours</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
