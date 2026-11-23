'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { donuts } from '../data/products';
import { Sparkles } from 'lucide-react';

export default function FeaturedDonuts() {
  return (
    <section className="featured-donuts-section" id="donuts">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-center">
          
          <h2 className="section-main-title">
            MEET YOUR NEW FAVOURITE.
          </h2>

          <p className="section-subtitle">
            One bite is never enough.
          </p>
        </div>

        {/* 5 Donut Product Cards Grid */}
        <div className="products-grid donuts-grid">
          {donuts.map((donut) => (
            <ProductCard
              key={donut.id}
              product={donut}
              showDescription={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
