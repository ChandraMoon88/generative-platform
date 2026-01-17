/**
 * Industry-Specific Components
 * Healthcare, Finance, Education, E-commerce, Real Estate, Legal
 */

'use client';

import React, { useState } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

// ========== HEALTHCARE: APPOINTMENT SCHEDULER ==========
export function AppointmentScheduler({
  id,
  doctors,
  onBookAppointment,
}: {
  id: string;
  doctors: Array<{ id: string; name: string; specialty: string; availableSlots: Date[] }>;
  onBookAppointment: (doctorId: string, slot: Date, notes: string) => void;
}) {
  const { track } = useEventTracking('AppointmentScheduler', id);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');

  const doctor = doctors.find((d) => d.id === selectedDoctor);

  const handleBooking = () => {
    if (!selectedDoctor || !selectedSlot) return;

    track('book_appointment', selectedDoctor, { slot: selectedSlot.toISOString() });
    onBookAppointment(selectedDoctor, selectedSlot, notes);
    setSelectedDoctor(null);
    setSelectedSlot(null);
    setNotes('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Book Appointment</h2>

      {/* Doctor Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Doctor</label>
        <div className="grid grid-cols-2 gap-2">
          {doctors.map((doc) => (
            <button
              key={doc.id}
              onClick={() => {
                setSelectedDoctor(doc.id);
                setSelectedSlot(null);
                track('select_doctor', doc.id);
              }}
              className={`p-3 border rounded-lg text-left ${
                selectedDoctor === doc.id ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="font-medium">{doc.name}</div>
              <div className="text-sm text-gray-600">{doc.specialty}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Slot Selection */}
      {doctor && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Available Times</label>
          <div className="grid grid-cols-3 gap-2">
            {doctor.availableSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedSlot(slot);
                  track('select_slot', slot.toISOString());
                }}
                className={`px-3 py-2 border rounded ${
                  selectedSlot?.getTime() === slot.getTime()
                    ? 'border-blue-500 bg-blue-50'
                    : ''
                }`}
              >
                {slot.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Reason for visit, symptoms, etc."
          rows={3}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <button
        onClick={handleBooking}
        disabled={!selectedDoctor || !selectedSlot}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Book Appointment
      </button>
    </div>
  );
}

// ========== FINANCE: STOCK TICKER ==========
export function StockTicker({
  id,
  stocks,
  onStockClick,
}: {
  id: string;
  stocks: Array<{
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
  }>;
  onStockClick?: (symbol: string) => void;
}) {
  const { track } = useEventTracking('StockTicker', id);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex overflow-x-auto gap-4 pb-2">
        {stocks.map((stock) => (
          <button
            key={stock.symbol}
            onClick={() => {
              track('stock_click', stock.symbol);
              onStockClick?.(stock.symbol);
            }}
            className="flex-shrink-0 p-3 border rounded-lg hover:border-blue-500 transition-colors min-w-[150px]"
          >
            <div className="font-bold text-lg">{stock.symbol}</div>
            <div className="text-xl font-semibold">${stock.price.toFixed(2)}</div>
            <div
              className={`text-sm ${
                stock.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)} (
              {Math.abs(stock.changePercent).toFixed(2)}%)
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ========== EDUCATION: COURSE PLAYER ==========
export function CoursePlayer({
  id,
  lessons,
  currentLesson,
  onLessonComplete,
  onNavigate,
}: {
  id: string;
  lessons: Array<{
    id: string;
    title: string;
    duration: number;
    completed: boolean;
    type: 'video' | 'quiz' | 'reading';
  }>;
  currentLesson: number;
  onLessonComplete: (lessonId: string) => void;
  onNavigate: (lessonIndex: number) => void;
}) {
  const { track } = useEventTracking('CoursePlayer', id);
  const lesson = lessons[currentLesson];

  const handleComplete = () => {
    track('complete_lesson', lesson.id);
    onLessonComplete(lesson.id);
  };

  const progress = (lessons.filter((l) => l.completed).length / lessons.length) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Progress */}
      <div className="h-2 bg-gray-200">
        <div
          className="h-full bg-green-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 p-6">
        {/* Sidebar - Lesson List */}
        <div className="border-r pr-4">
          <h3 className="font-semibold mb-4">Course Content</h3>
          <div className="space-y-2">
            {lessons.map((l, index) => (
              <button
                key={l.id}
                onClick={() => {
                  track('navigate_lesson', l.id);
                  onNavigate(index);
                }}
                className={`w-full text-left p-2 rounded ${
                  index === currentLesson ? 'bg-blue-50 border-blue-500' : ''
                } ${l.completed ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {l.completed ? '✅' : l.type === 'video' ? '🎥' : l.type === 'quiz' ? '📝' : '📖'}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{l.title}</div>
                    <div className="text-xs text-gray-500">{l.duration} min</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-2">
          <h2 className="text-2xl font-bold mb-4">{lesson.title}</h2>

          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center mb-4">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-2">
                {lesson.type === 'video' ? '▶️' : lesson.type === 'quiz' ? '❓' : '📄'}
              </div>
              <div>Lesson Content ({lesson.type})</div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => onNavigate(currentLesson - 1)}
              disabled={currentLesson === 0}
              className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              ← Previous
            </button>

            {!lesson.completed && (
              <button
                onClick={handleComplete}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Mark Complete
              </button>
            )}

            <button
              onClick={() => onNavigate(currentLesson + 1)}
              disabled={currentLesson === lessons.length - 1}
              className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== E-COMMERCE: PRODUCT CONFIGURATOR ==========
export function ProductConfigurator({
  id,
  product,
  options,
  onAddToCart,
}: {
  id: string;
  product: { name: string; basePrice: number; image: string };
  options: Array<{
    id: string;
    name: string;
    choices: Array<{ id: string; label: string; price: number }>;
  }>;
  onAddToCart: (config: Record<string, string>) => void;
}) {
  const { track } = useEventTracking('ProductConfigurator', id);
  const [config, setConfig] = useState<Record<string, string>>({});

  const totalPrice =
    product.basePrice +
    options.reduce((sum, option) => {
      const choice = option.choices.find((c) => c.id === config[option.id]);
      return sum + (choice?.price || 0);
    }, 0);

  const handleOptionChange = (optionId: string, choiceId: string) => {
    track('configure_option', optionId, { choice: choiceId });
    setConfig({ ...config, [optionId]: choiceId });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Preview */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <div className="text-6xl">{product.image}</div>
          </div>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <div className="text-3xl font-bold text-blue-600 mt-2">
            ${totalPrice.toFixed(2)}
          </div>
        </div>

        {/* Configuration */}
        <div>
          <h3 className="font-semibold mb-4">Customize Your Product</h3>
          <div className="space-y-4">
            {options.map((option) => (
              <div key={option.id}>
                <label className="block text-sm font-medium mb-2">{option.name}</label>
                <div className="grid grid-cols-2 gap-2">
                  {option.choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => handleOptionChange(option.id, choice.id)}
                      className={`p-3 border rounded-lg text-left ${
                        config[option.id] === choice.id ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                    >
                      <div className="font-medium">{choice.label}</div>
                      {choice.price > 0 && (
                        <div className="text-sm text-gray-600">+${choice.price}</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              track('add_to_cart', null, { config, totalPrice });
              onAddToCart(config);
            }}
            disabled={options.some((o) => !config[o.id])}
            className="w-full mt-6 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-lg font-semibold"
          >
            Add to Cart - ${totalPrice.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== REAL ESTATE: PROPERTY VIEWER ==========
export function PropertyViewer({
  id,
  property,
  onScheduleTour,
  onContact,
}: {
  id: string;
  property: {
    id: string;
    title: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    images: string[];
    description: string;
    features: string[];
  };
  onScheduleTour: () => void;
  onContact: () => void;
}) {
  const { track } = useEventTracking('PropertyViewer', id);
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image Gallery */}
      <div className="relative h-96 bg-gray-900">
        <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
          {property.images[currentImage]}
        </div>

        {property.images.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentImage((currentImage - 1 + property.images.length) % property.images.length)
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentImage((currentImage + 1) % property.images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center"
            >
              ›
            </button>
          </>
        )}

        {/* Thumbnails */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {property.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentImage ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Price & Title */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{property.title}</h2>
            <div className="text-3xl font-bold text-blue-600 mt-2">
              ${property.price.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-6 mb-4 pb-4 border-b">
          <div>
            <div className="text-2xl font-bold">{property.bedrooms}</div>
            <div className="text-sm text-gray-600">Bedrooms</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{property.bathrooms}</div>
            <div className="text-sm text-gray-600">Bathrooms</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{property.sqft.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Sq Ft</div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-700">{property.description}</p>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Features</h3>
          <div className="grid grid-cols-2 gap-2">
            {property.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              track('schedule_tour', property.id);
              onScheduleTour();
            }}
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
          >
            Schedule Tour
          </button>
          <button
            onClick={() => {
              track('contact_agent', property.id);
              onContact();
            }}
            className="flex-1 px-4 py-3 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 font-semibold"
          >
            Contact Agent
          </button>
        </div>
      </div>
    </div>
  );
}
