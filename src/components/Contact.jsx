import { useState, useRef, useEffect, useCallback } from 'react';
import { FiArrowUpRight, FiCheck, FiSend, FiAlertCircle, FiMail, FiLinkedin, FiGithub, FiMessageSquare } from 'react-icons/fi';
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

/* ─────────────────────────────────────────────────────────────────────────────
   CONTACT — Hub-and-spoke architectural network
   Central "LET'S CONNECT." hub with four orthogonal branches:
   EMAIL (upper-left) · LINKEDIN (upper-right)
   GITHUB (lower-left) · SEND MESSAGE (lower-right → integrated form)
   ───────────────────────────────────────────────────────────────────────────── */
export default function Contact() {
    const sectionRef        = useRef(null);
    const hubRef            = useRef(null);
    const svgRef            = useRef(null);
    const pathRefs          = useRef([]);   /* [email, linkedin, github, message] */
    const dotRefs           = useRef([]);
    const endpointRefs      = useRef([]);
    const rocketRef         = useRef(null);
    const formContainerRef  = useRef(null);

    const [form, setForm]               = useState({ name: '', email: '', message: '' });
    const [status, setStatus]           = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLaunching, setIsLaunching] = useState(false);
    const [hoveredEndpoint, setHoveredEndpoint] = useState(null);
    const [isMobile, setIsMobile]       = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

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

    /* ── SVG path drawing entrance animation ── */
    useEffect(() => {
        if (!sectionRef.current || !svgRef.current) return;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const ctx = gsap.context(() => {
            /* Hub heading */
            if (hubRef.current) {
                gsap.from(hubRef.current, {
                    y: 20, opacity: 0, duration: 0.6, ease: 'power3.out',
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
                            duration: 0.75, ease: 'power2.inOut',
                            delay: i * 0.1,
                            scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
                        });
                    } catch (_) { /* SVG method may not be available yet */ }
                });

                /* Junction dots */
                dotRefs.current.forEach((dot, i) => {
                    if (!dot) return;
                    gsap.from(dot, {
                        opacity: 0, scale: 0, duration: 0.3, ease: 'back.out(2)',
                        delay: 0.3 + i * 0.05,
                        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
                    });
                });

                /* Endpoint labels */
                endpointRefs.current.forEach((el, i) => {
                    if (!el) return;
                    gsap.from(el, {
                        opacity: 0, y: 10, duration: 0.4, ease: 'power2.out',
                        delay: 0.4 + i * 0.1,
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

    /* ── Endpoint data ── */
    const ENDPOINTS = [
        {
            key: 'email',
            label: 'EMAIL',
            value: 'mohandharmala5@gmail.com',
            href: 'mailto:mohandharmala5@gmail.com',
            Icon: FiMail,
            region: 'upper-left',
        },
        {
            key: 'linkedin',
            label: 'LINKEDIN',
            value: 'mohan-reddy-tech',
            href: 'https://linkedin.com/in/mohan-reddy-tech',
            Icon: FiLinkedin,
            region: 'upper-right',
        },
        {
            key: 'github',
            label: 'GITHUB',
            value: 'MohanReddy-5',
            href: 'https://github.com/MohanReddy-5',
            Icon: FiGithub,
            region: 'lower-left',
        },
        {
            key: 'message',
            label: 'SEND MESSAGE',
            value: 'Direct to inbox',
            href: '#contact-form',
            Icon: FiMessageSquare,
            region: 'lower-right',
        },
    ];

    /* ── Connector path data (viewBox 0 0 1000 480) ──
       Hub center: 500, 240
       Left junction: 300, 240 — turns up/down to endpoints at x=40
       Right junction: 700, 240 — turns up/down to endpoints at x=960
    */
    const PATHS = [
        { key: 'email',    d: 'M500,240 H300 V110 H40' },
        { key: 'linkedin', d: 'M500,240 H300 V370 H40' },
        { key: 'github',   d: 'M500,240 H700 V110 H960' },
        { key: 'message',  d: 'M500,240 H700 V370 H960' },
    ];

    /* Junction dot positions in SVG coords */
    const DOTS = [
        { cx: 500, cy: 240, r: 5 },    /* center */
        { cx: 300, cy: 240, r: 3 },    /* left junction */
        { cx: 700, cy: 240, r: 3 },    /* right junction */
        { cx: 300, cy: 110, r: 3 },    /* email turn */
        { cx: 300, cy: 370, r: 3 },    /* linkedin turn */
        { cx: 700, cy: 110, r: 3 },    /* github turn */
        { cx: 700, cy: 370, r: 3 },    /* message turn */
    ];

    /* Endpoint label positions as % of diagram container */
    const LABEL_POSITIONS = {
        'upper-left':  { left: '0',   top: '12%',  textAlign: 'left'  },
        'upper-right': { right: '0',  top: '12%',  textAlign: 'right' },
        'lower-left':  { left: '0',   bottom: '12%', textAlign: 'left' },
        'lower-right': { right: '0',  bottom: '12%', textAlign: 'right' },
    };

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
                    DESKTOP: Hub-and-spoke network diagram
                    ═════════════════════════════════════════════════════ */}
                {!isMobile ? (
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: 'clamp(340px, 44vw, 480px)',
                            marginBottom: 'clamp(40px, 5vh, 64px)',
                        }}
                    >
                        {/* SVG connector layer — behind all DOM elements */}
                        <svg
                            ref={svgRef}
                            viewBox="0 0 1000 480"
                            preserveAspectRatio="none"
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
                            {/* Connector paths */}
                            {PATHS.map((p, i) => {
                                const isActive = hoveredEndpoint === p.key;
                                return (
                                    <path
                                        key={p.key}
                                        ref={(el) => { pathRefs.current[i] = el; }}
                                        d={p.d}
                                        fill="none"
                                        stroke={isActive ? 'rgba(255,255,255,0.60)' : 'rgba(255,255,255,0.13)'}
                                        strokeWidth={isActive ? '1.5' : '1'}
                                        style={{ transition: 'stroke 0.2s ease, stroke-width 0.2s ease' }}
                                    />
                                );
                            })}

                            {/* Junction dots */}
                            {DOTS.map((dot, i) => (
                                <circle
                                    key={i}
                                    ref={(el) => { dotRefs.current[i] = el; }}
                                    cx={dot.cx}
                                    cy={dot.cy}
                                    r={dot.r}
                                    fill="rgba(255,255,255,0.25)"
                                />
                            ))}
                        </svg>

                        {/* Central hub heading */}
                        <div
                            ref={hubRef}
                            style={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center',
                                zIndex: 4,
                                pointerEvents: 'none',
                            }}
                        >
                            <h2 style={{
                                fontFamily: 'var(--font-display)',
                                fontWeight: 800,
                                fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                                lineHeight: 0.9,
                                letterSpacing: '-0.04em',
                                margin: '0 0 10px',
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

                        {/* Endpoint labels — absolutely positioned in diagram */}
                        {ENDPOINTS.map((ep, i) => {
                            const pos     = LABEL_POSITIONS[ep.region];
                            const isActive = hoveredEndpoint === ep.key;
                            const isMsg   = ep.key === 'message';

                            return (
                                <a
                                    key={ep.key}
                                    ref={(el) => { endpointRefs.current[i] = el; }}
                                    href={ep.href}
                                    target={ep.href.startsWith('http') ? '_blank' : undefined}
                                    rel={ep.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    onClick={isMsg ? (e) => {
                                        e.preventDefault();
                                        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    } : undefined}
                                    onMouseEnter={() => setHoveredEndpoint(ep.key)}
                                    onMouseLeave={() => setHoveredEndpoint(null)}
                                    style={{
                                        position: 'absolute',
                                        ...pos,
                                        zIndex: 5,
                                        textDecoration: 'none',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px',
                                        alignItems: ep.region.includes('right') ? 'flex-end' : 'flex-start',
                                        transition: 'opacity 0.2s ease',
                                        maxWidth: '220px',
                                    }}
                                >
                                    {/* Label chip */}
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '10.5px',
                                        fontWeight: 700,
                                        letterSpacing: '0.10em',
                                        textTransform: 'uppercase',
                                        color: isActive ? '#a1ff62' : 'rgba(255,255,255,0.55)',
                                        transition: 'color 0.2s ease',
                                    }}>
                                        <ep.Icon size={12} />
                                        {ep.label}
                                        <FiArrowUpRight size={11} style={{ opacity: isActive ? 1 : 0.4 }} />
                                    </span>
                                    {/* Value */}
                                    <span style={{
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '12px',
                                        color: isActive ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.28)',
                                        letterSpacing: '0.01em',
                                        transition: 'color 0.2s ease',
                                        maxWidth: '200px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {ep.value}
                                    </span>
                                </a>
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

                        {/* Vertical endpoint list — exclude "message" (form is below) */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {ENDPOINTS.filter(ep => ep.key !== 'message').map((ep, i) => (
                                <a
                                    key={ep.key}
                                    href={ep.href}
                                    target={ep.href.startsWith('http') ? '_blank' : undefined}
                                    rel={ep.href.startsWith('http') ? 'noopener noreferrer' : undefined}
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <ep.Icon size={14} />
                                        <span style={{
                                            fontFamily: 'var(--font-mono)', fontSize: '11px',
                                            fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                                        }}>{ep.label}</span>
                                    </div>
                                    <span style={{
                                        fontFamily: 'var(--font-body)', fontSize: '12px',
                                        color: 'rgba(255,255,255,0.30)', maxWidth: '160px',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    }}>{ep.value}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Integrated message form ─────────────────────────────── */}
                <div
                    id="contact-form"
                    ref={formContainerRef}
                    style={{
                        maxWidth: isMobile ? '100%' : '420px',
                        marginLeft: isMobile ? 0 : 'auto',
                        marginRight: isMobile ? 0 : '0',
                        position: 'relative',
                        overflow: 'visible',
                    }}
                >
                    {/* Form label */}
                    <div style={{ marginBottom: '20px' }}>
                        <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700,
                            letterSpacing: '0.10em', textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.40)', display: 'block', marginBottom: '4px',
                        }}>
                            {isMobile ? 'Send a Message' : 'Direct Message'}
                        </span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'rgba(255,255,255,0.25)' }}>
                            Delivers directly to my inbox.
                        </span>
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
