'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { beverages } from '../data/products';
import { Coffee } from 'lucide-react';

export default function Beverages() {
  return (
    <section className="beverages-section" id="beverages">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-center">
          <div className="section-label-center">
            <Coffee size={16} />
            <span>BARISTA CRAFTED</span>
          </div>

          <h2 className="section-main-title">
            SIP SOMETHING DELICIOUS.
          </h2>

          <p className="section-subtitle">
            Pair your favorite sweet treat with our specialty coffees and creamy milkshakes.
          </p>
        </div>

        {/* 5 Beverages Grid */}
        <div className="products-grid beverages-grid">
          {beverages.map((bev) => (
            <ProductCard
              key={bev.id}
              product={bev}
              showDescription={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
