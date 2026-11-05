import { useEffect, useRef, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   MolecularNetwork — Radial Molecular Sphere

   Connection model: ONE central anchor + radial spokes outward.
   - Each surface molecule has ONE connection leading inward to the center.
   - Branch molecules connect to their surface root (not to center or each other).
   - Interior molecules have NO connections — they serve as atmosphere/depth.
   - No outer-to-outer connections. No mesh. No cage. No web.
   ───────────────────────────────────────────────────────────────────────────── */

const TAU = Math.PI * 2;
const CYCLE = 16;
const FL = 600;

function smoothstep(t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }
function lerp3(a, b, t) { return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t]; }
function dist3(a, b) { const dx=a[0]-b[0],dy=a[1]-b[1],dz=a[2]-b[2]; return Math.sqrt(dx*dx+dy*dy+dz*dz); }
function norm3(v) { const l=Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2])||1; return [v[0]/l,v[1]/l,v[2]/l]; }
function rotY(p,a) { const c=Math.cos(a),s=Math.sin(a); return [p[0]*c+p[2]*s,p[1],-p[0]*s+p[2]*c]; }
function rotX(p,a) { const c=Math.cos(a),s=Math.sin(a); return [p[0],p[1]*c-p[2]*s,p[1]*s+p[2]*c]; }
function project(p,cx,cy) { const s=FL/(FL+p[2]); return [cx+p[0]*s,cy+p[1]*s,s,p[2]]; }

function fibSphere(n, R) {
  const pts = [], golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i/(n-1))*2, r = Math.sqrt(1-y*y), th = golden*i;
    pts.push([Math.cos(th)*r*R, y*R, Math.sin(th)*r*R]);
  }
  return pts;
}

function gFactor(phase) {
  if (phase < 0.08) return 0.03 + smoothstep(phase/0.08) * 0.15;
  if (phase < 0.28) return 0.18 + smoothstep((phase-0.08)/0.20) * 0.82;
  if (phase < 0.62) { const b=(phase-0.28)/0.34; return 0.96 + 0.04*Math.cos(b*TAU); }
  if (phase < 0.85) return 1.0 - smoothstep((phase-0.62)/0.23) * 0.97;
  return 0.03;
}

const LABELS = ['Software Developer', 'Full-Stack Development', 'AI & Engineering', 'Applied AI', 'Product Engineering'];

/* ── Build radial molecular network ── */
function createNetwork(w, h, isMobile) {
  const R = Math.min(w, h) * 0.36;
  const nodes = [];
  const surfCount = isMobile ? 50 : 80;
  const interiorCount = isMobile ? 18 : 38;
  const conns = [];

  // --- Node 0: Central anchor (the shared focal point) ---
  nodes.push({
    sp: [0, 0, 0],
    dp: [(Math.random()-.5)*R*0.15, (Math.random()-.5)*R*0.15, (Math.random()-.5)*R*0.08],
    r: 3.0,
    type: 3,
    col: 1,  // warm orange
    os: 0.015, or: 0.4, op: 0, pp: 0,
  });

  // --- Surface nodes (indices 1..surfCount) → each connects to center ---
  const surfPts = fibSphere(surfCount, R);
  for (const p of surfPts) {
    const d = norm3(p);
    const sDist = R * (1.6 + Math.random());
    const jit = [(Math.random()-.5)*R*.6, (Math.random()-.5)*R*.6, (Math.random()-.5)*R*.6];
    const idx = nodes.length;
    nodes.push({
      sp: p.slice(),
      dp: [d[0]*sDist+jit[0], d[1]*sDist+jit[1], d[2]*sDist+jit[2]],
      r: 2.2 + Math.random() * 2.0,
      type: 0,
      col: Math.random() < 0.30 ? 1 : Math.random() < 0.10 ? 2 : 0,
      os: 0.05+Math.random()*0.08, or: 1.5+Math.random()*3, op: Math.random()*TAU, pp: Math.random()*TAU,
    });
    // One radial connection: this surface node → center
    conns.push({ i: idx, j: 0, bd: dist3(p, [0,0,0]) });
  }

  // --- Interior atmosphere nodes (NO connections — depth particles only) ---
  for (let i = 0; i < interiorCount; i++) {
    const rr = R * (0.10 + Math.random() * 0.72);
    const th = Math.random() * TAU;
    const ph = Math.acos(2 * Math.random() - 1);
    const p = [rr*Math.sin(ph)*Math.cos(th), rr*Math.sin(ph)*Math.sin(th), rr*Math.cos(ph)];
    const d = norm3(p.map(v => v || 0.01));
    const sDist = R * (1.8 + Math.random() * 1.2);
    const jit = [(Math.random()-.5)*R*.5, (Math.random()-.5)*R*.5, (Math.random()-.5)*R*.5];
    nodes.push({
      sp: p,
      dp: [d[0]*sDist+jit[0], d[1]*sDist+jit[1], d[2]*sDist+jit[2]],
      r: 1.0 + Math.random() * 1.4,
      type: 1,
      col: Math.random() < 0.14 ? 1 : 0,
      os: 0.03+Math.random()*0.06, or: 0.8+Math.random()*2, op: Math.random()*TAU, pp: Math.random()*TAU,
    });
  }

  // --- Branch nodes → each connects to its surface root (not to center) ---
  // Branch positions are clamped so they never exceed ~1.12×R from center,
  // keeping the formed sphere silhouette clean.
  const branchChance = isMobile ? 0.20 : 0.28;
  const maxBranchR = R * 1.12; // hard boundary for branch sphere-positions
  for (let si = 0; si < surfPts.length; si++) {
    if (Math.random() > branchChance) continue;
    const rootIdx = si + 1;  // surface node index (offset by center at 0)
    const rootP = surfPts[si];
    const rd = norm3(rootP);
    const bc = 1 + Math.floor(Math.random() * 2);
    for (let b = 0; b < bc; b++) {
      const ext = R * (0.10 + Math.random() * 0.22);
      const jit = [(Math.random()-.5)*R*.08, (Math.random()-.5)*R*.08, (Math.random()-.5)*R*.08];
      let bp = [rootP[0]+rd[0]*ext+jit[0], rootP[1]+rd[1]*ext+jit[1], rootP[2]+rd[2]*ext+jit[2]];
      // Clamp to maxBranchR
      const bpDist = Math.sqrt(bp[0]*bp[0]+bp[1]*bp[1]+bp[2]*bp[2]);
      if (bpDist > maxBranchR) {
        const scale = maxBranchR / bpDist;
        bp = [bp[0]*scale, bp[1]*scale, bp[2]*scale];
      }
      const bd = norm3(bp);
      const sDist = R * (2.0 + Math.random() * 0.8);
      const jitter = [(Math.random()-.5)*R*.4, (Math.random()-.5)*R*.4, (Math.random()-.5)*R*.4];
      const branchIdx = nodes.length;
      conns.push({ i: branchIdx, j: rootIdx, bd: dist3(bp, rootP) });
      nodes.push({
        sp: bp,
        dp: [bd[0]*sDist+jitter[0], bd[1]*sDist+jitter[1], bd[2]*sDist+jitter[2]],
        r: 1.2 + Math.random() * 1.6,
        type: 2,
        col: Math.random() < 0.22 ? 2 : Math.random() < 0.30 ? 1 : 0,
        os: 0.06+Math.random()*0.10, or: 1.5+Math.random()*3.5, op: Math.random()*TAU, pp: Math.random()*TAU,
      });
    }
  }

  return { nodes, conns, R, surfCount };
}

/* ── Component ── */
export default function MolecularNetwork({ style, className }) {
  const canvasRef = useRef(null);
  const netRef = useRef(null);
  const rafRef = useRef(null);
  const t0Ref = useRef(null);
  const dimRef = useRef({ w: 0, h: 0 });
  const labelRef = useRef({ textIdx: 0, nodeIdx: -1, lastCycle: -1, locked: false });

  const init = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    dimRef.current = { w: rect.width, h: rect.height };
    netRef.current = createNetwork(rect.width, rect.height, rect.width < 480);
    labelRef.current = { textIdx: 0, nodeIdx: -1, lastCycle: -1, locked: false };
  }, []);

  const resize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = c.getBoundingClientRect();
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    init();
  }, [init]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resize();
    window.addEventListener('resize', resize, { passive: true });
    const ctx = c.getContext('2d');
    if (reduced) {
      renderFrame(ctx, 7, dimRef.current.w, dimRef.current.h, netRef.current, labelRef.current);
      return () => window.removeEventListener('resize', resize);
    }
    t0Ref.current = performance.now();
    function loop(now) {
      rafRef.current = requestAnimationFrame(loop);
      const t = (now - t0Ref.current) / 1000;
      const { w, h } = dimRef.current;
      if (!w || !h || !netRef.current) return;
      renderFrame(ctx, t, w, h, netRef.current, labelRef.current);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, [resize]);

  return (
    <canvas ref={canvasRef} aria-hidden="true" className={className}
      style={{ width:'100%', height:'100%', display:'block', pointerEvents:'none', ...style }} />
  );
}

/* ── Render ── */
function renderFrame(ctx, t, W, H, net, ls) {
  ctx.clearRect(0, 0, W, H);
  if (!net) return;

  const { nodes, conns, R, surfCount } = net;
  const cx = W/2, cy = H/2;
  const phase = (t % CYCLE) / CYCLE;
  const g = gFactor(phase);

  // Label cycle
  const cycleNum = Math.floor(t / CYCLE);
  if (cycleNum !== ls.lastCycle) {
    ls.lastCycle = cycleNum;
    ls.textIdx = cycleNum % LABELS.length;
    ls.nodeIdx = -1;
    ls.locked = false;
  }
  if (phase > 0.60 || phase < 0.06) { ls.locked = false; ls.nodeIdx = -1; }

  const ry = t * 0.12;
  const rx = Math.sin(t * 0.05) * 0.10;

  const N = nodes.length;
  const p3 = new Array(N);
  const p2 = new Array(N);

  for (let i = 0; i < N; i++) {
    const n = nodes[i];
    let p = lerp3(n.dp, n.sp, g);
    const orbMul = 0.12 + (1 - g) * 2.88;
    p = [
      p[0] + Math.cos(t*n.os+n.op)*n.or*orbMul,
      p[1] + Math.sin(t*n.os*0.7+n.op)*n.or*0.6*orbMul,
      p[2] + Math.sin(t*n.os*0.4+n.op+1.5)*n.or*0.35*orbMul,
    ];
    p = rotY(p, ry);
    p = rotX(p, rx);
    p[2] = Math.max(-FL*0.55, Math.min(FL*0.4, p[2]));
    p3[i] = p;
    p2[i] = project(p, cx, cy);
  }

  const zRng = R * 2.5;

  // --- Connections (back to front) ---
  // Tight stretch threshold: connections only appear during formation (g > ~0.7)
  const connOrder = conns.map((c, ci) => ({ ci, avgZ: (p3[c.i][2]+p3[c.j][2])/2 }))
    .sort((a, b) => b.avgZ - a.avgZ);

  // Silhouette radius limit (in 3D space): when formed, reject connections whose
  // endpoints or midpoints stray beyond ~1.18×R from origin.  Only applies as
  // sphere coalesces (g > 0.5) so the beautiful dispersed state is untouched.
  const silhouetteR = R * 1.18;

  for (const { ci } of connOrder) {
    const c = conns[ci];
    const a3 = p3[c.i], b3 = p3[c.j];
    const cd = dist3(a3, b3);

    // Connections emerge only as sphere forms; invisible when dispersed
    // Tighten the stretch threshold as sphere forms fully
    const maxStr = c.bd * (1.8 - g * 0.65);
    if (cd > maxStr) continue;

    // During formation, suppress connections whose endpoint or midpoint
    // is outside the intended spherical silhouette
    if (g > 0.5) {
      const aDist = Math.sqrt(a3[0]*a3[0]+a3[1]*a3[1]+a3[2]*a3[2]);
      const bDist = Math.sqrt(b3[0]*b3[0]+b3[1]*b3[1]+b3[2]*b3[2]);
      const midDist = Math.sqrt(
        ((a3[0]+b3[0])/2)**2 + ((a3[1]+b3[1])/2)**2 + ((a3[2]+b3[2])/2)**2
      );
      // Allow center (node 0) connections — center is at origin, always inside.
      // For others, both endpoints and midpoint must be within silhouette.
      if (c.j !== 0 && (aDist > silhouetteR || bDist > silhouetteR)) continue;
      if (midDist > silhouetteR * 1.05) continue;
    }

    const stretch = cd / c.bd;
    let alpha = stretch <= 1.15 ? 0.30 : 0.30 * Math.max(0, 1-(stretch-1.15)/((maxStr/c.bd)-1.15));

    // Depth dimming
    const avgZ = (a3[2]+b3[2])/2;
    const depthN = Math.max(0, Math.min(1, (zRng-avgZ)/(2*zRng)));
    alpha *= 0.20 + depthN * 0.80;

    if (alpha < 0.008) continue;

    const ap = p2[c.i], bp = p2[c.j];
    const avgScale = (ap[2]+bp[2])/2;
    // Thin, refined lines — no thick strokes
    const isRadial = c.j === 0; // surface→center connection
    const lw = Math.max(0.25, avgScale * (isRadial ? 0.45 : 0.5));

    ctx.beginPath();
    ctx.moveTo(ap[0], ap[1]);
    // Slight curve on radial spokes for organic feel
    if (isRadial && cd > R * 0.4) {
      const mx = (ap[0]+bp[0])/2, my = (ap[1]+bp[1])/2;
      const dx = bp[0]-ap[0], dy = bp[1]-ap[1];
      const curv = Math.sin(ci * 1.7 + t * 0.08) * 0.06;
      ctx.quadraticCurveTo(mx-dy*curv, my+dx*curv, bp[0], bp[1]);
    } else {
      ctx.lineTo(bp[0], bp[1]);
    }
    ctx.strokeStyle = `rgba(26, 22, 20, ${alpha})`;
    ctx.lineWidth = lw;
    ctx.stroke();
  }

  // --- Nodes (back to front) ---
  const nodeOrder = Array.from({length:N},(_,i)=>i).sort((a,b)=>p3[b][2]-p3[a][2]);
  const COLORS = [[40,34,30],[230,160,106],[216,220,106]];

  for (const idx of nodeOrder) {
    const n = nodes[idx];
    const p = p2[idx];
    const z = p3[idx][2];
    const depthN = Math.max(0, Math.min(1, (zRng-z)/(2*zRng)));
    const scale = p[2];

    // Subtle life: gentle pulsing, per-node phase
    const pulse = 1 + Math.sin(t*(0.35 + n.r*0.05) + n.pp) * 0.10;
    const brightPulse = 1 + Math.sin(t*0.8 + n.pp*2) * 0.06; // subtle brightness change
    const r = n.r * scale * pulse;
    const nA = (0.28 + depthN * 0.72) * brightPulse;
    const [cR,cG,cB] = COLORS[n.col];

    // Soft glow for larger molecules
    if (n.r > 2.8) {
      const gr = r * 3;
      const grad = ctx.createRadialGradient(p[0],p[1],r*0.3,p[0],p[1],gr);
      grad.addColorStop(0, `rgba(${cR},${cG},${cB},${nA*0.08})`);
      grad.addColorStop(1, `rgba(${cR},${cG},${cB},0)`);
      ctx.beginPath(); ctx.arc(p[0],p[1],gr,0,TAU); ctx.fillStyle=grad; ctx.fill();
    }

    ctx.beginPath(); ctx.arc(p[0],p[1],r,0,TAU);
    ctx.fillStyle = `rgba(${cR},${cG},${cB},${nA*0.85})`;
    ctx.fill();

    // Highlight pip for dimensionality
    if (r > 1.6) {
      ctx.beginPath(); ctx.arc(p[0]-r*0.2,p[1]-r*0.2,r*0.25,0,TAU);
      ctx.fillStyle = `rgba(255,255,255,${nA*0.16})`;
      ctx.fill();
    }
  }

  // --- Professional tag ---
  const isFormedPhase = phase > 0.34 && phase < 0.57;

  // Select a visible outer surface node (indices 1..surfCount)
  if (isFormedPhase && !ls.locked) {
    let bestIdx = -1, bestScore = -Infinity;
    for (let i = 1; i <= surfCount; i++) {
      const pp = p2[i];
      if (!pp || pp[2] < 0.85) continue;
      const xOff = pp[0] - cx;
      if (xOff < R * 0.15) continue;
      if (pp[0] > W - 140) continue;
      if (pp[1] < 30 || pp[1] > H - 30) continue;
      const yDist = Math.abs(pp[1] - cy);
      const score = xOff * 0.5 - yDist * 0.3 + pp[2] * 80;
      if (score > bestScore) { bestScore = score; bestIdx = i; }
    }
    if (bestIdx >= 0) { ls.nodeIdx = bestIdx; ls.locked = true; }
  }

  if (ls.nodeIdx >= 0 && isFormedPhase) {
    const fadeIn = smoothstep(Math.min(1, (phase-0.34)/0.04));
    const fadeOut = smoothstep(Math.min(1, (0.57-phase)/0.03));
    const la = fadeIn * fadeOut;
    if (la > 0.01) {
      const ap = p2[ls.nodeIdx];
      const labelText = LABELS[ls.textIdx];
      const nr = nodes[ls.nodeIdx].r * ap[2] * 1.1;

      // Emphasis ring
      ctx.beginPath(); ctx.arc(ap[0], ap[1], nr+3, 0, TAU);
      ctx.strokeStyle = `rgba(230,160,106,${la*0.45})`;
      ctx.lineWidth = 1; ctx.stroke();

      // Leader line
      const ex = ap[0]+22, ey = ap[1]-6;
      ctx.beginPath(); ctx.moveTo(ap[0]+nr+2, ap[1]); ctx.lineTo(ex, ey);
      ctx.strokeStyle = `rgba(26,22,20,${la*0.4})`;
      ctx.lineWidth = 0.7; ctx.stroke();

      // Tag background
      ctx.font = '500 10.5px "JetBrains Mono","SF Mono",monospace';
      const tw = ctx.measureText(labelText).width;
      const px=8, py=5;
      const bgX = Math.min(ex+2, W-tw-px*2-4);
      const bgY = Math.max(4, ey-7-py);
      const bgW = tw+px*2, bgH = 13+py*2;

      const cr = 3;
      ctx.beginPath();
      ctx.moveTo(bgX+cr,bgY); ctx.lineTo(bgX+bgW-cr,bgY);
      ctx.quadraticCurveTo(bgX+bgW,bgY,bgX+bgW,bgY+cr);
      ctx.lineTo(bgX+bgW,bgY+bgH-cr);
      ctx.quadraticCurveTo(bgX+bgW,bgY+bgH,bgX+bgW-cr,bgY+bgH);
      ctx.lineTo(bgX+cr,bgY+bgH);
      ctx.quadraticCurveTo(bgX,bgY+bgH,bgX,bgY+bgH-cr);
      ctx.lineTo(bgX,bgY+cr);
      ctx.quadraticCurveTo(bgX,bgY,bgX+cr,bgY);
      ctx.fillStyle = `rgba(244,240,234,${la*0.92})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(26,22,20,${la*0.12})`;
      ctx.lineWidth = 0.5; ctx.stroke();

      // Text
      ctx.fillStyle = `rgba(26,22,20,${la*0.75})`;
      ctx.textBaseline = 'top';
      ctx.fillText(labelText, bgX+px, bgY+py+1);
    }
  }
}
