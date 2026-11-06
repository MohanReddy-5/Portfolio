import { useState, useRef, useEffect, useCallback } from 'react';
import { FiArrowUpRight, FiCheck, FiSend, FiAlertCircle, FiX } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Custom Inline SVG Rocket ── */
function CustomRocket({ rocketRef, isLaunching }) {
    return (
        <div
            ref={rocketRef}
            style={{
                position: 'absolute',
                bottom: '0',
                left: '50px',
                pointerEvents: 'none',
                opacity: 0,
                zIndex: 100,
                transform: 'translate(-50%, 0)',
            }}
        >
            <div style={{ position: 'relative', width: 44, height: 56 }}>
                <svg
                    width="44" height="56" viewBox="0 0 44 56"
                    fill="none" xmlns="http://www.w3.org/2000/svg"
                    style={{ transform: 'rotate(35deg)', filter: 'drop-shadow(0 0 14px rgba(161,255,98,0.45))' }}
                >
                    <path d="M22 2 C28 14 34 24 34 38 L10 38 C10 24 16 14 22 2 Z" fill="#ffffff" />
                    <path d="M22 2 C25 8 28 14 28 17 L16 17 C16 14 19 8 22 2 Z" fill="#a1ff62" />
                    <circle cx="22" cy="24" r="3.5" fill="#0c0b0b" stroke="#a1ff62" strokeWidth="1.5" />
                    <path d="M10 30 L3 42 L11 39 Z" fill="#b8b8b8" />
                    <path d="M34 30 L41 42 L33 39 Z" fill="#b8b8b8" />
                    <rect x="18" y="38" width="8" height="4" rx="1" fill="#312e2e" />
                    <path
                        d="M19 42 Q22 55 22 55 Q22 55 25 42 Z"
                        fill="url(#rocketFlameGrad)"
                        opacity={isLaunching ? 1 : 0.8}
                    />
                    <defs>
                        <linearGradient id="rocketFlameGrad" x1="22" y1="42" x2="22" y2="55" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#a1ff62" />
                            <stop offset="50%" stopColor="#6840ff" />
                            <stop offset="100%" stopColor="#f84131" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
                {isLaunching && (
                    <div style={{
                        position: 'absolute', bottom: -10, left: '50%',
                        transform: 'translateX(-50%)', width: 4, height: 14,
                        background: 'linear-gradient(to bottom, #a1ff62, transparent)',
                        borderRadius: 2, filter: 'blur(1px)',
                    }} />
                )}
            </div>
        </div>
    );
}

/* ── Contact node logos as inline SVGs (prominent, ~40-48px) ── */
function LinkedInLogo({ size = 44 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

function GitHubLogo({ size = 44 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
    );
}

function EmailLogo({ size = 44 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 4L12 13L2 4" />
        </svg>
    );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONTACT — Hub-and-spoke network with 3 prominent contact nodes
   Central "LET'S CONNECT." hub → LinkedIn, Email, GitHub
   "Send a Message" action integrated with Email node
   ───────────────────────────────────────────────────────────────────────────── */
export default function Contact() {
    const sectionRef       = useRef(null);
    const hubRef           = useRef(null);
    const svgRef           = useRef(null);
    const pathRefs         = useRef([]);
    const nodeRefs         = useRef([]);
    const rocketRef        = useRef(null);
    const formFirstInput   = useRef(null);

    const [form, setForm]                 = useState({ name: '', email: '', message: '' });
    const [status, setStatus]             = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLaunching, setIsLaunching]   = useState(false);
    const [hoveredNode, setHoveredNode]   = useState(null);
    const [showForm, setShowForm]         = useState(false);
    const [isMobile, setIsMobile]         = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        if (showForm && formFirstInput.current) {
            formFirstInput.current.focus();
        }
    }, [showForm]);

    const handleChange = (key) => (e) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

    const triggerRocketFlight = useCallback(() => {
        const rocket = rocketRef.current;
        if (!rocket) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        setIsLaunching(true);
        gsap.set(rocket, { x: 0, y: 0, scale: 0.6, opacity: 0, rotation: 0 });
        const tl = gsap.timeline({ onComplete: () => { setIsLaunching(false); gsap.set(rocket, { opacity: 0 }); } });
        tl.to(rocket, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' })
          .to(rocket, { x: 320, y: -450, rotation: 40, scale: 1.1, duration: 1.4, ease: 'power2.in' })
          .to(rocket, { opacity: 0, scale: 0.8, duration: 0.25, ease: 'power1.out' }, '-=0.25');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            setErrorMessage('Please fill in all fields.');
            return;
        }
        setStatus('sending');
        setErrorMessage('');
        try {
            const res = await fetch('https://formsubmit.co/ajax/mohandharmala5@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    name: form.name, email: form.email, message: form.message,
                    _subject: `Portfolio Message from ${form.name}`, _template: 'table',
                }),
            });
            if (res.ok) { setStatus('sent'); triggerRocketFlight(); setForm({ name: '', email: '', message: '' }); }
            else launchMailtoFallback();
        } catch (err) {
            console.warn('Direct POST unavailable, using mailto fallback', err);
            launchMailtoFallback();
        }
    };

    const launchMailtoFallback = () => {
        const subject = encodeURIComponent(`Portfolio Message from ${form.name}`);
        const body    = encodeURIComponent(`Hi Mohan,\n\n${form.message}\n\n---\nSender: ${form.name}\nEmail: ${form.email}`);
        window.location.href = `mailto:mohandharmala5@gmail.com?subject=${subject}&body=${body}`;
        setStatus('sent'); triggerRocketFlight(); setForm({ name: '', email: '', message: '' });
    };

    /* ── SVG entrance animation ── */
    useEffect(() => {
        if (!sectionRef.current) return;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const ctx = gsap.context(() => {
            /* Hub heading */
            if (hubRef.current) {
                gsap.from(hubRef.current, {
                    y: 24, opacity: 0, scale: 0.92, duration: 0.7, ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
                });
            }

            if (!prefersReduced) {
                /* Connector paths — stroke-dashoffset draw */
                pathRefs.current.forEach((path, i) => {
                    if (!path) return;
                    try {
                        const len = path.getTotalLength();
                        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
                        gsap.to(path, {
                            strokeDashoffset: 0,
                            duration: 0.9, ease: 'power2.inOut',
                            delay: 0.3 + i * 0.12,
                            scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
                        });
                    } catch (_) { /* SVG method may not be available yet */ }
                });

                /* Node containers */
                nodeRefs.current.forEach((el, i) => {
                    if (!el) return;
                    gsap.from(el, {
                        opacity: 0, y: 16, scale: 0.9, duration: 0.5, ease: 'back.out(1.4)',
                        delay: 0.6 + i * 0.12,
                        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
                    });
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [isMobile]);

    /* ── Input styles ── */
    const inputStyle = {
        width: '100%', background: 'transparent', border: 'none',
        borderBottom: '1.5px solid rgba(255,255,255,0.14)',
        padding: '10px 0 12px 0', fontFamily: 'var(--font-body)',
        fontSize: '15px', color: '#ffffff', outline: 'none',
        transition: 'border-color 0.22s ease', boxSizing: 'border-box',
    };
    const labelStyle = {
        display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px',
        fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.40)', marginBottom: '6px',
    };
    const handleFocus = (e) => { e.target.style.borderBottomColor = '#a1ff62'; };
    const handleBlur  = (e) => { e.target.style.borderBottomColor = 'rgba(255,255,255,0.14)'; };

    /* ── Contact nodes ── */
    const NODES = [
        {
            key: 'linkedin',
            label: 'LINKEDIN',
            value: 'mohan-reddy-tech',
            href: 'https://linkedin.com/in/mohan-reddy-tech',
            Logo: LinkedInLogo,
            angle: 225, // lower-left
        },
        {
            key: 'email',
            label: 'EMAIL',
            value: 'mohandharmala5@gmail.com',
            href: 'mailto:mohandharmala5@gmail.com',
            Logo: EmailLogo,
            angle: 0, // right
        },
        {
            key: 'github',
            label: 'GITHUB',
            value: 'MohanReddy-5',
            href: 'https://github.com/MohanReddy-5',
            Logo: GitHubLogo,
            angle: 135, // lower-right (from center)
        },
    ];

    /* ── Desktop layout positions (viewBox 0 0 1000 520) ── */
    const HUB = { x: 500, y: 240 };
    const NODE_POS = [
        { x: 120, y: 380 },   // LinkedIn — lower-left
        { x: 880, y: 180 },   // Email — upper-right
        { x: 880, y: 420 },   // GitHub — lower-right
    ];

    /* Curved connector paths */
    const CONNECTOR_PATHS = [
        `M${HUB.x},${HUB.y} C${HUB.x - 160},${HUB.y + 30} ${NODE_POS[0].x + 120},${NODE_POS[0].y - 50} ${NODE_POS[0].x},${NODE_POS[0].y}`,
        `M${HUB.x},${HUB.y} C${HUB.x + 120},${HUB.y - 50} ${NODE_POS[1].x - 140},${NODE_POS[1].y + 20} ${NODE_POS[1].x},${NODE_POS[1].y}`,
        `M${HUB.x},${HUB.y} C${HUB.x + 140},${HUB.y + 60} ${NODE_POS[2].x - 120},${NODE_POS[2].y - 30} ${NODE_POS[2].x},${NODE_POS[2].y}`,
    ];

    /* Convert SVG coords to percentage positions for DOM overlays */
    const toPercent = (pos) => ({
        left: `${(pos.x / 1000) * 100}%`,
        top: `${(pos.y / 520) * 100}%`,
    });

    return (
        <section
            id="contact"
            ref={sectionRef}
            style={{
                background: '#0a0a0a',
                color: '#ffffff',
                position: 'relative',
                overflow: 'visible',
                borderTop: '1px dashed rgba(255,255,255,0.10)',
                padding: 'clamp(72px, 9vh, 112px) 0 clamp(56px, 7vh, 84px)',
            }}
        >
            <div style={{
                maxWidth: '1240px',
                margin: '0 auto',
                padding: '0 clamp(24px, 4.5vw, 44px)',
                position: 'relative',
                zIndex: 2,
            }}>
                {/* ── Section marker ── */}
                <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.25)', display: 'block', marginBottom: '28px',
                }}>
                    06 / Contact
                </span>

                {/* ══════════════════════════════════════════════════════
                    DESKTOP: Hub-and-spoke network
                    ═════════════════════════════════════════════════════ */}
                {!isMobile ? (
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: 'clamp(380px, 48vw, 520px)',
                        marginBottom: showForm ? '24px' : 'clamp(40px, 5vh, 64px)',
                    }}>
                        {/* SVG connector layer */}
                        <svg
                            ref={svgRef}
                            viewBox="0 0 1000 520"
                            preserveAspectRatio="xMidYMid meet"
                            style={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                pointerEvents: 'none',
                                zIndex: 1,
                                overflow: 'visible',
                            }}
                        >
                            {/* Connector curves */}
                            {CONNECTOR_PATHS.map((d, i) => {
                                const isActive = hoveredNode === NODES[i].key;
                                return (
                                    <path
                                        key={NODES[i].key}
                                        ref={(el) => { pathRefs.current[i] = el; }}
                                        d={d}
                                        fill="none"
                                        stroke={isActive ? 'rgba(161,255,98,0.45)' : 'rgba(255,255,255,0.10)'}
                                        strokeWidth={isActive ? '1.5' : '1'}
                                        style={{ transition: 'stroke 0.25s ease, stroke-width 0.25s ease' }}
                                    />
                                );
                            })}

                            {/* Hub dot */}
                            <circle cx={HUB.x} cy={HUB.y} r="5" fill="rgba(161,255,98,0.35)" />
                            <circle cx={HUB.x} cy={HUB.y} r="2" fill="#a1ff62" />

                            {/* Node endpoint dots */}
                            {NODE_POS.map((pos, i) => (
                                <circle
                                    key={i}
                                    cx={pos.x} cy={pos.y} r="3"
                                    fill={hoveredNode === NODES[i].key ? '#a1ff62' : 'rgba(255,255,255,0.20)'}
                                    style={{ transition: 'fill 0.25s ease' }}
                                />
                            ))}
                        </svg>

                        {/* Central hub heading */}
                        <div
                            ref={hubRef}
                            style={{
                                position: 'absolute',
                                left: `${(HUB.x / 1000) * 100}%`,
                                top: `${(HUB.y / 520) * 100}%`,
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center',
                                zIndex: 4,
                                pointerEvents: 'none',
                            }}
                        >
                            <h2 style={{
                                fontFamily: 'var(--font-display)',
                                fontWeight: 800,
                                fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
                                lineHeight: 0.9,
                                letterSpacing: '-0.04em',
                                margin: '0 0 8px',
                                whiteSpace: 'nowrap',
                            }}>
                                <span style={{ color: '#ffffff' }}>LET'S </span>
                                <span style={{ color: '#a1ff62' }}>CONNECT.</span>
                            </h2>
                            <p style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '10px',
                                fontWeight: 600,
                                letterSpacing: '0.10em',
                                textTransform: 'uppercase',
                                color: 'rgba(255,255,255,0.28)',
                                margin: 0,
                            }}>
                                Mohan Reddy
                            </p>
                        </div>

                        {/* ── Contact node cards ── */}
                        {NODES.map((node, i) => {
                            const pos = toPercent(NODE_POS[i]);
                            const isActive = hoveredNode === node.key;
                            const isEmail = node.key === 'email';
                            const alignRight = NODE_POS[i].x > 500;

                            return (
                                <div
                                    key={node.key}
                                    ref={(el) => { nodeRefs.current[i] = el; }}
                                    onMouseEnter={() => setHoveredNode(node.key)}
                                    onMouseLeave={() => setHoveredNode(null)}
                                    style={{
                                        position: 'absolute',
                                        ...pos,
                                        transform: alignRight
                                            ? 'translate(-10%, -50%)'
                                            : 'translate(-90%, -50%)',
                                        zIndex: 5,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: alignRight ? 'flex-start' : 'flex-end',
                                        gap: '10px',
                                    }}
                                >
                                    {/* Logo circle + label row */}
                                    <a
                                        href={node.href}
                                        target={node.href.startsWith('http') ? '_blank' : undefined}
                                        rel={node.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '14px',
                                            textDecoration: 'none',
                                            flexDirection: alignRight ? 'row' : 'row-reverse',
                                        }}
                                    >
                                        {/* Prominent logo circle */}
                                        <div style={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: '50%',
                                            background: isActive ? 'rgba(161,255,98,0.10)' : 'rgba(255,255,255,0.04)',
                                            border: `1.5px solid ${isActive ? 'rgba(161,255,98,0.35)' : 'rgba(255,255,255,0.10)'}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: isActive ? '#a1ff62' : 'rgba(255,255,255,0.50)',
                                            transition: 'all 0.25s ease',
                                            flexShrink: 0,
                                        }}>
                                            <node.Logo size={28} />
                                        </div>

                                        {/* Label + value */}
                                        <div style={{ textAlign: alignRight ? 'left' : 'right' }}>
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                letterSpacing: '0.10em',
                                                textTransform: 'uppercase',
                                                color: isActive ? '#a1ff62' : 'rgba(255,255,255,0.55)',
                                                transition: 'color 0.25s ease',
                                                justifyContent: alignRight ? 'flex-start' : 'flex-end',
                                                marginBottom: '3px',
                                            }}>
                                                {node.label}
                                                <FiArrowUpRight size={11} style={{ opacity: isActive ? 1 : 0.4, transition: 'opacity 0.25s' }} />
                                            </span>
                                            <span style={{
                                                fontFamily: 'var(--font-body)',
                                                fontSize: '12.5px',
                                                color: isActive ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.28)',
                                                letterSpacing: '0.01em',
                                                transition: 'color 0.25s ease',
                                                display: 'block',
                                                maxWidth: '220px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                {node.value}
                                            </span>
                                        </div>
                                    </a>

                                    {/* "Send a Message" button — attached to Email node */}
                                    {isEmail && (
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(!showForm)}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                background: showForm ? 'rgba(255,255,255,0.06)' : 'transparent',
                                                border: `1px solid ${showForm ? 'rgba(161,255,98,0.30)' : 'rgba(255,255,255,0.12)'}`,
                                                borderRadius: '1600px',
                                                padding: '8px 18px',
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '10.5px',
                                                fontWeight: 700,
                                                letterSpacing: '0.06em',
                                                textTransform: 'uppercase',
                                                color: showForm ? '#a1ff62' : 'rgba(255,255,255,0.50)',
                                                cursor: 'pointer',
                                                transition: 'all 0.25s ease',
                                                marginLeft: alignRight ? '78px' : 0,
                                                marginRight: alignRight ? 0 : '78px',
                                            }}
                                            onMouseEnter={(e) => { if (!showForm) { e.currentTarget.style.borderColor = 'rgba(161,255,98,0.30)'; e.currentTarget.style.color = '#a1ff62'; } }}
                                            onMouseLeave={(e) => { if (!showForm) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.50)'; } }}
                                        >
                                            <FiSend size={11} />
                                            {showForm ? 'Close Form' : 'Send a Message'}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* ══════════════════════════════════════════════════════
                       MOBILE: Stacked heading + vertical links
                       ═════════════════════════════════════════════════════ */
                    <div style={{ marginBottom: 'clamp(32px, 5vh, 52px)' }}>
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 800,
                            fontSize: 'clamp(2.6rem, 9vw, 4rem)',
                            lineHeight: 0.9,
                            letterSpacing: '-0.04em',
                            margin: '0 0 8px',
                        }}>
                            LET'S<br /><span style={{ color: '#a1ff62' }}>CONNECT.</span>
                        </h2>
                        <p style={{
                            fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
                            letterSpacing: '0.10em', textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.28)', margin: '0 0 32px',
                        }}>
                            Mohan Reddy
                        </p>

                        {/* Vertical endpoint list */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {NODES.map((node) => (
                                <a
                                    key={node.key}
                                    href={node.href}
                                    target={node.href.startsWith('http') ? '_blank' : undefined}
                                    rel={node.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '16px 0',
                                        borderBottom: '1px dashed rgba(255,255,255,0.08)',
                                        textDecoration: 'none',
                                        color: 'rgba(255,255,255,0.60)',
                                        transition: 'color 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#a1ff62'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.60)'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <node.Logo size={20} />
                                        <span style={{
                                            fontFamily: 'var(--font-mono)', fontSize: '11px',
                                            fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                                        }}>{node.label}</span>
                                    </div>
                                    <span style={{
                                        fontFamily: 'var(--font-body)', fontSize: '12px',
                                        color: 'rgba(255,255,255,0.30)', maxWidth: '160px',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    }}>{node.value}</span>
                                </a>
                            ))}
                        </div>

                        {/* Mobile: Send Message toggle */}
                        <button
                            type="button"
                            onClick={() => setShowForm(!showForm)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginTop: '24px',
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: '1600px',
                                padding: '10px 20px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11px',
                                fontWeight: 700,
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                                color: showForm ? '#a1ff62' : 'rgba(255,255,255,0.55)',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                            }}
                        >
                            <FiSend size={12} />
                            {showForm ? 'Close Form' : 'Send a Message'}
                        </button>
                    </div>
                )}

                {/* ── Integrated message form (slides in when showForm is true) ── */}
                <div
                    id="contact-form"
                    style={{
                        maxWidth: isMobile ? '100%' : '440px',
                        marginLeft: isMobile ? 0 : 'auto',
                        marginRight: isMobile ? 0 : '0',
                        position: 'relative',
                        overflow: 'visible',
                        maxHeight: showForm ? '600px' : '0',
                        opacity: showForm ? 1 : 0,
                        transition: 'max-height 0.4s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.35s ease',
                        pointerEvents: showForm ? 'auto' : 'none',
                    }}
                >
                    {/* Form header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingTop: '8px' }}>
                        <div>
                            <span style={{
                                fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700,
                                letterSpacing: '0.10em', textTransform: 'uppercase',
                                color: 'rgba(255,255,255,0.40)', display: 'block', marginBottom: '4px',
                            }}>
                                Direct Message
                            </span>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'rgba(255,255,255,0.25)' }}>
                                Delivers directly to my inbox.
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            style={{
                                width: 28, height: 28, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.10)',
                                color: 'rgba(255,255,255,0.40)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'color 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.40)'}
                        >
                            <FiX size={13} />
                        </button>
                    </div>

                    {status === 'sent' ? (
                        <div style={{
                            padding: '28px 0',
                            borderTop: '1px solid rgba(161,255,98,0.25)',
                            borderBottom: '1px solid rgba(161,255,98,0.25)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <FiCheck size={18} style={{ color: '#a1ff62' }} />
                                <span style={{
                                    fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700,
                                    letterSpacing: '0.08em', textTransform: 'uppercase', color: '#a1ff62',
                                }}>
                                    Message Sent
                                </span>
                            </div>
                            <p style={{
                                fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.6,
                                color: 'rgba(255,255,255,0.72)', margin: '0 0 16px 0',
                            }}>
                                Thank you! Your message has been delivered. I'll review and reply shortly.
                            </p>
                            <button
                                type="button"
                                onClick={() => setStatus('idle')}
                                style={{
                                    fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                                    color: '#a1ff62', background: 'transparent', border: 'none',
                                    cursor: 'pointer', padding: 0, textDecoration: 'underline',
                                }}
                            >
                                Send another message →
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                            <div>
                                <label style={labelStyle}>Your Name</label>
                                <input
                                    ref={formFirstInput}
                                    type="text" required placeholder="Your name"
                                    value={form.name} onChange={handleChange('name')}
                                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Your Email</label>
                                <input
                                    type="email" required placeholder="your@email.com"
                                    value={form.email} onChange={handleChange('email')}
                                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Your Message</label>
                                <textarea
                                    required rows={3}
                                    placeholder="Tell me about your project or opportunity..."
                                    value={form.message} onChange={handleChange('message')}
                                    style={{ ...inputStyle, resize: 'none' }}
                                    onFocus={handleFocus} onBlur={handleBlur}
                                />
                            </div>

                            {errorMessage && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f84131' }}>
                                    <FiAlertCircle size={15} />
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{errorMessage}</span>
                                </div>
                            )}

                            {/* Send button + Rocket */}
                            <div style={{ position: 'relative', marginTop: '4px', overflow: 'visible' }}>
                                <CustomRocket rocketRef={rocketRef} isLaunching={isLaunching} />
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                                        background: status === 'sending' ? '#252222' : '#a1ff62',
                                        color: status === 'sending' ? '#ffffff' : '#0d0d0d',
                                        border: 'none', borderRadius: '1600px',
                                        padding: '13px 26px', fontFamily: 'var(--font-mono)',
                                        fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.06em',
                                        textTransform: 'uppercase',
                                        cursor: status === 'sending' ? 'wait' : 'pointer',
                                        transition: 'transform 0.2s ease, background 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => { if (status !== 'sending') e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
                                >
                                    {status === 'sending' ? 'Sending...' : <><span>Send Message</span><FiSend size={13} /></>}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
