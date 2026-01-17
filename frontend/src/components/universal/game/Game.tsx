import React, { useRef, useEffect, useState, useCallback } from 'react';

// ============================================================================
// GAME COMPONENTS - Canvas Games, Sprites, Physics, Controls, Collision
// ============================================================================

// 1. GameCanvas - Main canvas for 2D games
export const GameCanvas: React.FC<{
  width?: number;
  height?: number;
  backgroundColor?: string;
  fps?: number;
  onUpdate?: (deltaTime: number) => void;
  onRender?: (ctx: CanvasRenderingContext2D) => void;
  children?: React.ReactNode;
  className?: string;
}> = ({ 
  width = 800, 
  height = 600, 
  backgroundColor = '#000000',
  fps = 60,
  onUpdate,
  onRender,
  children,
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastTimeRef = useRef<number>(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setGameStarted(true);
    let animationId: number;
    const targetFrameTime = 1000 / fps;

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;

      if (deltaTime >= targetFrameTime) {
        // Clear canvas
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // Update game logic
        onUpdate?.(deltaTime / 1000);

        // Render
        onRender?.(ctx);

        lastTimeRef.current = currentTime - (deltaTime % targetFrameTime);

        window.dispatchEvent(new CustomEvent('componentInteraction', {
          detail: { component: 'GameCanvas', action: 'frame', fps, deltaTime }
        }));
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(animationId);
  }, [width, height, backgroundColor, fps, onUpdate, onRender]);

  return (
    <div className={className}>
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        style={{ border: '1px solid #333', display: 'block' }}
      />
      {gameStarted && children}
    </div>
  );
};

// 2. Sprite - 2D sprite with animation
export const Sprite: React.FC<{
  x: number;
  y: number;
  width?: number;
  height?: number;
  image?: string;
  frames?: number;
  currentFrame?: number;
  rotation?: number;
  scale?: number;
  alpha?: number;
  flipX?: boolean;
  flipY?: boolean;
  onRender?: (ctx: CanvasRenderingContext2D, x: number, y: number) => void;
}> = ({ 
  x, 
  y, 
  width = 32, 
  height = 32,
  image,
  frames = 1,
  currentFrame = 0,
  rotation = 0,
  scale = 1,
  alpha = 1,
  flipX = false,
  flipY = false,
  onRender
}) => {
  const spriteRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('componentInteraction', {
      detail: { 
        component: 'Sprite', 
        action: 'render', 
        position: { x, y },
        frame: currentFrame
      }
    }));
  }, [x, y, currentFrame]);

  // This component provides data for the GameCanvas to render
  return null;
};

// 3. PhysicsBody - 2D physics with velocity, gravity, collision
export const PhysicsBody: React.FC<{
  x: number;
  y: number;
  velocityX?: number;
  velocityY?: number;
  accelerationX?: number;
  accelerationY?: number;
  gravity?: number;
  friction?: number;
  mass?: number;
  restitution?: number;
  shape?: 'rectangle' | 'circle';
  width?: number;
  height?: number;
  radius?: number;
  onUpdate?: (body: any) => void;
  onCollision?: (other: any) => void;
}> = ({ 
  x, 
  y,
  velocityX = 0,
  velocityY = 0,
  accelerationX = 0,
  accelerationY = 0,
  gravity = 0.5,
  friction = 0.98,
  mass = 1,
  restitution = 0.8,
  shape = 'rectangle',
  width = 32,
  height = 32,
  radius = 16,
  onUpdate,
  onCollision
}) => {
  const [body, setBody] = useState({
    x, y, velocityX, velocityY, accelerationX, accelerationY
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setBody(prev => {
        const newVelX = (prev.velocityX + prev.accelerationX) * friction;
        const newVelY = prev.velocityY + prev.accelerationY + gravity;
        const newX = prev.x + newVelX;
        const newY = prev.y + newVelY;

        const updatedBody = {
          x: newX,
          y: newY,
          velocityX: newVelX,
          velocityY: newVelY,
          accelerationX: prev.accelerationX,
          accelerationY: prev.accelerationY
        };

        onUpdate?.(updatedBody);

        window.dispatchEvent(new CustomEvent('componentInteraction', {
          detail: { 
            component: 'PhysicsBody', 
            action: 'update', 
            position: { x: newX, y: newY },
            velocity: { x: newVelX, y: newVelY }
          }
        }));

        return updatedBody;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [gravity, friction, onUpdate]);

  return null;
};

// 4. GameController - Input handling (keyboard, mouse, touch, gamepad)
export const GameController: React.FC<{
  onKeyDown?: (key: string) => void;
  onKeyUp?: (key: string) => void;
  onMouseMove?: (x: number, y: number) => void;
  onMouseClick?: (x: number, y: number, button: number) => void;
  onTouchStart?: (x: number, y: number) => void;
  onTouchMove?: (x: number, y: number) => void;
  onTouchEnd?: () => void;
  onGamepadInput?: (buttons: boolean[], axes: number[]) => void;
}> = ({ 
  onKeyDown,
  onKeyUp,
  onMouseMove,
  onMouseClick,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onGamepadInput
}) => {
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!keysPressed.has(e.key)) {
        setKeysPressed(prev => new Set([...prev, e.key]));
        onKeyDown?.(e.key);
        window.dispatchEvent(new CustomEvent('componentInteraction', {
          detail: { component: 'GameController', action: 'keyDown', key: e.key }
        }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.key);
        return newSet;
      });
      onKeyUp?.(e.key);
      window.dispatchEvent(new CustomEvent('componentInteraction', {
        detail: { component: 'GameController', action: 'keyUp', key: e.key }
      }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keysPressed, onKeyDown, onKeyUp]);

  // Gamepad polling
  useEffect(() => {
    const pollGamepad = () => {
      const gamepads = navigator.getGamepads();
      if (gamepads[0]) {
        const buttons = Array.from(gamepads[0].buttons).map(b => b.pressed);
        const axes = Array.from(gamepads[0].axes);
        onGamepadInput?.(buttons, axes);
      }
    };

    const interval = setInterval(pollGamepad, 16);
    return () => clearInterval(interval);
  }, [onGamepadInput]);

  return (
    <div className="game-controller-info text-xs text-gray-500">
      Keys pressed: {Array.from(keysPressed).join(', ') || 'None'}
    </div>
  );
};

// 5. Tilemap - Grid-based tile system
export const Tilemap: React.FC<{
  tiles: number[][];
  tileWidth?: number;
  tileHeight?: number;
  tilesetImage?: string;
  onRender?: (ctx: CanvasRenderingContext2D) => void;
}> = ({ 
  tiles,
  tileWidth = 32,
  tileHeight = 32,
  tilesetImage,
  onRender
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Render tilemap
    tiles.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile === 0) return; // Skip empty tiles

        const color = `hsl(${(tile * 30) % 360}, 70%, 50%)`;
        ctx.fillStyle = color;
        ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
        ctx.strokeStyle = '#333';
        ctx.strokeRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
      });
    });

    onRender?.(ctx);

    window.dispatchEvent(new CustomEvent('componentInteraction', {
      detail: { 
        component: 'Tilemap', 
        action: 'render', 
        dimensions: { width: tiles[0]?.length, height: tiles.length }
      }
    }));
  }, [tiles, tileWidth, tileHeight, onRender]);

  return (
    <canvas
      ref={canvasRef}
      width={(tiles[0]?.length || 0) * tileWidth}
      height={tiles.length * tileHeight}
      style={{ border: '1px solid #333' }}
    />
  );
};

// 6. CollisionDetector - Detect collisions between game objects
export const CollisionDetector: React.FC<{
  objects: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  onCollision?: (obj1: string, obj2: string) => void;
}> = ({ objects, onCollision }) => {
  const [collisions, setCollisions] = useState<string[]>([]);

  useEffect(() => {
    const detected: string[] = [];

    for (let i = 0; i < objects.length; i++) {
      for (let j = i + 1; j < objects.length; j++) {
        const obj1 = objects[i];
        const obj2 = objects[j];

        // AABB collision detection
        if (
          obj1.x < obj2.x + obj2.width &&
          obj1.x + obj1.width > obj2.x &&
          obj1.y < obj2.y + obj2.height &&
          obj1.y + obj1.height > obj2.y
        ) {
          const collisionKey = `${obj1.id}-${obj2.id}`;
          detected.push(collisionKey);
          onCollision?.(obj1.id, obj2.id);
          
          window.dispatchEvent(new CustomEvent('componentInteraction', {
            detail: { 
              component: 'CollisionDetector', 
              action: 'collision',
              objects: [obj1.id, obj2.id]
            }
          }));
        }
      }
    }

    setCollisions(detected);
  }, [objects, onCollision]);

  return (
    <div className="collision-info text-xs text-gray-500">
      Active collisions: {collisions.length}
    </div>
  );
};

// 7. ParticleEmitter - Game particle effects
export const ParticleEmitter: React.FC<{
  x: number;
  y: number;
  rate?: number;
  lifetime?: number;
  angle?: number;
  spread?: number;
  speed?: number;
  gravity?: number;
  color?: string;
  size?: number;
  emitting?: boolean;
  onRender?: (particles: any[]) => void;
}> = ({ 
  x, 
  y,
  rate = 10,
  lifetime = 1000,
  angle = 0,
  spread = 45,
  speed = 2,
  gravity = 0.1,
  color = '#ff0000',
  size = 4,
  emitting = true,
  onRender
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
  }>>([]);

  // Emit particles
  useEffect(() => {
    if (!emitting) return;

    const interval = setInterval(() => {
      const newParticles = Array.from({ length: rate }, (_, i) => {
        const particleAngle = (angle + (Math.random() - 0.5) * spread) * Math.PI / 180;
        return {
          id: Date.now() + i,
          x,
          y,
          vx: Math.cos(particleAngle) * speed,
          vy: Math.sin(particleAngle) * speed,
          life: lifetime,
          maxLife: lifetime
        };
      });

      setParticles(prev => [...prev, ...newParticles]);
    }, 100);

    return () => clearInterval(interval);
  }, [emitting, x, y, rate, lifetime, angle, spread, speed]);

  // Update particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + gravity,
            life: p.life - 16
          }))
          .filter(p => p.life > 0)
      );
    }, 16);

    onRender?.(particles);

    return () => clearInterval(interval);
  }, [gravity, particles, onRender]);

  return (
    <div className="particle-emitter" style={{ position: 'relative' }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: '50%',
            opacity: p.life / p.maxLife,
            pointerEvents: 'none'
          }}
        />
      ))}
    </div>
  );
};

// 8. ScoreTracker - Game score and stats
export const ScoreTracker: React.FC<{
  score: number;
  highScore?: number;
  lives?: number;
  level?: number;
  time?: number;
  showStats?: boolean;
  onScoreChange?: (score: number) => void;
}> = ({ 
  score, 
  highScore = 0,
  lives = 3,
  level = 1,
  time = 0,
  showStats = true,
  onScoreChange
}) => {
  useEffect(() => {
    onScoreChange?.(score);
    window.dispatchEvent(new CustomEvent('componentInteraction', {
      detail: { component: 'ScoreTracker', action: 'update', score, level }
    }));
  }, [score, level, onScoreChange]);

  if (!showStats) return null;

  return (
    <div className="score-tracker bg-gray-900 text-white p-4 rounded-lg">
      <div className="flex gap-6 items-center">
        <div>
          <div className="text-xs text-gray-400">SCORE</div>
          <div className="text-2xl font-bold">{score.toLocaleString()}</div>
        </div>
        {highScore > 0 && (
          <div>
            <div className="text-xs text-gray-400">HIGH SCORE</div>
            <div className="text-xl font-semibold text-yellow-400">{highScore.toLocaleString()}</div>
          </div>
        )}
        <div>
          <div className="text-xs text-gray-400">LEVEL</div>
          <div className="text-xl font-semibold">{level}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">LIVES</div>
          <div className="text-xl font-semibold text-red-400">{'❤️'.repeat(lives)}</div>
        </div>
        {time > 0 && (
          <div>
            <div className="text-xs text-gray-400">TIME</div>
            <div className="text-xl font-semibold">{Math.floor(time / 1000)}s</div>
          </div>
        )}
      </div>
    </div>
  );
};
