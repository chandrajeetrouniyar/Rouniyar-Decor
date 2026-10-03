'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          We Are Here to Help
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-earth-900">
          Contact Rouniyar Decor
        </h1>
        <p className="text-xs sm:text-sm text-earth-600">
          Have a question about an order, custom toran size, or bulk gifting? Reach out to our customer care team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards (1 Col) */}
        <div className="space-y-4">
          <div className="p-5 bg-white rounded-3xl border border-earth-100 shadow-card space-y-2">
            <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-terracotta">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-earth-900">Email Us</h3>
            <p className="text-xs text-earth-600">We respond within 24 hours</p>
            <a
              href="mailto:support@rouniyardecor.com"
              className="block text-xs font-bold text-terracotta hover:underline"
            >
              support@rouniyardecor.com
            </a>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-earth-100 shadow-card space-y-2">
            <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-terracotta">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-earth-900">Call / WhatsApp</h3>
            <p className="text-xs text-earth-600">Mon - Sat (10:00 AM - 7:00 PM IST)</p>
            <a
              href="tel:+919876543210"
              className="block text-xs font-bold text-terracotta hover:underline"
            >
              +91 98765 43210
            </a>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-earth-100 shadow-card space-y-2">
            <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-terracotta">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-earth-900">Handicrafts Studio</h3>
            <p className="text-xs text-earth-600 leading-relaxed">
              Rouniyar Decor Studio, Main Market Road, New Delhi & Gorakhpur, India
            </p>
          </div>
        </div>

        {/* Contact Form (2 Cols) */}
        <div className="lg:col-span-2 p-6 sm:p-8 bg-white rounded-3xl border border-earth-100 shadow-card">
          {submitted ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                ✓
              </div>
              <h3 className="font-serif text-xl font-bold text-earth-900">Message Received!</h3>
              <p className="text-xs text-earth-600 max-w-sm mx-auto">
                Thank you for contacting Rouniyar Decor. Our team will get back to you at {email} within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2 bg-cream-100 text-earth-900 rounded-full text-xs font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-serif text-lg font-bold text-earth-900 pb-2 border-b border-earth-100">
                Send Us a Message
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-earth-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Verma"
                    className="w-full p-2.5 border border-earth-200 rounded-xl focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="block font-bold text-earth-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full p-2.5 border border-earth-200 rounded-xl focus:border-terracotta"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-bold text-earth-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Inquiry regarding Custom Door Size"
                  className="w-full p-2.5 border border-earth-200 rounded-xl focus:border-terracotta"
                />
              </div>

              <div className="text-xs">
                <label className="block font-bold text-earth-700 mb-1">Message *</label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you with our handcrafted decor collections?"
                  className="w-full p-2.5 border border-earth-200 rounded-xl focus:border-terracotta"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
