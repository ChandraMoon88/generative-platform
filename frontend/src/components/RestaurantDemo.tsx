'use client';

import React from 'react';

export default function EnvironmentDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Hero Section - Magical Landing */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden" 
           style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'}}>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-40 right-32 w-48 h-48 bg-pink-300 rounded-full opacity-20 animate-pulse delay-75"></div>
          <div className="absolute top-60 right-20 w-24 h-24 bg-blue-300 rounded-full opacity-20 animate-pulse delay-150"></div>
        </div>
        <div className="relative text-center text-white space-y-8 px-4 z-10">
          <div className="text-8xl mb-6 animate-bounce">✨</div>
          <h1 className="text-8xl font-bold mb-6 drop-shadow-2xl">Dream Canvas</h1>
          <p className="text-3xl mb-8 opacity-90">Where Imagination Becomes Reality</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl px-8 py-4 text-xl">
              🎨 Create Beautiful Spaces
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl px-8 py-4 text-xl">
              🌟 Express Your Style
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl px-8 py-4 text-xl">
              💫 Build Your Vision
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cards Section */}
      <div className="max-w-7xl mx-auto py-24 px-4">
        <h2 className="text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Every Space Tells a Story
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: 'Vibrant Energy', 
              desc: 'Bold colors that spark joy and creativity',
              gradient: 'from-orange-400 to-pink-500',
              icon: '🔥'
            },
            { 
              title: 'Peaceful Harmony', 
              desc: 'Soft tones that calm and inspire',
              gradient: 'from-blue-400 to-cyan-300',
              icon: '🌊'
            },
            { 
              title: 'Natural Wonder', 
              desc: 'Earth tones that ground and balance',
              gradient: 'from-green-400 to-teal-500',
              icon: '🌿'
            }
          ].map((item, i) => (
            <div key={i} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-3xl opacity-75 group-hover:opacity-100 transition-opacity blur-xl`}></div>
              <div className="relative bg-white rounded-3xl p-8 transform group-hover:scale-105 transition-all shadow-2xl">
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Elements Showcase */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-12 text-white">Design Your Perfect Space</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Color Palette Card */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">🎨 Choose Your Palette</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-400 to-pink-500 shadow-lg hover:scale-110 transition-transform cursor-pointer"></div>
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg hover:scale-110 transition-transform cursor-pointer"></div>
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg hover:scale-110 transition-transform cursor-pointer"></div>
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg hover:scale-110 transition-transform cursor-pointer"></div>
                </div>
                <p className="text-gray-600">Every color creates a different mood and feeling</p>
              </div>
            </div>

            {/* Layout Card */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">📐 Shape Your Layout</h3>
              <div className="space-y-3">
                <div className="h-12 bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl"></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-20 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-xl"></div>
                  <div className="h-20 bg-gradient-to-br from-green-200 to-emerald-200 rounded-xl"></div>
                </div>
                <p className="text-gray-600">Arrange elements exactly how you imagine</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Carousel */}
      <div className="max-w-7xl mx-auto py-24 px-4">
        <h2 className="text-5xl font-bold text-center mb-16 text-gray-800">What You'll Create</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { emoji: '🏡', title: 'Welcoming Spaces', desc: 'First impressions that wow' },
            { emoji: '🎭', title: 'Unique Personalities', desc: 'Designs that reflect you' },
            { emoji: '🌈', title: 'Colorful Journeys', desc: 'Visual stories that engage' },
            { emoji: '💎', title: 'Polished Details', desc: 'Professional finishing touches' }
          ].map((item, i) => (
            <div key={i} className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="text-5xl mb-4">{item.emoji}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Examples Gallery */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 text-gray-800">Endless Possibilities</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: 'Sunset Vibes', 
                colors: ['#FF6B6B', '#FFA500', '#FFD700'],
                desc: 'Warm and inviting'
              },
              { 
                name: 'Ocean Dreams', 
                colors: ['#4A90E2', '#50C878', '#00CED1'],
                desc: 'Cool and refreshing'
              },
              { 
                name: 'Forest Magic', 
                colors: ['#228B22', '#32CD32', '#90EE90'],
                desc: 'Natural and grounding'
              }
            ].map((theme, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 hover:shadow-xl transition-all">
                <div className="flex gap-2 mb-4">
                  {theme.colors.map((color, j) => (
                    <div key={j} className="flex-1 h-24 rounded-xl" style={{ backgroundColor: color }}></div>
                  ))}
                </div>
                <h3 className="text-2xl font-bold mb-2">{theme.name}</h3>
                <p className="text-gray-600 text-lg">{theme.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="text-7xl mb-6">🚀</div>
          <h2 className="text-5xl font-bold text-white mb-6">Ready to Create?</h2>
          <p className="text-2xl text-white mb-10 opacity-90">
            Your imagination is the only limit. Let's start building!
          </p>
          <div className="flex justify-center gap-6 text-4xl">
            <span className="animate-bounce">✨</span>
            <span className="animate-bounce delay-75">🎨</span>
            <span className="animate-bounce delay-150">🌟</span>
            <span className="animate-bounce delay-200">💫</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
