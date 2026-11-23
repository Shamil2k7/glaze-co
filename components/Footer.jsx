'use client';

import React from 'react';
import { Instagram, MapPin, Phone, Mail, Clock, ArrowUp, Heart } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="footer-top-accent" />
      <div className="footer-container">
        {/* Main Footer Grid */}
        <div className="footer-main-grid">
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <span className="footer-logo-circle" />
              <span className="footer-brand-name">
                GLAZE<span>&amp;CO.</span>
              </span>
            </div>
            <p className="footer-tagline">
              Handcrafting moments of happiness every single morning. Pure ingredients, slow-proved brioche, and uncompromised joy.
            </p>
            <div className="footer-socials">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={18} />
                <span>@glazeandco.donuts</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-link-list">
              <li><a href="#hero">Home</a></li>
              <li><a href="#story">Our Story</a></li>
              <li><a href="#donuts">Artisan Donuts</a></li>
              <li><a href="#treats">Bakery Treats</a></li>
              <li><a href="#beverages">Specialty Beverages</a></li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Flavours</h4>
            <ul className="footer-link-list">
              <li><a href="#donuts">Chocolate Glazed</a></li>
              <li><a href="#donuts">Strawberry Sprinkle</a></li>
              <li><a href="#donuts">Oreo Crunch</a></li>
              <li><a href="#donuts">Caramel Crunch</a></li>
              <li><a href="#donuts">White Choco</a></li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="footer-col contact-col">
            <h4 className="footer-heading">Visit Our Bakery</h4>
            <ul className="footer-contact-list">
              <li>
                <MapPin size={18} className="contact-icon" />
                <span>42 Baker Street, Food District, Mumbai</span>
              </li>
              <li>
                <Clock size={18} className="contact-icon" />
                <span>Mon – Sun: 7:00 AM – 10:00 PM</span>
              </li>
              <li>
                <Phone size={18} className="contact-icon" />
                <span>+91 98200 12345</span>
              </li>
              <li>
                <Mail size={18} className="contact-icon" />
                <span>hello@glazeandco.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} GLAZE &amp; CO. Donut Shop. All rights reserved. Handcrafted with{' '}
            <Heart size={14} className="heart-inline" /> for donut lovers everywhere.
          </p>

          <button
            onClick={scrollToTop}
            className="back-to-top-btn"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
