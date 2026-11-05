import { useEffect, useRef, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   ParticleNetwork — Hero Canvas 2D Molecular Constellation System
   
   Visual concept: A living network of interconnected nodes that drift slowly,
   form/break connections based on proximity, and elegantly react to cursor 
   proximity. Communicates "complexity → connection → organized identity".
   
   Design principles:
   - Calm continuous motion even without interaction
   - Stronger but controlled cursor-proximity repulsion (not explosion)
   - Hierarchical node system: core anchor nodes + smaller satellite nodes
   - Connection lines fade with distance (spatial depth cue)
   - Right-side clustering to compose around the photo naturally
   ───────────────────────────────────────────────────────────────────────────── */

const CONFIG = {
  NODE_COUNT_DESKTOP: 58,
  NODE_COUNT_MOBILE: 26,
  CONNECTION_DIST: 130,
  GLOW_DIST: 200,
  DRIFT_SPEED: 0.28,
  CURSOR_REPEL_STRENGTH: 2.8,
  CURSOR_REPEL_RADIUS: 110,
  NODE_COLOR_CORE: 'rgba(104, 64, 255, 0.7)',
  NODE_COLOR_SAT: 'rgba(104, 64, 255, 0.42)',
  LINE_COLOR: 'rgba(104, 64, 255, ',
  PULSE_COLOR: 'rgba(161, 255, 98, 0.55)',
};

function makeNode(canvas, isMobile, index, total) {
  const isCore = index < Math.floor(total * 0.28);
  const r = isCore
    ? 1.8 + Math.random() * 2.0
    : 1.0 + Math.random() * 1.4;

  const xBias = isMobile ? 0.1 : 0.38;
  const x = (xBias + Math.random() * (1 - xBias)) * canvas.width;
  const y = Math.random() * canvas.height;

  const speed = (CONFIG.DRIFT_SPEED * (0.4 + Math.random() * 0.6)) / (isCore ? 1.5 : 1);
  const angle = Math.random() * Math.PI * 2;

  return {
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r,
    isCore,
    pulseOffset: Math.random() * Math.PI * 2,
    pulseSpeed: 0.8 + Math.random() * 0.8,
  };
}

export default function ParticleNetwork({ style }) {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(null);
  const tickRef = useRef(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isMobile = canvas.width < 768;
    const count = isMobile ? CONFIG.NODE_COUNT_MOBILE : CONFIG.NODE_COUNT_DESKTOP;
    nodesRef.current = Array.from({ length: count }, (_, i) =>
      makeNode(canvas, isMobile, i, count)
    );
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    init();
  }, [init]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    const parent = canvas.parentElement;
    if (parent) parent.addEventListener('mouseleave', onMouseLeave);

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function draw() {
      rafRef.current = requestAnimationFrame(draw);
      tickRef.current += 0.016;
      const t = tickRef.current;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, W, H);

      const nodes = nodesRef.current;

      // Move nodes
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        const marginX = W * 0.08;
        const marginY = H * 0.08;
        if (node.x < -marginX) node.x = W + marginX;
        if (node.x > W + marginX) node.x = -marginX;
        if (node.y < -marginY) node.y = H + marginY;
        if (node.y > H + marginY) node.y = -marginY;

        // Cursor repulsion
        const dx = node.x - mx;
        const dy = node.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.CURSOR_REPEL_RADIUS && dist > 0) {
          const force = (1 - dist / CONFIG.CURSOR_REPEL_RADIUS) * CONFIG.CURSOR_REPEL_STRENGTH;
          node.x += (dx / dist) * force;
          node.y += (dy / dist) * force;
        }
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > CONFIG.CONNECTION_DIST) continue;

          const baseAlpha = (1 - dist / CONFIG.CONNECTION_DIST) * 0.22;
          const dxm = (a.x + b.x) / 2 - mx;
          const dym = (a.y + b.y) / 2 - my;
          const mDist = Math.sqrt(dxm * dxm + dym * dym);
          const proximityBoost = mDist < CONFIG.GLOW_DIST
            ? (1 - mDist / CONFIG.GLOW_DIST) * 0.38
            : 0;

          const alpha = Math.min(baseAlpha + proximityBoost, 0.55);
          const lineW = (a.isCore && b.isCore) ? 1.1 : 0.6;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = CONFIG.LINE_COLOR + alpha + ')';
          ctx.lineWidth = lineW;
          ctx.stroke();
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const dx = node.x - mx;
        const dy = node.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isLit = dist < CONFIG.GLOW_DIST;
        const pulse = 1 + Math.sin(t * node.pulseSpeed + node.pulseOffset) * 0.18;
        const r = node.r * pulse;

        if (isLit && dist < CONFIG.CURSOR_REPEL_RADIUS * 1.5) {
          // Cursor-lit: volt-green accent
          ctx.beginPath();
          ctx.arc(node.x, node.y, r * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(161, 255, 98, 0.1)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
          ctx.fillStyle = CONFIG.PULSE_COLOR;
          ctx.fill();
        } else {
          if (node.isCore) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, r * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(104, 64, 255, 0.08)';
            ctx.fill();
          }
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
          ctx.fillStyle = node.isCore ? CONFIG.NODE_COLOR_CORE : CONFIG.NODE_COLOR_SAT;
          ctx.fill();
        }
      }
    }

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      if (parent) parent.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [resize]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}
