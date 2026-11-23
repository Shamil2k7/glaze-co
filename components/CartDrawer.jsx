'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalCount,
    clearCart
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'DONUTLOVE') {
      setDiscountPercent(15);
      setPromoSuccess('15% Sweet Discount applied!');
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try "DONUTLOVE"');
      setPromoSuccess('');
    }
  };

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = Math.max(0, subtotal - discountAmount);
  const freeShippingThreshold = 300;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      clearCart();
    }, 1500);
  };

  const resetOrder = () => {
    setOrderComplete(false);
    closeCart();
  };

  if (!isCartOpen) return null;

  return (
    <div className="cart-overlay-backdrop" onClick={closeCart}>
      <div
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title-row">
            <ShoppingBag className="cart-header-icon" size={22} />
            <h2 id="cart-title" className="cart-title">
              Your Treat Bag
            </h2>
            <span className="cart-count-pill">{totalCount} items</span>
          </div>

          <button
            onClick={closeCart}
            className="cart-close-btn"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Delivery Bar */}
        {subtotal > 0 && !orderComplete && (
          <div className="cart-shipping-banner">
            <div className="shipping-text">
              {subtotal >= freeShippingThreshold ? (
                <span className="shipping-unlocked">
                  <Sparkles size={14} /> You unlocked Free Express Delivery!
                </span>
              ) : (
                <span>
                  Add <strong>₹{freeShippingThreshold - subtotal}</strong> more for{' '}
                  <strong>Free Express Delivery</strong>
                </span>
              )}
            </div>
            <div className="shipping-progress-track">
              <div
                className="shipping-progress-fill"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>
        )}

        {/* Drawer Body */}
        <div className="cart-drawer-body">
          {orderComplete ? (
            <div className="cart-success-view">
              <div className="success-icon-wrap">
                <CheckCircle2 size={56} className="success-icon" />
              </div>
              <h3 className="success-title">Order Received!</h3>
              <p className="success-desc">
                Your freshly glazed treats are being hand-packed right now. Get ready for a little moment of happiness!
              </p>
              <div className="success-order-id">
                Order #{Math.floor(100000 + Math.random() * 900000)}
              </div>
              <button onClick={resetOrder} className="btn-primary success-btn">
                <span>Continue Browsing</span>
                <ArrowRight size={18} />
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="cart-empty-view">
              <div className="empty-donut-illustration">
                <img
                  src="/assets/donuts/chocolate-glazed.webp"
                  alt="Empty Bag"
                  className="empty-donut-img"
                />
              </div>
              <h3 className="empty-cart-title">Your bag is empty</h3>
              <p className="empty-cart-desc">
                Looks like you haven&apos;t added any delicious donuts yet. Let&apos;s fix that!
              </p>
              <button
                onClick={() => {
                  closeCart();
                  const el = document.getElementById('donuts');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary empty-cart-cta"
              >
                <span>Browse Artisan Donuts</span>
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-thumb-box">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-thumb"
                    />
                  </div>

                  <div className="cart-item-details">
                    <div className="cart-item-main">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <span className="cart-item-single-price">
                        {item.formattedPrice} each
                      </span>
                    </div>

                    <div className="cart-item-controls">
                      <div className="cart-qty-picker">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="qty-btn"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="qty-btn"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="cart-item-subtotal">
                        ₹{item.price * item.quantity}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="cart-item-remove-btn"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer (Only when items exist and not checked out) */}
        {items.length > 0 && !orderComplete && (
          <div className="cart-drawer-footer">
            {/* Promo code form */}
            <form onSubmit={handleApplyPromo} className="cart-promo-form">
              <input
                type="text"
                placeholder="Promo code (e.g. DONUTLOVE)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="promo-input"
              />
              <button type="submit" className="promo-apply-btn">
                Apply
              </button>
            </form>
            {promoSuccess && <p className="promo-msg-success">{promoSuccess}</p>}
            {promoError && <p className="promo-msg-error">{promoError}</p>}

            {/* Calculations */}
            <div className="cart-summary-table">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="summary-row discount">
                  <span>Sweet Discount ({discountPercent}%)</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Estimated Taxes & Packaging</span>
                <span className="free-tag">FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span className="total-value">₹{finalTotal}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="btn-primary checkout-btn"
            >
              {isCheckingOut ? (
                <span className="checkout-loading">
                  <span className="spinner" />
                  <span>Placing your order...</span>
                </span>
              ) : (
                <>
                  <span>Proceed to Checkout</span>
                  <span className="checkout-total-pill">₹{finalTotal}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
