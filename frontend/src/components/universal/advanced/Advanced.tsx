import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// AUTH, PAYMENT, MAPS, DRAG & DROP COMPONENTS
// ============================================================================

// ===== AUTHENTICATION COMPONENTS =====

// 1. LoginForm - Complete login with validation
export const LoginForm: React.FC<{
  onSubmit?: (email: string, password: string) => void;
  allowSocialAuth?: boolean;
  showForgotPassword?: boolean;
  showSignup?: boolean;
  className?: string;
}> = ({ onSubmit, allowSocialAuth = true, showForgotPassword = true, showSignup = true, className = '' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(email, password);
    window.dispatchEvent(new CustomEvent('componentInteraction', {
      detail: { component: 'LoginForm', action: 'submit', email }
    }));
  };

  return (
    <div className={`login-form bg-white p-6 rounded-lg shadow-lg max-w-md ${className}`}>
      <h2 className="text-2xl font-bold mb-6">Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded mb-4"
          required
        />
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        {showForgotPassword && (
          <div className="text-right mb-4">
            <button type="button" className="text-blue-600 text-sm hover:underline">
              Forgot Password?
            </button>
          </div>
        )}
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700">
          Sign In
        </button>
      </form>
      {allowSocialAuth && (
        <div className="mt-6">
          <div className="text-center text-gray-500 mb-4">Or continue with</div>
          <div className="flex gap-2">
            <button className="flex-1 p-3 border rounded hover:bg-gray-50">Google</button>
            <button className="flex-1 p-3 border rounded hover:bg-gray-50">GitHub</button>
            <button className="flex-1 p-3 border rounded hover:bg-gray-50">Apple</button>
          </div>
        </div>
      )}
      {showSignup && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <button className="text-blue-600 hover:underline">Sign up</button>
        </div>
      )}
    </div>
  );
};

// 2. TwoFactorAuth - 2FA verification
export const TwoFactorAuth: React.FC<{
  codeLength?: number;
  onVerify?: (code: string) => void;
  onResend?: () => void;
  className?: string;
}> = ({ codeLength = 6, onVerify, onResend, className = '' }) => {
  const [code, setCode] = useState<string[]>(Array(codeLength).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(c => c) && newCode.length === codeLength) {
      onVerify?.(newCode.join(''));
      window.dispatchEvent(new CustomEvent('componentInteraction', {
        detail: { component: 'TwoFactorAuth', action: 'verify', codeLength }
      }));
    }
  };

  return (
    <div className={`two-factor-auth bg-white p-6 rounded-lg shadow-lg max-w-md ${className}`}>
      <h2 className="text-2xl font-bold mb-2">Two-Factor Authentication</h2>
      <p className="text-gray-600 mb-6">Enter the 6-digit code sent to your device</p>
      <div className="flex gap-2 justify-center mb-6">
        {code.map((digit, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el; }}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            className="w-12 h-12 text-center text-2xl font-bold border-2 rounded focus:border-blue-600"
          />
        ))}
      </div>
      <button onClick={onResend} className="text-blue-600 text-sm hover:underline">
        Didn't receive code? Resend
      </button>
    </div>
  );
};

// ===== PAYMENT COMPONENTS =====

// 3. CreditCardInput - Credit card with validation
export const CreditCardInput: React.FC<{
  onValidate?: (isValid: boolean, cardData: any) => void;
  className?: string;
}> = ({ onValidate, className = '' }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || value;
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value.replace(/\D/g, '').slice(0, 16));
    setCardNumber(formatted);
    
    const isValid = formatted.replace(/\s/g, '').length === 16 && expiry.length === 5 && cvv.length === 3;
    onValidate?.(isValid, { cardNumber: formatted, expiry, cvv, name });
  };

  return (
    <div className={`credit-card-input bg-white p-6 rounded-lg shadow-lg ${className}`}>
      <div className="mb-4">
        <div className="credit-card-preview bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-lg text-white mb-4">
          <div className="text-xs mb-4">CREDIT CARD</div>
          <div className="text-lg font-mono tracking-wider mb-4">{cardNumber || '•••• •••• •••• ••••'}</div>
          <div className="flex justify-between">
            <div>
              <div className="text-xs opacity-70">CARD HOLDER</div>
              <div className="font-semibold">{name || 'YOUR NAME'}</div>
            </div>
            <div>
              <div className="text-xs opacity-70">EXPIRES</div>
              <div className="font-semibold">{expiry || 'MM/YY'}</div>
            </div>
          </div>
        </div>
      </div>
      <input
        type="text"
        placeholder="Card Number"
        value={cardNumber}
        onChange={(e) => handleCardNumberChange(e.target.value)}
        className="w-full p-3 border rounded mb-3"
      />
      <input
        type="text"
        placeholder="Cardholder Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 border rounded mb-3"
      />
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="MM/YY"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d{0,2})/, '$1/$2'))}
          className="flex-1 p-3 border rounded"
          maxLength={5}
        />
        <input
          type="text"
          placeholder="CVV"
          value={cvv}
          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
          className="w-24 p-3 border rounded"
          maxLength={3}
        />
      </div>
    </div>
  );
};

// 4. CheckoutFlow - Multi-step checkout
export const CheckoutFlow: React.FC<{
  steps?: string[];
  total: number;
  onComplete?: (data: any) => void;
  className?: string;
}> = ({ steps = ['Cart', 'Shipping', 'Payment', 'Review'], total, onComplete, className = '' }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.dispatchEvent(new CustomEvent('componentInteraction', {
        detail: { component: 'CheckoutFlow', action: 'nextStep', step: currentStep + 1 }
      }));
    } else {
      onComplete?.({});
    }
  };

  return (
    <div className={`checkout-flow ${className}`}>
      <div className="flex mb-8">
        {steps.map((step, i) => (
          <div key={i} className="flex-1 flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              i <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              {i + 1}
            </div>
            <div className="flex-1 text-sm ml-2">{step}</div>
            {i < steps.length - 1 && <div className="flex-1 h-0.5 bg-gray-200 mx-2" />}
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow mb-4 min-h-64">
        <h3 className="text-xl font-bold mb-4">{steps[currentStep]}</h3>
        <div className="text-gray-600">Step {currentStep + 1} content...</div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">Total: ${total.toFixed(2)}</div>
        <div className="flex gap-2">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-2 border rounded hover:bg-gray-50"
            >
              Back
            </button>
          )}
          <button onClick={handleNext} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {currentStep === steps.length - 1 ? 'Complete Order' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ===== MAP COMPONENTS =====

// 5. InteractiveMap - Map with markers and interactions
export const InteractiveMap: React.FC<{
  center?: [number, number];
  zoom?: number;
  markers?: Array<{ lat: number; lng: number; label?: string }>;
  onMarkerClick?: (marker: any) => void;
  className?: string;
}> = ({ center = [0, 0], zoom = 10, markers = [], onMarkerClick, className = '' }) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setMapLoaded(true), 500);
    window.dispatchEvent(new CustomEvent('componentInteraction', {
      detail: { component: 'InteractiveMap', action: 'load', center, zoom, markerCount: markers.length }
    }));
  }, [center, zoom, markers.length]);

  return (
    <div className={`interactive-map bg-gray-200 rounded-lg overflow-hidden ${className}`} style={{ height: 400 }}>
      {mapLoaded ? (
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-blue-200" />
          {markers.map((marker, i) => (
            <div
              key={i}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${50 + (marker.lng * 5)}%`, top: `${50 - (marker.lat * 5)}%` }}
              onClick={() => onMarkerClick?.(marker)}
            >
              <div className="text-2xl">📍</div>
              {marker.label && <div className="text-xs bg-white px-2 py-1 rounded shadow">{marker.label}</div>}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">Loading map...</div>
      )}
    </div>
  );
};

// ===== DRAG & DROP COMPONENTS =====

// 6. DragDropList - Sortable drag & drop list
export const DragDropList: React.FC<{
  items: Array<{ id: string; content: React.ReactNode }>;
  onReorder?: (newOrder: string[]) => void;
  className?: string;
}> = ({ items, onReorder, className = '' }) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [itemOrder, setItemOrder] = useState(items.map(i => i.id));

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const newOrder = [...itemOrder];
    const draggedIndex = newOrder.indexOf(draggedItem);
    const targetIndex = newOrder.indexOf(targetId);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);

    setItemOrder(newOrder);
    onReorder?.(newOrder);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    window.dispatchEvent(new CustomEvent('componentInteraction', {
      detail: { component: 'DragDropList', action: 'reorder', itemCount: items.length }
    }));
  };

  return (
    <div className={className}>
      {itemOrder.map(id => {
        const item = items.find(i => i.id === id);
        if (!item) return null;
        return (
          <div
            key={id}
            draggable
            onDragStart={() => handleDragStart(id)}
            onDragOver={(e) => handleDragOver(e, id)}
            onDragEnd={handleDragEnd}
            className={`p-4 bg-white border rounded mb-2 cursor-move hover:shadow-md ${
              draggedItem === id ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-gray-400">⋮⋮</div>
              <div className="flex-1">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 7. DropZone - File/content drop zone
export const DropZone: React.FC<{
  onDrop?: (files: FileList) => void;
  acceptedTypes?: string[];
  multiple?: boolean;
  maxSize?: number;
  className?: string;
}> = ({ onDrop, acceptedTypes = ['*'], multiple = true, maxSize, className = '' }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      onDrop?.(e.dataTransfer.files);
      window.dispatchEvent(new CustomEvent('componentInteraction', {
        detail: { component: 'DropZone', action: 'drop', fileCount: e.dataTransfer.files.length }
      }));
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`drop-zone border-2 border-dashed rounded-lg p-12 text-center ${
        isDragging ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
      } ${className}`}
    >
      <div className="text-4xl mb-4">📁</div>
      <div className="text-lg font-semibold mb-2">
        {isDragging ? 'Drop files here' : 'Drag & drop files here'}
      </div>
      <div className="text-sm text-gray-500">
        {acceptedTypes.join(', ')} • {multiple ? 'Multiple files' : 'Single file'} 
        {maxSize && ` • Max ${maxSize}MB`}
      </div>
    </div>
  );
};
