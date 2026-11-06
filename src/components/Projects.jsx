import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiMaximize2, FiX, FiChevronDown } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────
   DATA — factual, curated by role
───────────────────────────────────────────────────── */
const CONFIDO_CARDS = [
    { src: '/confido_home.png',       label: '01', caption: 'Interview Setup & Domain',  desc: 'The candidate selects a target interview domain — the system generates tailored questions for that area.' },
    { src: '/confido_simulation.jpg', label: '02', caption: 'Live Vision Analysis',      desc: 'MediaPipe Face Mesh processes each webcam frame in real time, extracting facial landmarks to track gaze direction and attention consistency.' },
    { src: '/confido_analysis.png',   label: '03', caption: 'Behavioural Telemetry',    desc: 'Eye-contact scores and facial expression data are aggregated into a session-level behavioural profile using face-api.js.' },
    { src: '/confido_results.png',    label: '04', caption: 'Performance Report',    desc: 'A post-interview report delivers per-question evaluation, strengths, gaps, and personalized improvement feedback.' },
];

const CONFIDO_ARCH = [
    { label: 'Frontend',             value: 'React 19 · Vite — interview interface, session views, performance dashboards · Tailwind CSS · React Router · Recharts' },
    { label: 'Computer Vision',      value: 'MediaPipe Face Mesh — eye-contact tracking · face-api.js — facial expression analysis · Web Speech API — spoken-answer transcription' },
    { label: 'Backend',              value: 'Python · FastAPI — API services and session processing · Pydantic · JWT authentication · Uvicorn' },
    { label: 'AI & NLP',             value: 'Google Gemini API — answer evaluation and feedback · spaCy — NLP and content analysis' },
    { label: 'Storage',              value: 'SQLite — user, interview, score, and feedback storage · Dexie.js / IndexedDB — locally cached interview questions' },
];

const CONFIDO_TAGS = ['React', 'FastAPI', 'Google Gemini', 'MediaPipe', 'face-api.js', 'spaCy', 'SQLite'];

const FAKENEWS_ARCH = [
    { label: 'Language',   value: 'Python' },
    { label: 'ML Models',  value: 'Logistic Regression · Decision Tree Classifier · Gradient Boosting Classifier · Random Forest Classifier' },
    { label: 'NLP',        value: 'TF-IDF vectorization · text preprocessing and feature extraction' },
    { label: 'Libraries',  value: 'scikit-learn · Pandas · NumPy · Matplotlib · Seaborn' },
];

const FAKENEWS_TAGS = ['Python', 'scikit-learn', 'TF-IDF', 'Pandas', 'NumPy'];

const FAKENEWS_CLASSIFIERS = [
    { name: 'Logistic Regression',          color: '#6840ff' },
    { name: 'Decision Tree Classifier',     color: '#a1ff62' },
    { name: 'Gradient Boosting Classifier', color: '#f89820' },
    { name: 'Random Forest Classifier',     color: '#f84131' },
];

/* Network: what connects to the DragStack from each side */
const NET_LEFT = [
    { nodeY: '25%', edgeY: '26%', heading: 'FRONTEND',  sub: 'React · Vite' },
    { nodeY: '50%', edgeY: '50%', heading: 'BACKEND',   sub: 'FastAPI · Python' },
    { nodeY: '75%', edgeY: '73%', heading: 'STORAGE',   sub: 'SQLite' },
];
const NET_RIGHT = [
    { nodeY: '25%', edgeY: '26%', heading: 'AI / CV',   sub: 'MediaPipe · face-api.js' },
    { nodeY: '50%', edgeY: '50%', heading: 'NLP',       sub: 'Gemini · spaCy' },
    { nodeY: '75%', edgeY: '73%', heading: 'SPEECH',    sub: 'Web Speech API' },
];

/* ─────────────────────────────────────────────────────
   LIGHTBOX
───────────────────────────────────────────────────── */
function Lightbox({ image, onClose }) {
    useEffect(() => {
        if (!image) return;
        const h = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', h);
        document.body.style.overflow = 'hidden';
        return () => { window.removeEventListener('keydown', h); document.body.style.overflow = ''; };
    }, [image, onClose]);

    if (!image) return null;
    return (
        <AnimatePresence>
            <motion.div key="lb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                <motion.div initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
                    transition={{ type: 'spring', damping: 30, stiffness: 330 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{ maxWidth: '960px', width: '100%', background: '#0a0a0a', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'rgba(255,255,255,0.42)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                            {image.label && `${image.label} / `}{image.caption}
                        </span>
                        <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <FiX size={13} />
                        </button>
                    </div>
                    <div style={{ background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                        <img src={image.src} alt={image.caption}
                            style={{ maxWidth: '100%', maxHeight: '72vh', objectFit: 'contain', display: 'block' }} />
                    </div>
                    {image.desc && (
                        <div style={{ padding: '10px 16px', borderTop: '1px dashed rgba(255,255,255,0.07)' }}>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,0.52)', lineHeight: 1.6, margin: 0 }}>{image.desc}</p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

/* ─────────────────────────────────────────────────────
   DRAG CARD + DRAG STACK
───────────────────────────────────────────────────── */
function DragCard({ card, onDragAway, onExpand, isTop, stackIndex }) {
    const controls     = useAnimation();
    const x            = useMotionValue(0);
    const y            = useMotionValue(0);
    const rotate       = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
    const leftOp       = useTransform(x, [-110, -28, 0], [1, 0.3, 0]);
    const rightOp      = useTransform(x, [0, 28, 110], [0, 0.3, 1]);

    const handleDragEnd = useCallback(async (_, info) => {
        if (Math.abs(info.offset.x) > 80 || Math.abs(info.offset.y) > 80) {
            await controls.start({
                x: info.offset.x > 0 ? 600 : -600,
                y: info.offset.y < 0 ? -380 : 200,
                rotate: info.offset.x > 0 ? 20 : -20,
                opacity: 0,
                transition: { duration: 0.3, ease: 'easeIn' },
            });
            onDragAway();
        } else {
            controls.start({ x: 0, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } });
        }
    }, [controls, onDragAway]);

    return (
        <motion.div
            drag={isTop}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.85}
            onDragEnd={handleDragEnd}
            animate={controls}
            style={{
                x, y,
                rotate: isTop ? rotate : stackIndex * 2,
                position: 'absolute',
                top: stackIndex * 7,
                left: stackIndex * 4,
                zIndex: 10 - stackIndex,
                cursor: isTop ? 'grab' : 'default',
                width: '100%',
                willChange: 'transform',
            }}
            whileTap={isTop ? { cursor: 'grabbing' } : {}}>
            <div style={{
                background: '#0a0a0a',
                border: `1px solid ${isTop ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '4px',
                overflow: 'hidden',
                boxShadow: isTop
                    ? '0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.07)'
                    : `0 ${18 - stackIndex * 5}px ${36 - stackIndex * 8}px rgba(0,0,0,0.30)`,
            }}>
                {/* Header bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 12px', background: '#0d0d0d', borderBottom: '1px dashed rgba(255,255,255,0.07)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: '#a1ff62', letterSpacing: '0.12em' }}>{card.label}</span>
                        <span style={{ width: 1, height: 9, background: 'rgba(255,255,255,0.10)' }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.42)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>{card.caption}</span>
                    </div>
                    {isTop && (
                        <button type="button"
                            onClick={(e) => { e.stopPropagation(); onExpand(card); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, color: 'rgba(255,255,255,0.35)', display: 'flex', transition: 'color 0.18s' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
                            <FiMaximize2 size={12} />
                        </button>
                    )}
                </div>
                {/* Screenshot */}
                <div style={{ height: '300px', position: 'relative', background: '#050505', overflow: 'hidden' }}>
                    <img
                        src={card.src}
                        alt={card.caption}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center center', display: 'block' }}
                        draggable={false}
                    />
                    {isTop && (
                        <>
                            <motion.div style={{ opacity: leftOp, position: 'absolute', top: 10, left: 10, background: '#f84131', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, padding: '2px 9px', borderRadius: '2px', letterSpacing: '0.07em' }}>← PREV</motion.div>
                            <motion.div style={{ opacity: rightOp, position: 'absolute', top: 10, right: 10, background: '#a1ff62', color: '#0d0d0d', fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, padding: '2px 9px', borderRadius: '2px', letterSpacing: '0.07em' }}>NEXT →</motion.div>
                        </>
                    )}
                </div>
            </div>
            {isTop && (
                <motion.div
                    animate={{ opacity: [0.3, 0.65, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                    style={{ position: 'absolute', bottom: '-24px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.10em', whiteSpace: 'nowrap' }}>
                    DRAG TO CYCLE · ⤢ TO EXPAND
                </motion.div>
            )}
        </motion.div>
    );
}

function DragStack({ cardsData, onExpand }) {
    const [cards, setCards] = useState(cardsData.map((c, i) => ({ ...c, key: i })));
    const handleDragAway = useCallback(() => {
        setCards((prev) => { const [top, ...rest] = prev; return [...rest, { ...top, key: top.key + cardsData.length }]; });
    }, [cardsData.length]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '370px' }}>
            {[...cards].reverse().map((card, ri) => {
                const si = cards.length - 1 - ri;
                return <DragCard key={card.key} card={card} isTop={si === 0} stackIndex={si} onDragAway={handleDragAway} onExpand={onExpand} />;
            })}
        </div>
    );
}

/* ─────────────────────────────────────────────────────
   ARCH TABLE
───────────────────────────────────────────────────── */
function ArchTable({ rows }) {
    return (
        <div>
            {rows.map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '14px', padding: '9px 0', borderBottom: i < rows.length - 1 ? '1px dashed rgba(255,255,255,0.08)' : 'none', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>{row.label}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.55 }}>{row.value}</span>
                </div>
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────────────────
   TAG STRIP
───────────────────────────────────────────────────── */
function TagStrip({ tags }) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {tags.map((t) => (
                <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.03em', color: 'rgba(255,255,255,0.55)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', padding: '4px 12px', borderRadius: '2px' }}>
                    {t}
                </span>
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────────────────
   ML PIPELINE GRAPHIC — compact analytical visualization
───────────────────────────────────────────────────── */
function MLPipelineGraphic() {
    const [hoveredStage, setHoveredStage] = useState(null);

    const STAGES = [
        { id: 'input', label: 'News Text', x: 10, desc: 'Raw article input' },
        { id: 'preprocess', label: 'Text Processing', x: 25, desc: 'Cleaning & normalization' },
        { id: 'features', label: 'TF-IDF Vectorization', x: 47, desc: 'Feature extraction' },
        { id: 'models', label: 'Model Prediction', x: 69, desc: '4 classifiers compared' },
        { id: 'output', label: 'Real / Fake', x: 90, desc: 'Classification result' },
    ];

    return (
        <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: '20px' }}>
                ML Analysis Pipeline
            </span>

            {/* Pipeline flow diagram */}
            <div style={{ position: 'relative', height: '160px', marginBottom: '24px' }}>
                {/* Connecting line */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
                    <line x1="12%" y1="40" x2="92%" y2="40" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 3" />
                </svg>

                {/* Stage nodes */}
                {STAGES.map((stage, i) => {
                    const isHovered = hoveredStage === stage.id;
                    const isModel = stage.id === 'models';
                    const isOutput = stage.id === 'output';
                    return (
                        <div
                            key={stage.id}
                            onMouseEnter={() => setHoveredStage(stage.id)}
                            onMouseLeave={() => setHoveredStage(null)}
                            style={{
                                position: 'absolute',
                                left: `${stage.x}%`,
                                top: '22px',
                                transform: 'translateX(-50%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'default',
                                transition: 'opacity 0.15s ease',
                                opacity: hoveredStage && !isHovered ? 0.45 : 1,
                                zIndex: isHovered ? 10 : 1,
                            }}
                        >
                            {/* Node */}
                            <div style={{
                                width: isModel ? 14 : isOutput ? 12 : 10,
                                height: isModel ? 14 : isOutput ? 12 : 10,
                                borderRadius: isOutput ? '2px' : '50%',
                                background: isHovered
                                    ? (isOutput ? '#f84131' : '#6840ff')
                                    : (isOutput ? 'rgba(248,65,49,0.5)' : 'rgba(255,255,255,0.22)'),
                                border: isModel ? '2px solid rgba(255,255,255,0.18)' : 'none',
                                transition: 'all 0.15s ease',
                                transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                                boxShadow: isHovered ? `0 0 10px ${isOutput ? 'rgba(248,65,49,0.3)' : 'rgba(104,64,255,0.3)'}` : 'none',
                            }} />

                            {/* Label */}
                            <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '9px',
                                fontWeight: 700,
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                                color: isHovered ? '#ffffff' : 'rgba(255,255,255,0.50)',
                                textAlign: 'center',
                                whiteSpace: 'nowrap',
                                transition: 'color 0.15s ease',
                            }}>
                                {stage.label}
                            </span>

                            {/* Description on hover */}
                            <span style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '11px',
                                color: 'rgba(255,255,255,0.50)',
                                textAlign: 'center',
                                whiteSpace: 'nowrap',
                                opacity: isHovered ? 1 : 0,
                                transform: isHovered ? 'translateY(0)' : 'translateY(-4px)',
                                transition: 'opacity 0.15s ease, transform 0.15s ease',
                            }}>
                                {stage.desc}
                            </span>
                        </div>
                    );
                })}

                {/* Direction arrows between stages */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
                    {[0, 1, 2, 3].map((i) => {
                        const x = `${(STAGES[i].x + STAGES[i + 1].x) / 2}%`;
                        return (
                            <text key={i} x={x} y="43" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontFamily="var(--font-mono)" fontSize="10">→</text>
                        );
                    })}
                </svg>
            </div>

            {/* Four classifiers */}
            <div style={{
                paddingTop: '16px',
                borderTop: '1px dashed rgba(255,255,255,0.08)',
            }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: '12px' }}>
                    Classifiers Compared
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                    {FAKENEWS_CLASSIFIERS.map((c) => (
                        <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                                width: 6, height: 6, borderRadius: '50%',
                                background: c.color, flexShrink: 0,
                            }} />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.65)', lineHeight: 1.3 }}>
                                {c.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────
   PROJECT NETWORK
───────────────────────────────────────────────────── */
function ProjectNetwork({ isInView, prefersReduced }) {
    const show = !prefersReduced && isInView;

    const LE = '20.7%';
    const RE = '79.3%';

    return (
        <>
            <svg
                width="100%" height="100%"
                style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
                aria-hidden="true"
            >
                <rect
                    x={LE} y="12%" width="58.6%" height="74%"
                    fill="none"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="1"
                    strokeDasharray="5 4"
                    rx="4"
                />

                {NET_LEFT.map((n, i) => (
                    <g key={`ln-${i}`}>
                        <circle cx="4.5%" cy={n.nodeY} r="2.5" fill="rgba(255,255,255,0.18)" />
                        <motion.line
                            x1="4.5%" y1={n.nodeY}
                            x2={LE}   y2={n.edgeY}
                            stroke="rgba(255,255,255,0.10)"
                            strokeWidth="0.75"
                            strokeDasharray="300"
                            initial={{ strokeDashoffset: 300 }}
                            animate={{ strokeDashoffset: show ? 0 : 300 }}
                            transition={{ duration: 0.75, delay: 0.08 + i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                        />
                        <motion.circle
                            cx={LE} cy={n.edgeY} r="2"
                            fill="rgba(104,64,255,0.18)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: show ? 1 : 0 }}
                            transition={{ duration: 0.3, delay: 0.7 + i * 0.13 }}
                        />
                    </g>
                ))}

                {NET_RIGHT.map((n, i) => (
                    <g key={`rn-${i}`}>
                        <circle cx="95.5%" cy={n.nodeY} r="2.5" fill="rgba(255,255,255,0.18)" />
                        <motion.line
                            x1="95.5%" y1={n.nodeY}
                            x2={RE}    y2={n.edgeY}
                            stroke="rgba(255,255,255,0.10)"
                            strokeWidth="0.75"
                            strokeDasharray="300"
                            initial={{ strokeDashoffset: 300 }}
                            animate={{ strokeDashoffset: show ? 0 : 300 }}
                            transition={{ duration: 0.75, delay: 0.25 + i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                        />
                        <motion.circle
                            cx={RE} cy={n.edgeY} r="2"
                            fill="rgba(104,64,255,0.18)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: show ? 1 : 0 }}
                            transition={{ duration: 0.3, delay: 0.85 + i * 0.13 }}
                        />
                    </g>
                ))}
            </svg>

            {NET_LEFT.map((n, i) => (
                <div key={`ll-${i}`} style={{
                    position: 'absolute',
                    left: 0,
                    top: `calc(${n.nodeY} - 18px)`,
                    width: '18%',
                    textAlign: 'right',
                    paddingRight: '20px',
                    pointerEvents: 'none',
                    zIndex: 2,
                }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', display: 'block', lineHeight: 1.5 }}>
                        {n.heading}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.28)', display: 'block', lineHeight: 1.5 }}>
                        {n.sub}
                    </span>
                </div>
            ))}

            {NET_RIGHT.map((n, i) => (
                <div key={`rl-${i}`} style={{
                    position: 'absolute',
                    right: 0,
                    top: `calc(${n.nodeY} - 18px)`,
                    width: '18%',
                    paddingLeft: '20px',
                    pointerEvents: 'none',
                    zIndex: 2,
                }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', display: 'block', lineHeight: 1.5 }}>
                        {n.heading}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.28)', display: 'block', lineHeight: 1.5 }}>
                        {n.sub}
                    </span>
                </div>
            ))}
        </>
    );
}

/* ─────────────────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────────────────── */
export default function Projects() {
    const sectionRef   = useRef(null);
    const networkRef   = useRef(null);

    const [lightbox,      setLightbox]      = useState(null);
    const [fnExpanded,    setFnExpanded]    = useState(false);
    const [networkInView, setNetworkInView] = useState(false);
    const [isDesktop,     setIsDesktop]     = useState(true);

    const [prefersReduced] = useState(() =>
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    useEffect(() => {
        const check = () => setIsDesktop(window.innerWidth >= 900);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        const el = networkRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setNetworkInView(true); }, { threshold: 0.25 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray('[data-reveal]').forEach((el) => {
                gsap.from(el, {
                    y: 24, opacity: 0, duration: 0.7, ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 88%' },
                });
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            id="projects"
            ref={sectionRef}
            style={{ background: '#0f0e0e', color: '#ffffff', position: 'relative' }}
        >
            <Lightbox image={lightbox} onClose={() => setLightbox(null)} />

            {/* ── Section header ── */}
            <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '88px 40px 0' }}>
                    <div data-reveal style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '36px', flexWrap: 'wrap', gap: '24px' }}>
                        <div>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', display: 'block', marginBottom: '14px' }}>
                                Selected Work
                            </span>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2.6rem, 4.8vw, 4.2rem)', color: '#ffffff', lineHeight: 0.93, letterSpacing: '-0.05em', margin: 0 }}>
                                Projects &<br /><span style={{ color: '#6840ff' }}>applied systems</span>
                            </h2>
                        </div>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'rgba(255,255,255,0.48)', maxWidth: '280px', lineHeight: 1.72, margin: 0 }}>
                            Full-stack systems with real-time AI pipelines and machine learning classifiers — built and shipped.
                        </p>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════
                PROJECT 01 — Confido AI
            ═══════════════════════════════════════════════════ */}
            <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 40px' }}>

                    {/* Project index */}
                    <div data-reveal style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '44px 0 12px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#6840ff' }}>01</span>
                        <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.13)' }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.09em', color: '#a8a8a8', textTransform: 'uppercase' }}>Full-Stack · AI Capstone</span>
                    </div>

                    {/* Title */}
                    <div data-reveal>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(3rem, 5.5vw, 5.2rem)', color: '#ffffff', lineHeight: 0.88, letterSpacing: '-0.055em', margin: '0 0 8px' }}>
                            Confido<span style={{ color: '#6840ff' }}>AI</span>
                        </h3>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(14px, 1.1vw, 16px)', color: 'rgba(255,255,255,0.48)', display: 'block', marginBottom: '18px' }}>
                            AI-Powered Interview Performance Analyzer
                        </span>
                    </div>

                    {/* Description — accurate, professional */}
                    <div data-reveal>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 1.3vw, 17px)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.82, margin: '0 0 52px', maxWidth: 'min(860px, 100%)' }}>
                            Confido AI is an intelligent interview preparation platform designed to help candidates
                            strengthen both their answers and their on-camera communication. Users choose an interview
                            domain and participate in interactive mock sessions while the system evaluates response
                            quality, speech delivery, facial expressions, and eye contact. Following each session, a
                            detailed performance report highlights strengths, identifies gaps in the answers, and offers
                            personalized guidance to improve clarity, confidence, and overall interview readiness.
                        </p>
                    </div>

                    {/* ── Visual zone — DragStack as center of gravity ── */}
                    <div
                        ref={networkRef}
                        data-reveal
                        style={{
                            position: 'relative',
                            height: isDesktop ? '500px' : 'auto',
                            marginBottom: isDesktop ? '56px' : '36px',
                        }}
                    >
                        {isDesktop && (
                            <ProjectNetwork
                                isInView={networkInView}
                                prefersReduced={prefersReduced}
                            />
                        )}

                        <div style={{
                            position: isDesktop ? 'absolute' : 'relative',
                            top:       isDesktop ? '60px' : 'auto',
                            left:      isDesktop ? '50%' : 'auto',
                            transform: isDesktop ? 'translateX(-50%)' : 'none',
                            width:     isDesktop ? '680px' : '100%',
                            zIndex:    1,
                        }}>
                            <DragStack cardsData={CONFIDO_CARDS} onExpand={(c) => setLightbox(c)} />
                        </div>
                    </div>

                    {/* Architecture + actions */}
                    <div data-reveal style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)',
                        gap: '48px',
                        paddingTop: '28px',
                        paddingBottom: '60px',
                        borderTop: '1px dashed rgba(255,255,255,0.08)',
                        alignItems: 'start',
                    }}>
                        <div>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: '14px' }}>Architecture</span>
                            <ArchTable rows={CONFIDO_ARCH} />
                            <div style={{ marginTop: '20px' }}>
                                <TagStrip tags={CONFIDO_TAGS} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: '6px' }}>Links</span>
                            <a
                                href="https://ai-powered-interview-performance-an.vercel.app/"
                                target="_blank" rel="noopener noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 22px', background: '#a1ff62', color: '#0d0d0d', fontFamily: 'var(--font-mono)', fontSize: '12.5px', fontWeight: 700, letterSpacing: '0.05em', textDecoration: 'none', borderRadius: '4px', transition: 'background 0.2s' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#6840ff', e.currentTarget.style.color = '#ffffff')}
                                onMouseLeave={e => (e.currentTarget.style.background = '#a1ff62', e.currentTarget.style.color = '#0d0d0d')}>
                                Live Demo <FiExternalLink size={13} />
                            </a>
                            <a
                                href="https://github.com/MohanReddy-5/AI-Powered-Interview-Performance-Analyzer"
                                target="_blank" rel="noopener noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 22px', background: 'transparent', color: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: '12.5px', fontWeight: 700, letterSpacing: '0.05em', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', transition: 'background 0.2s, border-color 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}>
                                <FiGithub size={13} /> View Codebase
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════
                PROJECT 02 — Fake News Classifier
            ═══════════════════════════════════════════════════ */}
            <div>
                <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 40px' }}>

                    {/* Always-visible compact row — no accuracy label */}
                    <button
                        onClick={() => setFnExpanded(!fnExpanded)}
                        style={{
                            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                            padding: '28px 0',
                            borderBottom: fnExpanded ? '1px dashed rgba(255,255,255,0.07)' : 'none',
                            display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
                        }}
                    >
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#f84131', flexShrink: 0 }}>02</span>
                        <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.05rem, 1.9vw, 1.3rem)', color: '#ffffff', letterSpacing: '-0.03em', flex: 1, textAlign: 'left' }}>
                            Fake News Classifier
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#a8a8a8', letterSpacing: '0.04em', flexShrink: 0 }}>Python · scikit-learn · TF-IDF</span>
                        <motion.span animate={{ rotate: fnExpanded ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ display: 'flex', flexShrink: 0 }}>
                            <FiChevronDown size={15} color="#a0a0a0" />
                        </motion.span>
                    </button>

                    {/* Expanded detail */}
                    <AnimatePresence>
                        {fnExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.36, ease: [0.25, 0.46, 0.45, 0.94] }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 0.65fr)', gap: '60px', padding: '36px 0 52px', alignItems: 'start' }}>
                                    <div>
                                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(14px, 1.2vw, 16.5px)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.82, margin: '0 0 28px', maxWidth: '520px' }}>
                                            An NLP-based machine learning project that classifies news articles as real or fake
                                            by examining patterns in their textual content. It applies text preprocessing and
                                            feature extraction before comparing predictions from four supervised learning models,
                                            demonstrating how linguistic signals can support automated misinformation detection.
                                        </p>
                                        <div style={{ marginBottom: '18px', paddingBottom: '18px', borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: '12px' }}>Architecture</span>
                                            <ArchTable rows={FAKENEWS_ARCH} />
                                        </div>
                                        <div style={{ marginBottom: '24px' }}><TagStrip tags={FAKENEWS_TAGS} /></div>
                                        <a
                                            href="https://github.com/MohanReddy-5/Fake-News-Detection"
                                            target="_blank" rel="noopener noreferrer"
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: 'transparent', color: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: '12.5px', fontWeight: 700, letterSpacing: '0.05em', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', transition: 'background 0.2s, border-color 0.2s, color 0.2s' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#f84131'; e.currentTarget.style.borderColor = '#f84131'; e.currentTarget.style.color = '#ffffff'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#ffffff'; }}>
                                            <FiGithub size={13} /> View Codebase
                                        </a>
                                    </div>
                                    <div style={{ paddingTop: '4px' }}>
                                        <MLPipelineGraphic />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div style={{ borderTop: '1px dashed rgba(255,255,255,0.08)' }} />
        </section>
    );
}
