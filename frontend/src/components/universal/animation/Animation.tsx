import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// ANIMATION COMPONENTS - Transitions, Springs, Gestures, Parallax, Reveals
// ============================================================================

// 1. Transition - CSS/JS animations with timing
export const Transition: React.FC<{
  show: boolean;
  type?: 'fade' | 'slide' | 'scale' | 'rotate' | 'flip';
  duration?: number;
  delay?: number;
  easing?: string;
  children: React.ReactNode;
  onTransitionEnd?: () => void;
}> = ({ 
  show, 
  type = 'fade', 
  duration = 300, 
  delay = 0,
  easing = 'ease-in-out',
  children,
  onTransitionEnd 
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [animationState, setAnimationState] = useState<'entering' | 'entered' | 'exiting' | 'exited'>('exited');

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      setTimeout(() => setAnimationState('entering'), 10);
      setTimeout(() => {
        setAnimationState('entered');
        window.dispatchEvent(new CustomEvent('componentInteraction', {
          detail: { component: 'Transition', action: 'enter', type, duration }
        }));
      }, delay + duration);
    } else {
      setAnimationState('exiting');
      setTimeout(() => {
        setAnimationState('exited');
        setShouldRender(false);
        onTransitionEnd?.();
        window.dispatchEvent(new CustomEvent('componentInteraction', {
          detail: { component: 'Transition', action: 'exit', type, duration }
        }));
      }, duration);
    }
  }, [show, type, duration, delay, onTransitionEnd]);

  if (!shouldRender) return null;

  const getTransform = () => {
    const isEntering = animationState === 'entering' || animationState === 'entered';
    switch (type) {
      case 'slide':
        return isEntering ? 'translateX(0)' : 'translateX(-100%)';
      case 'scale':
        return isEntering ? 'scale(1)' : 'scale(0.8)';
      case 'rotate':
        return isEntering ? 'rotate(0deg)' : 'rotate(-90deg)';
      case 'flip':
        return isEntering ? 'rotateY(0deg)' : 'rotateY(90deg)';
      default:
        return 'none';
    }
  };

  return (
    <div style={{
      opacity: animationState === 'entered' ? 1 : 0,
      transform: getTransform(),
      transition: `all ${duration}ms ${easing} ${delay}ms`,
    }}>
      {children}
    </div>
  );
};

// 2. SpringAnimation - Physics-based spring animations
export const SpringAnimation: React.FC<{
  value: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
  onUpdate?: (value: number) => void;
  children: (value: number) => React.ReactNode;
}> = ({ value, stiffness = 100, damping = 10, mass = 1, onUpdate, children }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [velocity, setVelocity] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      const spring = -stiffness * (currentValue - value);
      const damper = -damping * velocity;
      const acceleration = (spring + damper) / mass;
      
      const newVelocity = velocity + acceleration * 0.016;
      const newValue = currentValue + newVelocity * 0.016;
      
      setVelocity(newVelocity);
      setCurrentValue(newValue);
      onUpdate?.(newValue);

      if (Math.abs(newVelocity) > 0.01 || Math.abs(newValue - value) > 0.01) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentValue(value);
        setVelocity(0);
        window.dispatchEvent(new CustomEvent('componentInteraction', {
          detail: { component: 'SpringAnimation', action: 'settle', finalValue: value }
        }));
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [value, currentValue, velocity, stiffness, damping, mass, onUpdate]);

  return <>{children(currentValue)}</>;
};

// 3. ParallaxScroll - Parallax scrolling effects
export const ParallaxScroll: React.FC<{
  speed?: number;
  direction?: 'vertical' | 'horizontal';
  children: React.ReactNode;
  className?: string;
}> = ({ speed = 0.5, direction = 'vertical', children, className = '' }) => {
  const [offset, setOffset] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;
      const rect = elementRef.current.getBoundingClientRect();
      const scrolled = window.pageYOffset + rect.top - window.innerHeight;
      setOffset(scrolled * speed);
      
      window.dispatchEvent(new CustomEvent('componentInteraction', {
        detail: { component: 'ParallaxScroll', action: 'scroll', offset: scrolled * speed }
      }));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={elementRef} className={className}>
      <div style={{
        transform: direction === 'vertical' 
          ? `translateY(${offset}px)` 
          : `translateX(${offset}px)`,
        willChange: 'transform'
      }}>
        {children}
      </div>
    </div>
  );
};

// 4. RevealOnScroll - Reveal elements when they enter viewport
export const RevealOnScroll: React.FC<{
  animation?: 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoom';
  threshold?: number;
  delay?: number;
  children: React.ReactNode;
  className?: string;
}> = ({ animation = 'fade', threshold = 0.1, delay = 0, children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
            window.dispatchEvent(new CustomEvent('componentInteraction', {
              detail: { component: 'RevealOnScroll', action: 'reveal', animation }
            }));
          }, delay);
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, delay, animation]);

  const getInitialStyle = () => {
    switch (animation) {
      case 'slideUp': return { transform: 'translateY(50px)', opacity: 0 };
      case 'slideDown': return { transform: 'translateY(-50px)', opacity: 0 };
      case 'slideLeft': return { transform: 'translateX(50px)', opacity: 0 };
      case 'slideRight': return { transform: 'translateX(-50px)', opacity: 0 };
      case 'zoom': return { transform: 'scale(0.8)', opacity: 0 };
      default: return { opacity: 0 };
    }
  };

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        ...(!isVisible ? getInitialStyle() : { transform: 'none', opacity: 1 }),
        transition: 'all 0.6s ease-out',
      }}
    >
      {children}
    </div>
  );
};

// 5. GestureHandler - Touch/mouse gesture detection
export const GestureHandler: React.FC<{
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onRotate?: (angle: number) => void;
  threshold?: number;
  children: React.ReactNode;
  className?: string;
}> = ({ 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp, 
  onSwipeDown,
  onPinch,
  onRotate,
  threshold = 50,
  children,
  className = '' 
}) => {
  const startPos = useRef({ x: 0, y: 0 });
  const [touches, setTouches] = useState<React.Touch[]>([]);
  const initialDistance = useRef(0);
  const initialAngle = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      initialDistance.current = Math.sqrt(dx * dx + dy * dy);
      initialAngle.current = Math.atan2(dy, dx) * 180 / Math.PI;
    }
    setTouches(Array.from(e.touches));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touches.length === 2) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      
      // Pinch
      const distance = Math.sqrt(dx * dx + dy * dy);
      const scale = distance / initialDistance.current;
      onPinch?.(scale);
      
      // Rotate
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const rotation = angle - initialAngle.current;
      onRotate?.(rotation);
      
      window.dispatchEvent(new CustomEvent('componentInteraction', {
        detail: { component: 'GestureHandler', action: 'multitouch', scale, rotation }
      }));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touches.length === 1) {
      const endPos = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      const dx = endPos.x - startPos.current.x;
      const dy = endPos.y - startPos.current.y;

      if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0) {
            onSwipeRight?.();
            window.dispatchEvent(new CustomEvent('componentInteraction', {
              detail: { component: 'GestureHandler', action: 'swipe', direction: 'right' }
            }));
          } else {
            onSwipeLeft?.();
            window.dispatchEvent(new CustomEvent('componentInteraction', {
              detail: { component: 'GestureHandler', action: 'swipe', direction: 'left' }
            }));
          }
        } else {
          if (dy > 0) {
            onSwipeDown?.();
            window.dispatchEvent(new CustomEvent('componentInteraction', {
              detail: { component: 'GestureHandler', action: 'swipe', direction: 'down' }
            }));
          } else {
            onSwipeUp?.();
            window.dispatchEvent(new CustomEvent('componentInteraction', {
              detail: { component: 'GestureHandler', action: 'swipe', direction: 'up' }
            }));
          }
        }
      }
    }
    setTouches([]);
  };

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    >
      {children}
    </div>
  );
};

// 6. Morphing - Shape morphing animations
export const Morphing: React.FC<{
  from: string;
  to: string;
  duration?: number;
  easing?: string;
  trigger?: boolean;
  className?: string;
}> = ({ from, to, duration = 1000, easing = 'ease-in-out', trigger = false, className = '' }) => {
  const [currentPath, setCurrentPath] = useState(from);

  useEffect(() => {
    if (trigger) {
      setCurrentPath(to);
      window.dispatchEvent(new CustomEvent('componentInteraction', {
        detail: { component: 'Morphing', action: 'morph', from, to }
      }));
    } else {
      setCurrentPath(from);
    }
  }, [trigger, from, to]);

  return (
    <svg className={className} viewBox="0 0 100 100">
      <path
        d={currentPath}
        fill="currentColor"
        style={{
          transition: `d ${duration}ms ${easing}`,
        }}
      />
    </svg>
  );
};

// 7. Keyframe - Custom keyframe animations
export const Keyframe: React.FC<{
  keyframes: { [key: string]: React.CSSProperties }[];
  duration?: number;
  iterations?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate';
  children: React.ReactNode;
  className?: string;
}> = ({ keyframes, duration = 1000, iterations = 1, direction = 'normal', children, className = '' }) => {
  const [animationName] = useState(`keyframe-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const style = document.createElement('style');
    const keyframeRule = `
      @keyframes ${animationName} {
        ${keyframes.map((kf, i) => {
          const percentage = (i / (keyframes.length - 1)) * 100;
          const styles = Object.entries(kf).map(([k, v]) => 
            `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`
          ).join('; ');
          return `${percentage}% { ${styles} }`;
        }).join('\n')}
      }
    `;
    style.innerHTML = keyframeRule;
    document.head.appendChild(style);

    window.dispatchEvent(new CustomEvent('componentInteraction', {
      detail: { component: 'Keyframe', action: 'start', duration, iterations }
    }));

    return () => document.head.removeChild(style);
  }, [keyframes, animationName, duration, iterations]);

  return (
    <div
      className={className}
      style={{
        animation: `${animationName} ${duration}ms ${direction} ${iterations === 'infinite' ? 'infinite' : iterations}`,
      }}
    >
      {children}
    </div>
  );
};
