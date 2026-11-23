'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2 } from 'lucide-react';

export default function ToastNotification() {
  const { toastMessage, openCart } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="cart-toast-notification">
      <div className="toast-inner">
        <CheckCircle2 size={18} className="toast-icon" />
        <span className="toast-text">{toastMessage}</span>
        <button onClick={openCart} className="toast-view-btn">
          View Bag
        </button>
      </div>
    </div>
  );
}
