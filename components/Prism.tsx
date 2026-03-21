import React, { useEffect, useMemo, useRef } from 'react';

export type PrismAnimationType = 'rotate';

export interface PrismProps {
  animationType?: PrismAnimationType;
  timeScale?: number;
  height?: number;
  baseWidth?: number;
  scale?: number;
  hueShift?: number;
  colorFrequency?: number;
  noise?: number;
  glow?: number;
  className?: string;
  style?: React.CSSProperties;
}

type Vec2 = { x: number; y: number };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function rotate(point: Vec2, angle: number): Vec2 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: point.x * c - point.y * s, y: point.x * s + point.y * c };
}

function hsl(h: number, s: number, l: number, a = 1) {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

export default function Prism({
  animationType = 'rotate',
  timeScale = 0.5,
  height = 3.5,
  baseWidth = 5.5,
  scale = 3.6,
  hueShift = 0,
  colorFrequency = 1,
  noise = 0,
  glow = 1,
  className,
  style,
}: PrismProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let running = true;

    const dpr = () => clamp(window.devicePixelRatio || 1, 1, 2);

    let width = 0;
    let heightPx = 0;
    let noiseImage: ImageData | null = null;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const nextW = Math.max(1, Math.floor(rect.width));
      const nextH = Math.max(1, Math.floor(rect.height));
      if (nextW === width && nextH === heightPx) return;

      width = nextW;
      heightPx = nextH;

      const pixelRatio = dpr();
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(heightPx * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${heightPx}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      noiseImage = null;
      if (noise > 0) {
        const img = ctx.createImageData(width, heightPx);
        const data = img.data;
        for (let i = 0; i < data.length; i += 4) {
          const v = Math.floor(Math.random() * 255);
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = 255;
        }
        noiseImage = img;
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    const seeds = Array.from({ length: 7 }, (_, i) => ({
      phase: (i * Math.PI * 2) / 7,
      radius: 0.18 + i * 0.02,
      size: 0.7 - i * 0.06,
    }));

    const drawPrism = (center: Vec2, t: number, sizePx: number, depthPx: number) => {
      const angle = animationType === 'rotate' ? t * 0.8 : t * 0.8;
      const top: Vec2[] = [];
      const bottom: Vec2[] = [];

      for (let i = 0; i < 3; i++) {
        const a = angle + (i * Math.PI * 2) / 3;
        const p = rotate({ x: Math.cos(a), y: Math.sin(a) }, 0);
        top.push({ x: center.x + p.x * sizePx, y: center.y + p.y * sizePx });
        bottom.push({ x: center.x + p.x * sizePx * 0.92, y: center.y + p.y * sizePx * 0.92 + depthPx });
      }

      const face = (a: Vec2, b: Vec2, c: Vec2, d: Vec2, fill: string, alpha: number) => {
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(c.x, c.y);
        ctx.lineTo(d.x, d.y);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
      };

      const edge = (a: Vec2, b: Vec2, stroke: string, alpha: number, lineWidth: number) => {
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      };

      const hue = (t * 36 * colorFrequency + hueShift) % 360;

      if (glow > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.shadowColor = hsl(hue, 90, 60, 0.8);
        ctx.shadowBlur = 18 * clamp(glow, 0, 3);
        face(top[0], top[1], bottom[1], bottom[0], hsl(hue + 10, 85, 55), 0.16);
        face(top[1], top[2], bottom[2], bottom[1], hsl(hue + 35, 85, 52), 0.14);
        face(top[2], top[0], bottom[0], bottom[2], hsl(hue - 15, 85, 50), 0.13);
        ctx.restore();
      }

      face(top[0], top[1], bottom[1], bottom[0], hsl(hue + 10, 85, 50), 0.24);
      face(top[1], top[2], bottom[2], bottom[1], hsl(hue + 35, 85, 46), 0.22);
      face(top[2], top[0], bottom[0], bottom[2], hsl(hue - 15, 85, 44), 0.2);

      ctx.globalCompositeOperation = 'screen';
      edge(top[0], top[1], hsl(hue + 20, 95, 66), 0.5, 1.2);
      edge(top[1], top[2], hsl(hue + 45, 95, 66), 0.5, 1.2);
      edge(top[2], top[0], hsl(hue - 5, 95, 66), 0.5, 1.2);
      edge(top[0], bottom[0], hsl(hue + 10, 95, 64), 0.35, 1);
      edge(top[1], bottom[1], hsl(hue + 30, 95, 64), 0.35, 1);
      edge(top[2], bottom[2], hsl(hue - 10, 95, 64), 0.35, 1);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    };

    const render = (nowMs: number) => {
      if (!running) return;

      const t = (nowMs / 1000) * timeScale;

      ctx.clearRect(0, 0, width, heightPx);

      const hue = (t * 24 * colorFrequency + hueShift) % 360;
      const bg = ctx.createRadialGradient(width * 0.5, heightPx * 0.4, 0, width * 0.5, heightPx * 0.4, Math.max(width, heightPx) * 0.7);
      bg.addColorStop(0, hsl(hue + 15, 60, 55, 0.22));
      bg.addColorStop(0.5, hsl(hue - 25, 60, 45, 0.12));
      bg.addColorStop(1, hsl(hue - 55, 60, 25, 0.08));
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, heightPx);

      const minSide = Math.min(width, heightPx);
      const base = minSide * 0.095 * clamp(scale, 0.5, 6);
      const depth = base * clamp(height / Math.max(0.1, baseWidth), 0.25, 1.2);

      for (let i = 0; i < seeds.length; i++) {
        const s = seeds[i];
        const cx = width * 0.5 + Math.cos(t * 0.32 + s.phase) * width * s.radius;
        const cy = heightPx * 0.48 + Math.sin(t * 0.28 + s.phase) * heightPx * (s.radius * 0.8);
        const sizePx = base * s.size;
        const depthPx = depth * (0.8 + s.size * 0.45);
        drawPrism({ x: cx, y: cy }, t + s.phase * 0.2, sizePx, depthPx);
      }

      if (noiseImage && noise > 0) {
        ctx.save();
        ctx.globalAlpha = clamp(noise, 0, 1) * 0.085;
        ctx.globalCompositeOperation = 'overlay';
        ctx.putImageData(noiseImage, 0, 0);
        ctx.restore();
      }

      if (!reducedMotion) {
        raf = window.requestAnimationFrame(render);
      }
    };

    raf = window.requestAnimationFrame(render);

    return () => {
      running = false;
      ro.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [animationType, baseWidth, colorFrequency, glow, height, hueShift, noise, reducedMotion, scale, timeScale]);

  return (
    <div ref={containerRef} className={className} style={{ position: 'absolute', inset: 0, ...style }}>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
