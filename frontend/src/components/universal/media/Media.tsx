/**
 * Media Components
 * Video, audio, image editing, gallery, media players
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';
import { userAssetManager } from '@/lib/instrumentation/userAssetManager';

// ========== VIDEO PLAYER ==========
export function VideoPlayer({
  id,
  src,
  poster,
  autoPlay = false,
  controls = true,
  onPlay,
  onPause,
  onEnded,
}: {
  id: string;
  src: string;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}) {
  const { track } = useEventTracking('VideoPlayer', id);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlay = () => {
    track('play', null, { currentTime });
    setPlaying(true);
    onPlay?.();
  };

  const handlePause = () => {
    track('pause', null, { currentTime });
    setPlaying(false);
    onPause?.();
  };

  const handleEnded = () => {
    track('ended', null, { duration });
    onEnded?.();
  };

  const handleSeek = (time: number) => {
    track('seek', time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        controls={controls}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        className="w-full"
      />
    </div>
  );
}

// ========== AUDIO PLAYER ==========
export function AudioPlayer({
  id,
  src,
  title,
  artist,
  artwork,
}: {
  id: string;
  src: string;
  title: string;
  artist?: string;
  artwork?: string;
}) {
  const { track } = useEventTracking('AudioPlayer', id);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      track('pause', null, { currentTime });
    } else {
      audioRef.current.play();
      track('play', null, { currentTime });
    }
    setPlaying(!playing);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
      />

      <div className="flex gap-4">
        {artwork && (
          <img src={artwork} alt={title} className="w-16 h-16 rounded object-cover" />
        )}

        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          {artist && <p className="text-sm text-gray-600">{artist}</p>}

          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
            >
              {playing ? '⏸' : '▶'}
            </button>

            <div className="flex-1">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => {
                  const time = Number(e.target.value);
                  if (audioRef.current) {
                    audioRef.current.currentTime = time;
                  }
                }}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== IMAGE GALLERY ==========
export function ImageGallery({
  id,
  images,
  columns = 3,
  lightbox = true,
}: {
  id: string;
  images: Array<{ id: string; src: string; alt: string; caption?: string }>;
  columns?: number;
  lightbox?: boolean;
}) {
  const { track } = useEventTracking('ImageGallery', id);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    track('image_click', images[index].id);
    if (lightbox) {
      setSelectedImage(index);
    }
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  return (
    <>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            onClick={() => handleImageClick(index)}
            className="cursor-pointer group relative overflow-hidden rounded-lg"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && selectedImage !== null && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300"
          >
            ‹
          </button>

          <div className="max-w-4xl max-h-[90vh]">
            <img
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              className="max-w-full max-h-full object-contain"
            />
            {images[selectedImage].caption && (
              <p className="text-white text-center mt-4">
                {images[selectedImage].caption}
              </p>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300"
          >
            ›
          </button>

          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}

// ========== IMAGE EDITOR ==========
export function ImageEditor({
  id,
  src,
  onSave,
}: {
  id: string;
  src: string;
  onSave: (editedImage: string) => void;
}) {
  const { track } = useEventTracking('ImageEditor', id);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      applyFilters(ctx, img);
    };
    img.src = src;
  }, [src, brightness, contrast, saturation, rotation]);

  const applyFilters = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    ctx.save();
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  };

  const handleSave = () => {
    track('save_image', null, { brightness, contrast, saturation, rotation });
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onSave(dataUrl);
      // userAssetManager.addAsset({
      //   type: 'image',
      //   name: 'edited-image.png',
      //   data: dataUrl,
      //   context: { editedFrom: id, filters: { brightness, contrast, saturation, rotation } },
      // });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <canvas ref={canvasRef} className="max-w-full border rounded mb-4" />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Brightness: {brightness}%
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={brightness}
            onChange={(e) => {
              const val = Number(e.target.value);
              setBrightness(val);
              track('adjust_brightness', val);
            }}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Contrast: {contrast}%
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={contrast}
            onChange={(e) => {
              const val = Number(e.target.value);
              setContrast(val);
              track('adjust_contrast', val);
            }}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Saturation: {saturation}%
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={saturation}
            onChange={(e) => {
              const val = Number(e.target.value);
              setSaturation(val);
              track('adjust_saturation', val);
            }}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Rotation: {rotation}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={rotation}
            onChange={(e) => {
              const val = Number(e.target.value);
              setRotation(val);
              track('rotate', val);
            }}
            className="w-full"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Save Image
        </button>
      </div>
    </div>
  );
}

// ========== DRAWING CANVAS ==========
export function DrawingCanvas({
  id,
  width = 800,
  height = 600,
  onSave,
}: {
  id: string;
  width?: number;
  height?: number;
  onSave?: (drawing: string) => void;
}) {
  const { track } = useEventTracking('DrawingCanvas', id);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    track('clear_canvas', null);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveDrawing = () => {
    track('save_drawing', null);
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onSave?.(dataUrl);
      // userAssetManager.addAsset({
      //   type: 'image',
      //   name: 'drawing.png',
      //   data: dataUrl,
      //   context: { drawnIn: id },
      // });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => {
            setTool('pen');
            track('select_tool', 'pen');
          }}
          className={`px-4 py-2 rounded ${
            tool === 'pen' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          ✏️ Pen
        </button>
        <button
          onClick={() => {
            setTool('eraser');
            track('select_tool', 'eraser');
          }}
          className={`px-4 py-2 rounded ${
            tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          🧹 Eraser
        </button>

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-10"
        />

        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          className="flex-1"
        />

        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear
        </button>

        <button
          onClick={saveDrawing}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Save
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onMouseLeave={stopDrawing}
        className="border rounded cursor-crosshair"
      />
    </div>
  );
}
