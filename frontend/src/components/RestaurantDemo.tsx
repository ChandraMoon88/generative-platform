'use client';

import React from 'react';

export default function RestaurantDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center bg-cover bg-center" 
           style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200)'}}>
        <div className="text-center text-white space-y-6 px-4">
          <h1 className="text-7xl font-bold mb-4">Bella Italia</h1>
          <p className="text-2xl mb-8">Authentic Italian Cuisine in the Heart of the City</p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105">
            Reserve Your Table
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-6xl mx-auto py-20 px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-gray-800">Our Story</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              Since 1985, Bella Italia has been serving authentic Italian cuisine crafted with passion and tradition. 
              Our recipes have been passed down through generations, bringing the taste of Italy to your table.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Every dish is prepared with the finest ingredients, imported directly from Italy, ensuring an 
              unforgettable dining experience.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🍝</div>
                <div>
                  <h3 className="font-bold text-xl">Fresh Pasta Daily</h3>
                  <p className="text-gray-600">Handmade every morning</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-4xl">🍕</div>
                <div>
                  <h3 className="font-bold text-xl">Wood-Fired Pizza</h3>
                  <p className="text-gray-600">Traditional stone oven</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-4xl">🍷</div>
                <div>
                  <h3 className="font-bold text-xl">Italian Wines</h3>
                  <p className="text-gray-600">Curated selection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Highlights */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Signature Dishes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Spaghetti Carbonara', price: '$24', desc: 'Creamy pasta with pancetta and parmesan', emoji: '🍝' },
              { name: 'Margherita Pizza', price: '$22', desc: 'Classic tomato, mozzarella, and basil', emoji: '🍕' },
              { name: 'Tiramisu', price: '$12', desc: 'Traditional Italian coffee dessert', emoji: '🍰' }
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
                <div className="text-6xl mb-4">{item.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4">{item.desc}</p>
                <div className="text-3xl font-bold text-red-600">{item.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">What Our Guests Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Sarah M.', rating: '⭐⭐⭐⭐⭐', review: 'Best Italian food outside of Italy! Absolutely amazing!' },
            { name: 'John D.', rating: '⭐⭐⭐⭐⭐', review: 'The pasta is incredible. You can taste the authenticity in every bite.' },
            { name: 'Emma L.', rating: '⭐⭐⭐⭐⭐', review: 'Perfect ambiance and outstanding service. Highly recommend!' }
          ].map((testimonial, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-2xl mb-3">{testimonial.rating}</div>
              <p className="text-gray-600 italic mb-4">"{testimonial.review}"</p>
              <p className="font-bold text-gray-800">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact/Footer */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Visit Us</h2>
          <p className="text-xl mb-2">📍 123 Italian Street, Downtown</p>
          <p className="text-xl mb-2">📞 (555) 123-4567</p>
          <p className="text-xl mb-8">🕐 Open Daily: 11am - 11pm</p>
          <div className="flex justify-center gap-6 text-3xl">
            <a href="#" className="hover:text-red-500 transition-colors">📘</a>
            <a href="#" className="hover:text-red-500 transition-colors">📷</a>
            <a href="#" className="hover:text-red-500 transition-colors">🐦</a>
          </div>
        </div>
      </div>
    </div>
  );
}
