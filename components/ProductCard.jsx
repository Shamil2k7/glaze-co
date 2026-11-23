'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Check, Plus } from 'lucide-react';

export default function ProductCard({ product, showDescription = false }) {
  const { addToCart, items } = useCart();
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const cartItem = items.find((item) => item.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    addToCart(product);
    setIsAddedRecently(true);
    setTimeout(() => {
      setIsAddedRecently(false);
    }, 1200);
  };

  return (
    <div className="product-card-wrapper">
      <div className="product-card">
        {/* Overlapping Hero Product Image with soft natural shadow */}
        <div className="product-card-image-box">
          <img
            src={product.image}
            alt={product.name}
            className="product-card-image"
            loading="lazy"
          />
          {product.tag && (
            <span className="product-card-tag">{product.tag}</span>
          )}
        </div>

        {/* Content Area */}
        <div className="product-card-body">
          <h3 className="product-card-title">{product.name}</h3>

          {showDescription && product.description && (
            <p className="product-card-description">{product.description}</p>
          )}

          <div className="product-card-price-row">
            <span className="product-card-price">{product.formattedPrice}</span>
            {inCartQty > 0 && (
              <span className="product-in-cart-badge">
                {inCartQty} in bag
              </span>
            )}
          </div>

          {/* Strawberry Pink Add to Bag Button (matching reference) */}
          <button
            onClick={handleAdd}
            className={`product-card-btn ${isAddedRecently ? 'added' : ''}`}
            aria-label={`Add ${product.name} to bag`}
          >
            {isAddedRecently ? (
              <span className="btn-content">
                <Check size={18} />
                <span>Added!</span>
              </span>
            ) : (
              <span className="btn-content">
                <span>Add to Bag</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
