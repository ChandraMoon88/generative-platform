import React, { useRef, useEffect, useState } from 'react';

// ============================================================================
// ADVANCED LAYOUT & EFFECTS - Masonry, Grids, Particles, Shaders, Filters
// ============================================================================

// 1. MasonryGrid - Pinterest-style masonry layout
export const MasonryGrid: React.FC<{
  items: any[];
  columns?: number;
  gap?: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  className?: string;
}> = ({ items, columns = 3, gap = 16, renderItem, className = '' }) => {
  const [columnHeights, setColumnHeights] = useState<number[]>(Array(columns).fill(0));

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('componentInteraction', {
      detail: { component: 'MasonryGrid', action: 'render', items: items.length, columns }
    }));
  }, [items, columns]);

  return (
    <div className={`masonry-grid ${className}`} style={{ position: 'relative' }}>
      {items.map((item, index) => {
        const columnIndex = index % columns;
        return (
          <div
            key={index}
            style={{
              width: `calc((100% - ${gap * (columns - 1)}px) / ${columns})`,
              marginBottom: gap,
              display: 'inline-block',
              verticalAlign: 'top',
              marginLeft: columnIndex > 0 ? gap : 0
            }}
          >
            {renderItem(item, index)}
          </div>
        );
      })}
    </div>
  );
};

// 2. ResponsiveGrid - Auto-responsive grid with breakpoints
export const ResponsiveGrid: React.FC<{
  children: React.ReactNode;
  minColumnWidth?: number;
  gap?: number;
  autoFit?: boolean;
  className?: string;
}> = ({ children, minColumnWidth = 250, gap = 16, autoFit = true, className = '' }) => {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: autoFit
          ? `repeat(auto-fit, minmax(${minColumnWidth}px, 1fr))`
          : `repeat(auto-fill, minmax(${minColumnWidth}px, 1fr))`,
        gap,
      }}
      onClick={() => {
        window.dispatchEvent(new CustomEvent('componentInteraction', {
          detail: { component: 'ResponsiveGrid', action: 'interact', minColumnWidth }
        }));
      }}
    >
      {children}
    </div>
  );
};

// 3. StickyContainer - Sticky positioning with scroll effects
export const StickyContainer: React.FC<{
  children: React.ReactNode;
  top?: number;
  zIndex?: number;
  onStick?: (stuck: boolean) => void;
  className?: string;
}> = ({ children, top = 0, zIndex = 100, onStick, className = '' }) => {
  const [isStuck, setIsStuck] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const stuck = entry.intersectionRatio < 1;
        setIsStuck(stuck);
        onStick?.(stuck);
        if (stuck) {
          window.dispatchEvent(new CustomEvent('componentInteraction', {
            detail: { component: 'StickyContainer', action: 'stick', top }
          }));
        }
      },
      { threshold: [1] }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [top, onStick]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: 'sticky',
        top,
        zIndex,
        backgroundColor: isStuck ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: isStuck ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      {children}
    </div>
  );
};

// 4. ParticleBackground - Animated particle background
export const ParticleBackground: React.FC<{
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  connectDistance?: number;
  showConnections?: boolean;
  className?: string;
}> = ({ 
  count = 50, 
  color = '#4f46e5', 
  size = 3, 
  speed = 0.5,
  connectDistance = 150,
  showConnections = true,
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Initialize particles
    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
      }));
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        if (showConnections) {
          particlesRef.current.slice(i + 1).forEach(other => {
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectDistance) {
              ctx.strokeStyle = color + Math.floor((1 - distance / connectDistance) * 255).toString(16).padStart(2, '0');
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          });
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    window.dispatchEvent(new CustomEvent('componentInteraction', {
      detail: { component: 'ParticleBackground', action: 'start', count, speed }
    }));

    return () => cancelAnimationFrame(animationId);
  }, [count, color, size, speed, connectDistance, showConnections]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'absolute', inset: 0, zIndex: -1 }}
    />
  );
};

// 5. BlurEffect - Backdrop blur with glassmorphism
export const BlurEffect: React.FC<{
  blur?: number;
  brightness?: number;
  saturation?: number;
  opacity?: number;
  children: React.ReactNode;
  className?: string;
}> = ({ blur = 10, brightness = 1.1, saturation = 1.2, opacity = 0.9, children, className = '' }) => {
  return (
    <div
      className={className}
      style={{
        backdropFilter: `blur(${blur}px) brightness(${brightness}) saturate(${saturation})`,
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
        borderRadius: 12,
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}
      onClick={() => {
        window.dispatchEvent(new CustomEvent('componentInteraction', {
          detail: { component: 'BlurEffect', action: 'interact', blur }
        }));
      }}
    >
      {children}
    </div>
  );
};

// 6. GradientBackground - Animated gradient backgrounds
export const GradientBackground: React.FC<{
  colors?: string[];
  angle?: number;
  animate?: boolean;
  speed?: number;
  className?: string;
}> = ({ colors = ['#4f46e5', '#7c3aed', '#ec4899'], angle = 45, animate = true, speed = 5, className = '' }) => {
  const [currentAngle, setCurrentAngle] = useState(angle);

  useEffect(() => {
    if (!animate) return;

    const interval = setInterval(() => {
      setCurrentAngle(prev => (prev + 1) % 360);
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [animate, speed]);

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(${currentAngle}deg, ${colors.join(', ')})`,
        transition: animate ? 'background 0.5s ease' : 'none',
        zIndex: -1,
      }}
      onClick={() => {
        window.dispatchEvent(new CustomEvent('componentInteraction', {
          detail: { component: 'GradientBackground', action: 'interact', angle: currentAngle }
        }));
      }}
    />
  );
};

// 7. ShaderEffect - CSS shader effects (experimental)
export const ShaderEffect: React.FC<{
  type?: 'wave' | 'ripple' | 'glow' | 'distortion';
  intensity?: number;
  color?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ type = 'glow', intensity = 1, color = '#4f46e5', children, className = '' }) => {
  const getFilter = () => {
    switch (type) {
      case 'glow':
        return `drop-shadow(0 0 ${10 * intensity}px ${color})`;
      case 'wave':
        return `hue-rotate(${intensity * 30}deg)`;
      case 'ripple':
        return `blur(${intensity}px)`;
      case 'distortion':
        return `contrast(${1 + intensity * 0.5})`;
      default:
        return 'none';
    }
  };

  return (
    <div
      className={className}
      style={{
        filter: getFilter(),
        transition: 'filter 0.3s ease',
      }}
      onClick={() => {
        window.dispatchEvent(new CustomEvent('componentInteraction', {
          detail: { component: 'ShaderEffect', action: 'apply', type, intensity }
        }));
      }}
    >
      {children}
    </div>
  );
};

// 8. InfiniteScroll - Infinite scrolling with virtual rendering
export const InfiniteScroll: React.FC<{
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  hasMore: boolean;
  onLoadMore: () => void;
  loader?: React.ReactNode;
  threshold?: number;
  className?: string;
}> = ({ items, renderItem, hasMore, onLoadMore, loader, threshold = 200, className = '' }) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore) {
          onLoadMore();
          window.dispatchEvent(new CustomEvent('componentInteraction', {
            detail: { component: 'InfiniteScroll', action: 'loadMore', itemCount: items.length }
          }));
        }
      },
      { rootMargin: `${threshold}px` }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, items.length, threshold]);

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={index}>{renderItem(item, index)}</div>
      ))}
      {hasMore && (
        <div ref={observerRef} className="loading-trigger">
          {loader || <div className="text-center py-4 text-gray-500">Loading more...</div>}
        </div>
      )}
    </div>
  );
};

// 9. FlexLayout - Advanced flexbox layouts with presets
export const FlexLayout: React.FC<{
  direction?: 'row' | 'column';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: number;
  children: React.ReactNode;
  className?: string;
}> = ({ direction = 'row', justify = 'start', align = 'start', wrap = 'nowrap', gap = 0, children, className = '' }) => {
  const justifyMap = {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly',
  };

  const alignMap = {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    stretch: 'stretch',
    baseline: 'baseline',
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: direction,
        justifyContent: justifyMap[justify],
        alignItems: alignMap[align],
        flexWrap: wrap,
        gap,
      }}
      onClick={() => {
        window.dispatchEvent(new CustomEvent('componentInteraction', {
          detail: { component: 'FlexLayout', action: 'interact', direction, justify, align }
        }));
      }}
    >
      {children}
    </div>
  );
};
