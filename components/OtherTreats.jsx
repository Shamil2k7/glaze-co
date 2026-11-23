'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { treats } from '../data/products';
import { Sparkles, Cookie } from 'lucide-react';

export default function OtherTreats() {
  return (
    <section className="treats-section" id="treats">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-center">
          <div className="section-label-center">
            <Cookie size={16} />
            <span>FRESH FROM THE OVEN</span>
          </div>

          <h2 className="section-main-title">
            MORE THAN JUST DONUTS.
          </h2>

          <p className="section-subtitle">
            Warm pastries, moist muffins and decadent brownies crafted with equal passion.
          </p>
        </div>

        {/* 6 Treats Grid */}
        <div className="products-grid treats-grid">
          {treats.map((treat) => (
            <ProductCard
              key={treat.id}
              product={treat}
              showDescription={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
