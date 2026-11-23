'use client';

import React from 'react';
import { Sparkles, Heart, Flame, Award } from 'lucide-react';

export default function StorySection() {
  return (
    <section className="story-section" id="story">
      <div className="story-container">
        {/* Asymmetric Editorial Header */}
        <div className="story-editorial-grid">
          <div className="story-text-column">
            
            <h2 className="story-headline">
              MADE FRESH.
              <br />
              <span className="story-headline-italic">MADE WITH LOVE.</span>
            </h2>

            <p className="story-lead">
              We believe every donut deserves to be special. From soft golden dough to delicious glazes and creative toppings, we make every treat memorable.
            </p>

            <p className="story-body">
              Started as an obsession with the perfect bite, our kitchen combines artisanal bakery traditions with playful modern flavor pairings. We ferment our brioche dough for 24 hours to achieve an impossibly light, melt-in-your-mouth texture before crowning each circle with handcrafted icings and premium crunches.
            </p>

            {/* Three Feature Highlights */}
            <div className="story-features">
              <div className="feature-item">
                <div className="feature-icon-box">
                  <Flame size={22} />
                </div>
                <div className="feature-content">
                  <h4 className="feature-title">1. Freshly Prepared</h4>
                  <p className="feature-desc">
                    Rolled, proved, and fried fresh every morning in small handcrafted batches so your donut arrives warm and tender.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-box">
                  <Heart size={22} />
                </div>
                <div className="feature-content">
                  <h4 className="feature-title">2. Delicious Toppings</h4>
                  <p className="feature-desc">
                    Pure Belgian chocolate, real fruit purées, slow-cooked sea-salt caramel, and crunchy artisan cookie crumbs.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-box">
                  <Award size={22} />
                </div>
                <div className="feature-content">
                  <h4 className="feature-title">3. Made for Every Craving</h4>
                  <p className="feature-desc">
                    Whether you crave nostalgic sprinkle joy or decadent double chocolate crunch, there is a golden bite crafted for you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Composition */}
          <div className="story-visual-column">
            <div className="story-card-composition">
              <div className="story-main-image-frame">
                <img
                  src="/assets/donuts/caramel-crunch.webp"
                  alt="Artisan caramel donut"
                  className="story-main-image"
                  loading="lazy"
                />
                <div className="story-image-badge">
                  <span className="badge-number">100%</span>
                  <span className="badge-text">Real Ingredients</span>
                </div>
              </div>

              {/* Overlapping secondary card */}
              <div className="story-accent-card">
                <div className="accent-quote-mark">“</div>
                <p className="accent-quote">
                  Fluffy on the inside, crisp on the glaze, pure happiness in every single bite.
                </p>
                <div className="accent-author">
                  <strong>Master Baker Marco</strong>
                  <span>Head Dough Artisan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
