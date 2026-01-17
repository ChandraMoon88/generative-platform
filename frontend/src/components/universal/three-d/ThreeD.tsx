import React, { useRef, useEffect, useState } from 'react';

// ============================================================================
// 3D COMPONENTS - Three.js, WebGL, 3D Models, Scenes, Cameras
// ============================================================================

// 1. Scene3D - Basic 3D scene with camera and lighting
export const Scene3D: React.FC<{
  backgroundColor?: string;
  cameraPosition?: [number, number, number];
  enableControls?: boolean;
  children?: React.ReactNode;
  className?: string;
}> = ({ 
  backgroundColor = '#000000', 
  cameraPosition = [0, 0, 5],
  enableControls = true,
  children,
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // WebGL context
    const gl = canvasRef.current.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // Initialize scene
    gl.clearColor(
      parseInt(backgroundColor.slice(1, 3), 16) / 255,
      parseInt(backgroundColor.slice(3, 5), 16) / 255,
      parseInt(backgroundColor.slice(5, 7), 16) / 255,
      1.0
    );
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    setSceneReady(true);

    window.dispatchEvent(new CustomEvent('componentInteraction', {
      detail: { 
        component: 'Scene3D', 
        action: 'initialize', 
        cameraPosition,
        backgroundColor 
      }
    }));

    // Animation loop
    let animationId: number;
    const animate = () => {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationId);
  }, [backgroundColor, cameraPosition]);

  return (
    <div className={className}>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
      {sceneReady && children}
    </div>
  );
};

// 2. Model3D - Load and display 3D models
export const Model3D: React.FC<{
  modelUrl?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  wireframe?: boolean;
  onLoad?: () => void;
  onClick?: () => void;
  className?: string;
}> = ({ 
  modelUrl,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#ffffff',
  wireframe = false,
  onLoad,
  onClick,
  className = '' 
}) => {
  const [loaded, setLoaded] = useState(false);
  const meshRef = useRef<any>(null);

  useEffect(() => {
    // Simulate model loading
    const timer = setTimeout(() => {
      setLoaded(true);
      onLoad?.();
      window.dispatchEvent(new CustomEvent('componentInteraction', {
        detail: { 
          component: 'Model3D', 
          action: 'load', 
          modelUrl,
          position,
          rotation,
          scale
        }
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [modelUrl, position, rotation, scale, onLoad]);

  const handleClick = () => {
    onClick?.();
    window.dispatchEvent(new CustomEvent('componentInteraction', {
      detail: { component: 'Model3D', action: 'click', modelUrl }
    }));
  };

  return (
    <div 
      ref={meshRef}
      className={className}
      onClick={handleClick}
      style={{
        transform: `translate3d(${position[0]}px, ${position[1]}px, ${position[2]}px) 
                    rotateX(${rotation[0]}deg) rotateY(${rotation[1]}deg) rotateZ(${rotation[2]}deg)
                    scale3d(${scale[0]}, ${scale[1]}, ${scale[2]})`,
        transformStyle: 'preserve-3d',
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      {loaded ? (
        <div style={{ 
          width: 100 * scale[0], 
          height: 100 * scale[1], 
          backgroundColor: wireframe ? 'transparent' : color,
          border: wireframe ? `2px solid ${color}` : 'none'
        }}>
          {modelUrl ? '3D Model' : 'Cube'}
        </div>
      ) : (
        <div className="text-gray-400">Loading model...</div>
      )}
    </div>
  );
};

// 3. Camera3D - 3D camera with controls
export const Camera3D: React.FC<{
  type?: 'perspective' | 'orthographic';
  fov?: number;
  near?: number;
  far?: number;
  position?: [number, number, number];
  lookAt?: [number, number, number];
  onPositionChange?: (position: [number, number, number]) => void;
}> = ({ 
  type = 'perspective',
  fov = 75,
  near = 0.1,
  far = 1000,
  position = [0, 0, 5],
  lookAt = [0, 0, 0],
  onPositionChange
}) => {
  const [cameraPos, setCameraPos] = useState(position);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('componentInteraction', {
      detail: { 
        component: 'Camera3D', 
        action: 'configure',
        type,
        fov,
        position: cameraPos,
        lookAt
      }
    }));
  }, [type, fov, cameraPos, lookAt]);

  const updatePosition = (newPos: [number, number, number]) => {
    setCameraPos(newPos);
    onPositionChange?.(newPos);
  };

  return (
    <div className="camera-controls">
      <div className="text-xs text-gray-500">
        Camera: {type} | Position: [{cameraPos.join(', ')}]
      </div>
      <button 
        onClick={() => updatePosition([cameraPos[0], cameraPos[1], cameraPos[2] - 1])}
        className="text-xs px-2 py-1 bg-gray-200 rounded"
      >
        Zoom In
      </button>
      <button 
        onClick={() => updatePosition([cameraPos[0], cameraPos[1], cameraPos[2] + 1])}
        className="text-xs px-2 py-1 bg-gray-200 rounded ml-2"
      >
        Zoom Out
      </button>
    </div>
  );
};

// 4. Light3D - 3D lighting (ambient, directional, point, spot)
export const Light3D: React.FC<{
  type?: 'ambient' | 'directional' | 'point' | 'spot';
  color?: string;
  intensity?: number;
  position?: [number, number, number];
  target?: [number, number, number];
  castShadow?: boolean;
}> = ({ 
  type = 'ambient',
  color = '#ffffff',
  intensity = 1,
  position = [0, 10, 0],
  target = [0, 0, 0],
  castShadow = true
}) => {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('componentInteraction', {
      detail: { 
        component: 'Light3D', 
        action: 'add',
        type,
        color,
        intensity,
        position,
        castShadow
      }
    }));
  }, [type, color, intensity, position, castShadow]);

  return (
    <div className="light-info text-xs text-gray-400">
      {type} light | Intensity: {intensity} | Color: {color}
    </div>
  );
};

// 5. Geometry3D - Basic 3D shapes (cube, sphere, cylinder, plane)
export const Geometry3D: React.FC<{
  type?: 'box' | 'sphere' | 'cylinder' | 'plane' | 'torus' | 'cone';
  size?: [number, number, number];
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  wireframe?: boolean;
  onClick?: () => void;
}> = ({ 
  type = 'box',
  size = [1, 1, 1],
  color = '#4f46e5',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  wireframe = false,
  onClick
}) => {
  const [hover, setHover] = useState(false);

  const handleClick = () => {
    onClick?.();
    window.dispatchEvent(new CustomEvent('componentInteraction', {
      detail: { component: 'Geometry3D', action: 'click', type, position }
    }));
  };

  return (
    <div
      className={`geometry-3d ${hover ? 'opacity-80' : 'opacity-100'}`}
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: size[0] * 50,
        height: size[1] * 50,
        backgroundColor: wireframe ? 'transparent' : color,
        border: wireframe ? `2px solid ${color}` : 'none',
        transform: `translate3d(${position[0] * 50}px, ${position[1] * 50}px, ${position[2] * 50}px)
                    rotateX(${rotation[0]}deg) rotateY(${rotation[1]}deg) rotateZ(${rotation[2]}deg)`,
        transformStyle: 'preserve-3d',
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: type === 'sphere' ? '50%' : '0',
        transition: 'opacity 0.2s'
      }}
    >
      <div className="text-xs text-white text-center">{type}</div>
    </div>
  );
};

// 6. Particle3D - 3D particle system
export const Particle3D: React.FC<{
  count?: number;
  color?: string;
  size?: number;
  spread?: number;
  velocity?: [number, number, number];
  lifetime?: number;
  emitting?: boolean;
}> = ({ 
  count = 100,
  color = '#ffffff',
  size = 2,
  spread = 10,
  velocity = [0, 1, 0],
  lifetime = 2000,
  emitting = true
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    z: number;
    life: number;
  }>>([]);

  useEffect(() => {
    if (!emitting) return;

    const interval = setInterval(() => {
      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * spread,
        y: 0,
        z: (Math.random() - 0.5) * spread,
        life: lifetime
      }));

      setParticles(prev => [...prev, ...newParticles]);

      window.dispatchEvent(new CustomEvent('componentInteraction', {
        detail: { component: 'Particle3D', action: 'emit', count, lifetime }
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [emitting, count, spread, lifetime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            y: p.y + velocity[1],
            life: p.life - 16
          }))
          .filter(p => p.life > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [velocity]);

  return (
    <div className="particle-system-3d" style={{ position: 'relative', width: '100%', height: 400 }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: '50%',
            transform: `translate3d(${p.x}px, ${-p.y}px, ${p.z}px)`,
            opacity: p.life / lifetime,
            pointerEvents: 'none'
          }}
        />
      ))}
    </div>
  );
};

// 7. Skybox3D - 360° skybox/environment
export const Skybox3D: React.FC<{
  images?: {
    front: string;
    back: string;
    left: string;
    right: string;
    top: string;
    bottom: string;
  };
  color?: string;
  type?: 'cube' | 'sphere' | 'gradient';
}> = ({ images, color = '#87ceeb', type = 'gradient' }) => {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('componentInteraction', {
      detail: { component: 'Skybox3D', action: 'load', type, color }
    }));
  }, [type, color]);

  return (
    <div 
      className="skybox-3d"
      style={{
        position: 'absolute',
        inset: 0,
        background: type === 'gradient' 
          ? `linear-gradient(to bottom, ${color}, #ffffff)`
          : color,
        zIndex: -1
      }}
    >
      {type === 'cube' && images && (
        <div className="text-xs text-gray-500 p-2">
          Skybox: Cube mapped with 6 textures
        </div>
      )}
    </div>
  );
};
