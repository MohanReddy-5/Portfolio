import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────────────
   ABOUT CONCEPTS — Grounded, human, concise
   ───────────────────────────────────────────────────────────────────────────── */
const CONCEPTS = [
    {
        id: 'think',
        index: '01',
        label: 'How I Think',
        summary: 'Problems first. Tools second.',
        body: "Before writing any code, I want to understand what the system actually needs to do. I look at the constraints, break the complexity into smaller parts, reason through what could go wrong, and only then decide on an approach. The goal is always a solution that works reliably — not just one that compiles.",
        meta: 'B.Tech CSE (AI & ML) · Analytical problem-solving',
    },
    {
        id: 'work',
        index: '02',
        label: 'How I Work',
        summary: 'Full-stack, end to end.',
        body: 'I break complex problems into smaller, manageable steps, build solutions with clear logic, and refine them through testing and iteration. I focus on readable code, reliable behavior, and experiences that make sense to the people using them.',
        meta: 'React · Python · Java · Spring Boot · PostgreSQL',
    },
    {
        id: 'build',
        index: '03',
        label: 'What I Build',
        summary: 'Applied systems.',
        body: "ConfidoAI is a web-based mock-interview platform where users practise interview questions while the system evaluates both their spoken answers and camera-based cues like facial expressions, eye contact, and head posture. The fake-news detection project classifies news articles as genuine or fabricated using a pipeline of NLP preprocessing and multiple ML classifiers including PassiveAggressiveClassifier, Logistic Regression, and Naive Bayes.",
        meta: 'ConfidoAI · Fake News Detection · MediaPipe · scikit-learn',
    },
    {
        id: 'care',
        index: '04',
        label: 'What I Care About',
        summary: 'Systems that work for people.',
        body: "Software should be genuinely useful and understandable — not just to the developer who wrote it, but to the next person who maintains it and the person who uses it. I care about engineering clarity, writing code that communicates its intent, building reliable systems that handle failure gracefully, and documenting decisions so the reasoning survives beyond the commit.",
        meta: 'Clarity · Reliability · Maintainability · Thoughtful UX · Documentation',
    },
];

/* ─────────────────────────────────────────────────────────────────────────────
   ACADEMIC DATA — Factual, simple, editorial
   ───────────────────────────────────────────────────────────────────────────── */
const ACADEMIC_RECORDS = [
    {
        index: '01',
        period: '2022 — 2026',
        institution: 'Vikas College of Engineering & Technology',
        degree: 'B.Tech — CSE (AI & ML)',
        score: '7.30',
        scoreLabel: 'CGPA',
        isPrimary: true,
    },
    {
        index: '02',
        period: '2020 — 2022',
        institution: 'KBN College',
        degree: 'Intermediate — MPC',
        score: '60%',
        scoreLabel: '',
        isPrimary: false,
    },
    {
        index: '03',
        period: '2019 — 2020',
        institution: 'ADMC High School',
        degree: '10th Class — SSC',
        score: '90%',
        scoreLabel: '',
        isPrimary: false,
    },
];

/* ─────────────────────────────────────────────────────────────────────────────
   HERO → ABOUT BLACK-HOLE TRANSITION
   Scroll-driven canvas overlay covering the full About section.
   Starts as Hero's linen, a dark void expands from center, fills → About bg.
   ───────────────────────────────────────────────────────────────────────────── */
function HeroAboutTransition({ sectionRef }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const section = sectionRef?.current;
        if (!canvas || !section) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
        };
        resize();
        window.addEventListener('resize', resize);

        let progress = 0;

        const gsapCtx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top bottom',
                end: 'top 15%',
                scrub: 0.3,
                onUpdate: (self) => {
                    progress = self.progress;
                },
            });
        });

        let rafId;

        const render = () => {
            const c = canvas.getContext('2d');
            const w = canvas.width;
            const h = canvas.height;
            c.clearRect(0, 0, w, h);

            const cx = w / 2;
            const cy = h * 0.18;
            const p = progress;

            // Start with Hero's linen surface
            c.fillStyle = '#f4f0ea';
            c.fillRect(0, 0, w, h);

            if (prefersReduced) {
                if (p > 0.01) {
                    c.fillStyle = '#0f0e0e';
                    c.globalAlpha = Math.min(1, p * 1.5);
                    c.fillRect(0, 0, w, h);
                    c.globalAlpha = 1;
                }
                rafId = requestAnimationFrame(render);
                return;
            }

            if (p < 0.02) {
                rafId = requestAnimationFrame(render);
                return;
            }

            // Void expansion: center → outward, quadratic ease for gravitational feel
            const voidStart = 0.03;
            const voidEnd = 0.85;
            const voidT = Math.max(0, Math.min(1, (p - voidStart) / (voidEnd - voidStart)));
            const eased = voidT * voidT;

            if (eased > 0) {
                const maxR = Math.sqrt(w * w + h * h) * 0.55;
                const voidR = eased * maxR;
                const edgeSoft = Math.max(10 * dpr, voidR * 0.1);

                // Dark void with soft radial edge
                const voidGrad = c.createRadialGradient(
                    cx, cy, Math.max(0, voidR - edgeSoft),
                    cx, cy, voidR + edgeSoft * 0.4
                );
                voidGrad.addColorStop(0, '#0f0e0e');
                voidGrad.addColorStop(1, 'rgba(15, 14, 14, 0)');
                c.fillStyle = voidGrad;
                c.fillRect(0, 0, w, h);

                // Gravitational ring (peaks mid-transition)
                const ringI = Math.sin(voidT * Math.PI);
                if (ringI > 0.08 && voidR > 12) {
                    c.beginPath();
                    c.arc(cx, cy, voidR, 0, Math.PI * 2);
                    c.strokeStyle = `rgba(255, 255, 255, ${ringI * 0.2})`;
                    c.lineWidth = (1 + ringI) * dpr;
                    c.stroke();

                    if (ringI > 0.25) {
                        c.beginPath();
                        c.arc(cx, cy, voidR * 0.91, 0, Math.PI * 2);
                        c.strokeStyle = `rgba(104, 64, 255, ${(ringI - 0.25) * 0.14})`;
                        c.lineWidth = 0.8 * dpr;
                        c.stroke();
                    }
                }
            }

            // Final flood: fully dark once expansion is nearly complete
            if (p > 0.88) {
                const finalAlpha = Math.min(1, (p - 0.88) / 0.12);
                c.fillStyle = `rgba(15, 14, 14, ${finalAlpha})`;
                c.fillRect(0, 0, w, h);
            }

            rafId = requestAnimationFrame(render);
        };

        rafId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', resize);
            gsapCtx.revert();
        };
    }, [sectionRef]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
            }}
        />
    );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DYNAMIC ATMOSPHERIC BACKGROUND — Living environment, no particles / no HUD
   Atmospheric core and dimensional waves anchored to interactive black-hole center
   ───────────────────────────────────────────────────────────────────────────── */
function AboutBackground({ coreRef, shiftRef }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let animationFrameId;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
        };
        resize();
        window.addEventListener('resize', resize);

        let tick = 0;

        const render = () => {
            tick += 0.008;
            const ctx = canvas.getContext('2d');
            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);

            // Active core coordinates: anchored to pattern visual center + interactive cursor response
            const core = coreRef ? coreRef.current : { x: 0, y: 0 };
            const shift = shiftRef ? shiftRef.current : { x: 0, y: 0 };
            const auraX = core.x ? (core.x + shift.x) * dpr : w * 0.705;
            const auraY = core.y ? (core.y + shift.y) * dpr : h * 0.45;

            // 1. Ambient atmospheric glow behind the pattern region
            const breathing = Math.sin(tick * 1.2) * 0.015;
            const auraRadius = Math.max(w, h) * 0.52;
            const aura = ctx.createRadialGradient(auraX, auraY, 0, auraX, auraY, auraRadius);
            aura.addColorStop(0, `rgba(104, 64, 255, ${0.088 + breathing})`);
            aura.addColorStop(0.35, `rgba(255, 255, 255, ${0.02 + breathing * 0.5})`);
            aura.addColorStop(0.75, 'rgba(15, 14, 14, 0.4)');
            aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = aura;
            ctx.fillRect(0, 0, w, h);

            // 2. Subtle dimensional depth contours responding subtly to atmosphere movement
            const waveCount = 3;
            for (let i = 0; i < waveCount; i++) {
                const baseY = h * (0.28 + i * 0.22) + shift.y * 0.25 * dpr;
                const phase = tick * (0.8 + i * 0.2) + i * 1.5;
                const waveAmp = 10 * dpr;

                ctx.beginPath();
                ctx.moveTo(0, baseY + Math.sin(phase) * waveAmp);

                // Elegant bezier wave across canvas width
                const cp1x = w * 0.32;
                const cp1y = baseY + Math.sin(phase + 1.2) * (waveAmp * 1.4);
                const cp2x = w * 0.68;
                const cp2y = baseY + Math.cos(phase + 0.8) * (waveAmp * 1.4);
                const endX = w;
                const endY = baseY + Math.sin(phase + 2.4) * waveAmp;

                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.038 + i * 0.01})`;
                ctx.lineWidth = 1 * dpr;
                ctx.setLineDash([8 * dpr, 6 * dpr]);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [coreRef, shiftRef]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    );
}

/* ─────────────────────────────────────────────────────────────────────────────
   EDITORIAL PATTERNS — Confident spatial footprint, balanced geometry
   Scales comfortably across the right region without crowding edges
   All 4 patterns centered consistently at (270, 175)
   ───────────────────────────────────────────────────────────────────────────── */

/* 01. HOW I THINK — Understand → Constrain → Decompose → Evaluate → Validate */
function ThinkPattern() {
    return (
        <svg viewBox="0 0 540 350" width="100%" height="100%" style={{ overflow: 'visible', display: 'block' }}>
            {/* Subtle background trajectory */}
            <line x1="60" y1="175" x2="480" y2="175" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="270" y1="40" x2="270" y2="310" stroke="rgba(255,255,255,0.035)" strokeWidth="1" strokeDasharray="4 4" />

            {/* Inquiry convergence curves */}
            <motion.path
                d="M 90 80 C 210 80, 230 175, 445 175"
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1.3"
                strokeDasharray="4 3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <motion.path
                d="M 90 175 L 445 175"
                fill="none"
                stroke="rgba(255,255,255,0.52)"
                strokeWidth="1.4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
            />
            <motion.path
                d="M 90 270 C 210 270, 230 175, 445 175"
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1.3"
                strokeDasharray="4 3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            />

            {/* Starting inquiry nodes */}
            <circle cx="90" cy="80" r="4" fill="rgba(255,255,255,0.4)" />
            <circle cx="90" cy="175" r="5.5" fill="#ffffff" />
            <circle cx="90" cy="270" r="4" fill="rgba(255,255,255,0.4)" />
            <text x="74" y="179" textAnchor="end" fill="rgba(255,255,255,0.78)" fontFamily="var(--font-mono)" fontSize="9.5" letterSpacing="0.08em">
                PROBLEM
            </text>

            {/* Depth midpoint */}
            <circle cx="270" cy="175" r="4" fill="rgba(255,255,255,0.7)" />
            <text x="270" y="150" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="0.08em">
                CONSTRAINTS
            </text>

            {/* Clarity core */}
            <circle cx="445" cy="175" r="24" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="445" cy="175" r="12" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
            <circle cx="445" cy="175" r="6" fill="#ffffff" />
            <text x="445" y="218" textAnchor="middle" fill="#ffffff" fontFamily="var(--font-display)" fontSize="12" fontWeight="700" letterSpacing="0.05em">
                SOLUTION
            </text>
        </svg>
    );
}

/* 02. HOW I WORK — Understand → Structure → Implement → Test → Refine */
function WorkPattern() {
    const steps = [
        { label: 'UNDERSTAND', x: 80, y: 175 },
        { label: 'STRUCTURE', x: 185, y: 110 },
        { label: 'IMPLEMENT', x: 310, y: 235 },
        { label: 'TEST', x: 400, y: 125 },
        { label: 'SHIP', x: 460, y: 175, isCore: true },
    ];

    return (
        <svg viewBox="0 0 540 350" width="100%" height="100%" style={{ overflow: 'visible', display: 'block' }}>
            {/* Flow curve */}
            <motion.path
                d="M 80 175 C 130 175, 130 110, 185 110 C 245 110, 245 235, 310 235 C 355 235, 355 125, 400 125 C 430 125, 430 175, 460 175"
                fill="none"
                stroke="rgba(255,255,255,0.42)"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
            />

            {/* Iteration return arc */}
            <path
                d="M 460 175 C 460 290, 80 290, 80 175"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.1"
                strokeDasharray="4 4"
            />
            <text x="270" y="306" textAnchor="middle" fill="rgba(255,255,255,0.38)" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="0.08em">
                ITERATION
            </text>

            {/* Stations */}
            {steps.map((st) => (
                <g key={st.label}>
                    <circle
                        cx={st.x}
                        cy={st.y}
                        r={st.isCore ? 6.5 : 4.5}
                        fill={st.isCore ? '#ffffff' : 'rgba(255,255,255,0.75)'}
                        stroke={st.isCore ? 'rgba(255,255,255,0.3)' : 'none'}
                        strokeWidth={st.isCore ? 5 : 0}
                    />
                    <text
                        x={st.x}
                        y={st.y > 175 ? st.y + 20 : st.y - 14}
                        textAnchor="middle"
                        fill={st.isCore ? '#ffffff' : 'rgba(255,255,255,0.70)'}
                        fontFamily="var(--font-mono)"
                        fontSize="9"
                        fontWeight="600"
                        letterSpacing="0.06em"
                    >
                        {st.label}
                    </text>
                </g>
            ))}
        </svg>
    );
}

/* 03. WHAT I BUILD — Purpose · Technology · Process · Outcome */
function BuildPattern() {
    /* Rectangle corners */
    const TL = { x: 120, y: 85 };   /* top-left: Purpose */
    const TR = { x: 420, y: 85 };   /* top-right: Technology */
    const BR = { x: 420, y: 265 };  /* bottom-right: Process */
    const BL = { x: 120, y: 265 };  /* bottom-left: Outcome */
    const CX = 270, CY = 175;       /* center */

    return (
        <svg viewBox="0 0 540 350" width="100%" height="100%" style={{ overflow: 'visible', display: 'block' }}>
            {/* Subtle axis crosshairs */}
            <line x1="50" y1={CY} x2="490" y2={CY} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1={CX} y1="40" x2={CX} y2="310" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3" />

            {/* Rectangle outline */}
            <rect
                x={TL.x} y={TL.y}
                width={TR.x - TL.x} height={BL.y - TL.y}
                fill="none"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="1.2"
            />

            {/* Connecting lines from corners to center */}
            {[TL, TR, BR, BL].map((v, i) => (
                <line
                    key={i}
                    x1={v.x} y1={v.y}
                    x2={CX} y2={CY}
                    stroke="rgba(255,255,255,0.14)"
                    strokeWidth="0.9"
                    strokeDasharray="4 3"
                />
            ))}

            {/* Corner vertices */}
            {[TL, TR, BR, BL].map((v, i) => (
                <circle key={`c${i}`} cx={v.x} cy={v.y} r="4.5" fill="rgba(255,255,255,0.65)" />
            ))}

            {/* Center node */}
            <circle cx={CX} cy={CY} r="24" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx={CX} cy={CY} r="7" fill="#ffffff" />
            <text x={CX} y={CY + 38} textAnchor="middle" fill="#ffffff" fontFamily="var(--font-display)" fontSize="11" fontWeight="700" letterSpacing="0.06em">
                SYSTEM
            </text>

            {/* Corner labels — integrated into diagram */}
            <text x={TL.x} y={TL.y - 14} textAnchor="middle" fill="rgba(255,255,255,0.78)" fontFamily="var(--font-mono)" fontSize="9.5" fontWeight="600" letterSpacing="0.08em">
                PURPOSE
            </text>
            <text x={TR.x} y={TR.y - 14} textAnchor="middle" fill="rgba(255,255,255,0.78)" fontFamily="var(--font-mono)" fontSize="9.5" fontWeight="600" letterSpacing="0.08em">
                TECHNOLOGY
            </text>
            <text x={BR.x} y={BR.y + 22} textAnchor="middle" fill="rgba(255,255,255,0.78)" fontFamily="var(--font-mono)" fontSize="9.5" fontWeight="600" letterSpacing="0.08em">
                PROCESS
            </text>
            <text x={BL.x} y={BL.y + 22} textAnchor="middle" fill="rgba(255,255,255,0.78)" fontFamily="var(--font-mono)" fontSize="9.5" fontWeight="600" letterSpacing="0.08em">
                OUTCOME
            </text>
        </svg>
    );
}

/* 04. WHAT I CARE ABOUT — People at the center, Balance, Clarity, Reliability */
function CarePattern() {
    return (
        <svg viewBox="0 0 540 350" width="100%" height="100%" style={{ overflow: 'visible', display: 'block' }}>
            {/* Concentric balance orbits */}
            <circle cx="270" cy="175" r="135" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <circle cx="270" cy="175" r="76" fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="270" cy="175" r="26" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />

            {/* Gentle crosshair ticks */}
            <line x1="270" y1="60" x2="270" y2="290" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="150" y1="175" x2="390" y2="175" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="2 2" />

            {/* Orbiting satellites */}
            <circle cx="270" cy="99" r="4" fill="#ffffff" />
            <text x="270" y="82" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontFamily="var(--font-mono)" fontSize="8.5" letterSpacing="0.06em">
                CLARITY
            </text>

            <circle cx="346" cy="175" r="4" fill="#ffffff" />
            <text x="364" y="179" textAnchor="start" fill="rgba(255,255,255,0.75)" fontFamily="var(--font-mono)" fontSize="8.5" letterSpacing="0.06em">
                RELIABILITY
            </text>

            <circle cx="194" cy="175" r="4" fill="#ffffff" />
            <text x="176" y="179" textAnchor="end" fill="rgba(255,255,255,0.75)" fontFamily="var(--font-mono)" fontSize="8.5" letterSpacing="0.06em">
                MAINTAINABILITY
            </text>

            <circle cx="270" cy="251" r="4" fill="#ffffff" />
            <text x="270" y="274" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontFamily="var(--font-mono)" fontSize="8.5" letterSpacing="0.06em">
                PURPOSE
            </text>

            {/* Human core */}
            <circle cx="270" cy="175" r="8" fill="#ffffff" />
            <text x="270" y="214" textAnchor="middle" fill="#ffffff" fontFamily="var(--font-display)" fontSize="12" fontWeight="800" letterSpacing="0.08em">
                PEOPLE
            </text>
        </svg>
    );
}

const PATTERN_COMPONENTS = {
    think: ThinkPattern,
    work: WorkPattern,
    build: BuildPattern,
    care: CarePattern,
};

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────────────────────── */
export default function About() {
    const sectionRef = useRef(null);
    const patternHostRef = useRef(null);
    const patternLayerRef = useRef(null);
    const [activeId, setActiveId] = useState('think');
    const [hoveredId, setHoveredId] = useState(null);
    const [hoveredEdu, setHoveredEdu] = useState(null);
    const [isEduSectionHovered, setIsEduSectionHovered] = useState(false);
    const [isNarrow, setIsNarrow] = useState(false);

    // Shared coordinates for Black-Hole Core & Pattern Visual
    const corePosRef = useRef({ x: 0, y: 0 });
    const shiftRef = useRef({ x: 0, y: 0 });
    const targetShiftRef = useRef({ x: 0, y: 0 });

    const effectiveId = hoveredId ?? activeId;
    const activeConcept = CONCEPTS.find((c) => c.id === effectiveId) ?? CONCEPTS[0];
    const PatternVisual = PATTERN_COMPONENTS[effectiveId] ?? ThinkPattern;

    useEffect(() => {
        const check = () => setIsNarrow(window.innerWidth < 960);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Exact geometric alignment: measure pattern host center relative to section
    useEffect(() => {
        const updateCorePos = () => {
            if (!sectionRef.current || !patternHostRef.current) return;
            const secRect = sectionRef.current.getBoundingClientRect();
            const hostRect = patternHostRef.current.getBoundingClientRect();

            corePosRef.current = {
                x: (hostRect.left + hostRect.width / 2) - secRect.left,
                y: (hostRect.top + hostRect.height / 2) - secRect.top,
            };
        };

        updateCorePos();
        window.addEventListener('resize', updateCorePos);
        return () => window.removeEventListener('resize', updateCorePos);
    }, [effectiveId]);

    // Smooth cursor-responsive animation loop for both black-hole core and pattern visual
    useEffect(() => {
        let rafId;

        const animateShift = () => {
            const cur = shiftRef.current;
            const tgt = targetShiftRef.current;

            // Fluid lerp damping
            cur.x += (tgt.x - cur.x) * 0.08;
            cur.y += (tgt.y - cur.y) * 0.08;

            // Move pattern layer in 1:1 perfect lockstep with the black-hole core
            if (patternLayerRef.current) {
                if (window.innerWidth < 960) {
                    patternLayerRef.current.style.transform = 'none';
                } else {
                    patternLayerRef.current.style.transform = `translate3d(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px, 0)`;
                }
            }

            rafId = requestAnimationFrame(animateShift);
        };

        rafId = requestAnimationFrame(animateShift);
        return () => cancelAnimationFrame(rafId);
    }, []);

    const handleMouseMove = (e) => {
        if (!sectionRef.current || window.innerWidth < 960) return;
        const rect = sectionRef.current.getBoundingClientRect();
        // Normalized cursor offset across section (-1 to 1)
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

        // Controlled, natural atmospheric displacement (max 28px X, 20px Y)
        targetShiftRef.current = {
            x: nx * 28,
            y: ny * 20,
        };
    };

    const handleMouseLeave = () => {
        targetShiftRef.current = { x: 0, y: 0 };
    };

    useEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from('[data-about-reveal]', {
                opacity: 0,
                y: 18,
                duration: 0.65,
                ease: 'power3.out',
                stagger: 0.08,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 84%',
                },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
            <section
                id="about"
                ref={sectionRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    background: '#0f0e0e',
                    color: '#ffffff',
                    padding: '96px 0 104px',
                    position: 'relative',
                    overflow: 'hidden',
                    borderBottom: '1px dashed rgba(255,255,255,0.08)',
                }}
            >
                {/* ── Scroll-driven black-hole transition overlay ──────────── */}
                <HeroAboutTransition sectionRef={sectionRef} />

                {/* ── Layer 1: Atmospheric Dynamic Background ──────────────────── */}
                <AboutBackground coreRef={corePosRef} shiftRef={shiftRef} />

                <div style={{
                    maxWidth: '1240px',
                    margin: '0 auto',
                    padding: '0 clamp(20px, 4vw, 40px)',
                    position: 'relative',
                    zIndex: 2, // Elevated above transition and atmospheric background
                }}>

                    {/* ── Section Header ─────────────────────────────────────────── */}
                    <div data-about-reveal style={{ marginBottom: '48px' }}>
                        <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.38)',
                            display: 'block',
                            marginBottom: '18px',
                        }}>
                            About
                        </span>

                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 800,
                            fontSize: 'clamp(2.5rem, 4.8vw, 4.2rem)',
                            color: '#ffffff',
                            lineHeight: 0.94,
                            letterSpacing: '-0.045em',
                            margin: 0,
                            maxWidth: '820px',
                        }}>
                            Software Developer<br />
                            <span style={{ color: 'rgba(255,255,255,0.30)' }}>building across</span><br />
                            technology and ideas.
                        </h2>
                    </div>

                    {/* ── Core Composition: Asymmetric 46/54 Spatial Distribution ─ */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isNarrow ? '1fr' : 'minmax(0, 0.96fr) minmax(0, 1.14fr)',
                        gap: isNarrow ? '36px' : '48px',
                        alignItems: 'center',
                    }}>

                        {/* Left Column: Interactive Concepts + Selected Thought */}
                        <div data-about-reveal style={{ display: 'flex', flexDirection: 'column' }}>
                            {/* The 4 concepts */}
                            <div style={{ borderTop: '1px dashed rgba(255,255,255,0.08)' }}>
                                {CONCEPTS.map((concept) => {
                                    const isCurrent = concept.id === effectiveId;
                                    return (
                                        <button
                                            key={concept.id}
                                            role="tab"
                                            aria-selected={concept.id === activeId}
                                            tabIndex={0}
                                            onClick={() => setActiveId(concept.id)}
                                            onMouseEnter={() => setHoveredId(concept.id)}
                                            onMouseLeave={() => setHoveredId(null)}
                                            onFocus={() => setHoveredId(concept.id)}
                                            onBlur={() => setHoveredId(null)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'baseline',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                background: 'none',
                                                border: 'none',
                                                borderBottom: '1px dashed rgba(255,255,255,0.08)',
                                                padding: '19px 0',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                transition: 'opacity 0.22s ease',
                                                opacity: isCurrent ? 1 : 0.30,
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                                                <span style={{
                                                    fontFamily: 'var(--font-mono)',
                                                    fontSize: '11px',
                                                    letterSpacing: '0.08em',
                                                    color: isCurrent ? '#ffffff' : 'rgba(255,255,255,0.30)',
                                                    transition: 'color 0.22s ease',
                                                }}>
                                                    {concept.index}
                                                </span>
                                                <span style={{
                                                    fontFamily: 'var(--font-display)',
                                                    fontWeight: 700,
                                                    fontSize: 'clamp(1.4rem, 2.2vw, 1.95rem)',
                                                    color: '#ffffff',
                                                    letterSpacing: '-0.035em',
                                                    lineHeight: 1,
                                                }}>
                                                    {concept.label}
                                                </span>
                                            </div>

                                            <span style={{
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '10.5px',
                                                color: isCurrent ? 'rgba(255,255,255,0.55)' : 'transparent',
                                                letterSpacing: '0.04em',
                                                transition: 'color 0.22s ease',
                                            }}>
                                                {concept.summary}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Selected concept text */}
                            <div style={{ marginTop: '28px' }}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeConcept.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <h3 style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: 'clamp(16px, 1.5vw, 19px)',
                                            fontWeight: 700,
                                            color: '#ffffff',
                                            letterSpacing: '-0.02em',
                                            margin: '0 0 12px 0',
                                        }}>
                                            {activeConcept.summary}
                                        </h3>

                                        <p style={{
                                            fontFamily: 'var(--font-body)',
                                            fontSize: 'clamp(14px, 1.2vw, 15.5px)',
                                            color: 'rgba(255,255,255,0.78)',
                                            lineHeight: 1.72,
                                            margin: 0,
                                            maxWidth: '520px',
                                        }}>
                                            {activeConcept.body}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Right Column: Confident spatial footprint & intentional framing */}
                        <div
                            data-about-reveal
                            ref={patternHostRef}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: isNarrow ? '280px' : '380px',
                                width: '100%',
                                position: 'relative',
                            }}
                        >
                            <div
                                ref={patternLayerRef}
                                style={{
                                    width: '100%',
                                    maxWidth: '580px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    willChange: 'transform',
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={effectiveId}
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.96 }}
                                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <PatternVisual />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                    </div>

                    {/* ── Academic Background (Editorial Ledger) ─────────────────── */}
                    <div
                        data-about-reveal
                        onMouseEnter={() => setIsEduSectionHovered(true)}
                        onMouseLeave={() => setIsEduSectionHovered(false)}
                        style={{
                            marginTop: '64px',
                            paddingTop: '36px',
                            borderTop: isEduSectionHovered
                                ? '1px dashed rgba(255,255,255,0.16)'
                                : '1px dashed rgba(255,255,255,0.08)',
                            transition: 'border-color 0.25s ease',
                        }}
                    >
                        {/* Editorial Header Row: Focus point & typography hierarchy */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            flexWrap: 'wrap',
                            gap: '12px',
                            marginBottom: '30px',
                        }}>
                            <div>
                                {/* Living accent marker + micro-kicker */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '10px',
                                }}>
                                    <span style={{
                                        width: isEduSectionHovered ? '16px' : '8px',
                                        height: '1px',
                                        background: isEduSectionHovered ? '#6840ff' : 'rgba(255,255,255,0.3)',
                                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                                        display: 'inline-block',
                                    }} />
                                    <span style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '10px',
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        color: isEduSectionHovered ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.34)',
                                        transition: 'color 0.22s ease',
                                    }}>
                                        Formal Education
                                    </span>
                                </div>

                                <h3 style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                                    fontWeight: 800,
                                    color: '#ffffff',
                                    letterSpacing: '-0.03em',
                                    margin: 0,
                                    lineHeight: 1.15,
                                    textShadow: isEduSectionHovered ? '0 0 24px rgba(104,64,255,0.22)' : 'none',
                                    transition: 'text-shadow 0.25s ease',
                                }}>
                                    Academic Background
                                </h3>
                            </div>

                            {/* Editorial chronological span */}
                            <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11px',
                                color: isEduSectionHovered ? 'rgba(255,255,255,0.48)' : 'rgba(255,255,255,0.24)',
                                letterSpacing: '0.06em',
                                transition: 'color 0.25s ease',
                            }}>
                                Foundation
                            </span>
                        </div>

                        {/* 3 records: B.Tech prioritized, Intermediate & SSC supporting */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: isNarrow ? '1fr' : '1.24fr 0.9fr 0.86fr',
                            gap: isNarrow ? '26px' : '36px',
                            alignItems: 'baseline',
                        }}>
                            {ACADEMIC_RECORDS.map((rec, idx) => {
                                const isHovered = hoveredEdu === rec.index;
                                return (
                                    <div
                                        key={rec.index}
                                        onMouseEnter={() => setHoveredEdu(rec.index)}
                                        onMouseLeave={() => setHoveredEdu(null)}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            borderLeft: isNarrow || idx === 0
                                                ? 'none'
                                                : isHovered
                                                    ? '1px dashed rgba(255,255,255,0.26)'
                                                    : isEduSectionHovered
                                                        ? '1px dashed rgba(255,255,255,0.12)'
                                                        : '1px dashed rgba(255,255,255,0.07)',
                                            paddingLeft: isNarrow || idx === 0 ? 0 : '24px',
                                            cursor: 'default',
                                            transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                                            transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.22s ease',
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'baseline',
                                            justifyContent: 'space-between',
                                            marginBottom: '6px',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                                <span style={{
                                                    fontFamily: 'var(--font-mono)',
                                                    fontSize: '10px',
                                                    color: isHovered
                                                        ? (rec.isPrimary ? '#6840ff' : '#ffffff')
                                                        : 'rgba(255,255,255,0.26)',
                                                    letterSpacing: '0.08em',
                                                    transition: 'color 0.22s ease',
                                                }}>
                                                    {rec.index}
                                                </span>
                                                <span style={{
                                                    fontFamily: 'var(--font-mono)',
                                                    fontSize: '10.5px',
                                                    color: isHovered
                                                        ? '#ffffff'
                                                        : rec.isPrimary ? 'rgba(255,255,255,0.52)' : 'rgba(255,255,255,0.30)',
                                                    letterSpacing: '0.04em',
                                                    transition: 'color 0.22s ease',
                                                }}>
                                                    {rec.period}
                                                </span>
                                            </div>

                                            <span style={{
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: rec.isPrimary ? '12.5px' : '11px',
                                                fontWeight: 700,
                                                color: isHovered ? '#ffffff' : rec.isPrimary ? '#ffffff' : 'rgba(255,255,255,0.85)',
                                                textShadow: isHovered
                                                    ? (rec.isPrimary ? '0 0 16px rgba(104,64,255,0.4)' : '0 0 12px rgba(255,255,255,0.22)')
                                                    : 'none',
                                                transition: 'all 0.22s ease',
                                            }}>
                                                {rec.score} {rec.scoreLabel && (
                                                    <span style={{
                                                        fontSize: '9.5px',
                                                        fontWeight: 500,
                                                        color: isHovered ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.40)',
                                                        marginLeft: '2px',
                                                        transition: 'color 0.22s ease',
                                                    }}>
                                                        {rec.scoreLabel}
                                                    </span>
                                                )}
                                            </span>
                                        </div>

                                        <h4 style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: rec.isPrimary ? '15.5px' : '14px',
                                            fontWeight: rec.isPrimary ? 700 : 600,
                                            color: isHovered ? '#ffffff' : rec.isPrimary ? '#ffffff' : 'rgba(255,255,255,0.88)',
                                            letterSpacing: '-0.02em',
                                            margin: '0 0 3px 0',
                                            lineHeight: 1.3,
                                            transition: 'color 0.22s ease',
                                        }}>
                                            {rec.institution}
                                        </h4>

                                        <p style={{
                                            fontFamily: 'var(--font-body)',
                                            fontSize: rec.isPrimary ? '13px' : '12.5px',
                                            color: isHovered
                                                ? 'rgba(255,255,255,0.92)'
                                                : rec.isPrimary ? 'rgba(255,255,255,0.68)' : 'rgba(255,255,255,0.50)',
                                            margin: 0,
                                            transition: 'color 0.22s ease',
                                        }}>
                                            {rec.degree}
                                        </p>

                                        {/* Subtle restrained underline response on hover */}
                                        <div style={{
                                            width: isHovered ? '34px' : '12px',
                                            height: '1px',
                                            background: isHovered
                                                ? (rec.isPrimary ? '#6840ff' : 'rgba(255,255,255,0.6)')
                                                : (rec.isPrimary ? 'rgba(104,64,255,0.45)' : 'rgba(255,255,255,0.12)'),
                                            marginTop: '10px',
                                            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                                        }} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </section>
    );
}
