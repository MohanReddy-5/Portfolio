import { useState, useRef, useEffect } from 'react';
import { SiRedhat, SiCisco } from 'react-icons/si';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── TAP Academy Logo ── */
function TapAcademyLogo({ isHovered = false }) {
    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1), filter 0.25s ease',
            transform: isHovered ? 'scale(1.06) translateY(-2px)' : 'scale(1)',
            filter: isHovered ? 'drop-shadow(0 4px 14px rgba(26,86,219,0.25))' : 'none',
        }}>
            <img
                src="/tap_logo.avif"
                alt="TAP Academy"
                style={{
                    height: '72px',
                    width: 'auto',
                    maxWidth: '200px',
                    objectFit: 'contain',
                    display: 'block',
                }}
                onError={(e) => {
                    if (e.target.src.indexOf('tap_academy_logo.svg') === -1) {
                        e.target.src = '/tap_academy_logo.svg';
                    }
                }}
            />
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────────
   INTERNSHIPS DATA — factual content only, no decorative index numbers
   ───────────────────────────────────────────────────────────────────────────── */
const INTERNSHIPS = [
    {
        id: 'redhat',
        title: 'Red Hat',
        type: 'Virtual Internship',
        period: '2023',
        role: 'Linux Basics & Administration',
        accent: '#ee0000',
        isCurrent: false,
        renderLogo: (isHovered) => (
            <SiRedhat
                size={80}
                style={{
                    color: isHovered ? '#ee0000' : 'rgba(238,0,0,0.55)',
                    transition: 'color 0.3s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1), filter 0.3s ease',
                    transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                    filter: isHovered ? 'drop-shadow(0 4px 18px rgba(238,0,0,0.3))' : 'none',
                    display: 'block',
                }}
            />
        ),
        bullets: [
            'Learned core Linux terminal commands, file system navigation, and bash shell fundamentals.',
            'Practiced user permissions, access control with chmod/chown, and basic system security.',
            'Gained understanding of systemd services and RPM-based package management.',
        ],
    },
    {
        id: 'cisco',
        title: 'Cisco',
        type: 'Virtual Internship',
        period: '2025',
        role: 'Networking Basics & Protocols',
        accent: '#1ba0d7',
        isCurrent: false,
        renderLogo: (isHovered) => (
            <SiCisco
                size={88}
                style={{
                    color: isHovered ? '#1ba0d7' : 'rgba(27,160,215,0.55)',
                    transition: 'color 0.3s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1), filter 0.3s ease',
                    transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                    filter: isHovered ? 'drop-shadow(0 4px 18px rgba(27,160,215,0.3))' : 'none',
                    display: 'block',
                }}
            />
        ),
        bullets: [
            'Studied the OSI 7-layer model, TCP/IP stack, and foundational networking protocols.',
            'Practiced IPv4/IPv6 addressing, CIDR subnetting, and packet flow analysis.',
            'Built simulated network topologies with routers, switches, and VLANs in Packet Tracer.',
        ],
    },
    {
        id: 'tapacademy',
        title: 'TAP Academy',
        type: 'Internship / Current',
        period: 'Aug 2026 — Present',
        role: 'Java Programming Fundamentals',
        accent: '#1a56db',
        isCurrent: true,
        renderLogo: (isHovered) => <TapAcademyLogo isHovered={isHovered} />,
        bullets: [
            'Core Java fundamentals: data types, variables, control flow, type casting, operators, and expression evaluation.',
            'Object-oriented programming principles including classes, inheritance, polymorphism, and encapsulation.',
            'Daily practical programming exercises reinforcing problem-solving and code structure.',
        ],
    },
];

/* ─────────────────────────────────────────────────────────────────────────────
   EXPERIENCE — Logo-led editorial split composition
   Logo left (30%), content right (70%). No sequence numbers.
   Scroll-triggered staggered masked-line reveal.
   ───────────────────────────────────────────────────────────────────────────── */
export default function Experience() {
    const [hoveredId, setHoveredId]       = useState(null);
    const sectionRef                       = useRef(null);
    const headingRef                       = useRef(null);
    const entryRefs                        = useRef([]);

    const [isDesktop, setIsDesktop]        = useState(true);
    const [isReducedMotion]                = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    useEffect(() => {
        const check = () => setIsDesktop(window.innerWidth >= 820);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    /* ── Scroll-triggered masked-line reveals ── */
    useEffect(() => {
        if (isReducedMotion || !sectionRef.current) return;

        const ctx = gsap.context(() => {
            /* Heading */
            gsap.from(headingRef.current, {
                y: 28, opacity: 0, duration: 0.7, ease: 'power3.out',
                scrollTrigger: { trigger: headingRef.current, start: 'top 85%' },
            });

            /* Per-entry reveals */
            entryRefs.current.forEach((entry) => {
                if (!entry) return;

                const logo    = entry.querySelector('[data-exp-logo]');
                const line    = entry.querySelector('[data-exp-line]');
                const title   = entry.querySelector('[data-exp-title]');
                const metas   = entry.querySelectorAll('[data-exp-meta]');
                const bullets = entry.querySelectorAll('[data-exp-bullet]');

                const tl = gsap.timeline({
                    scrollTrigger: { trigger: entry, start: 'top 82%' },
                });

                /* Phase A — Logo */
                if (logo) {
                    tl.from(logo, {
                        opacity: 0, scale: 0.94, y: 10,
                        duration: 0.4, ease: 'power2.out',
                    }, 0);
                }

                /* Phase B — Accent line + Title (masked) */
                if (line) {
                    tl.from(line, {
                        scaleX: 0, transformOrigin: 'left center',
                        duration: 0.4, ease: 'power2.out',
                    }, 0.08);
                }

                if (title) {
                    tl.from(title, {
                        clipPath: 'inset(100% 0 0 0)', y: 22,
                        duration: 0.45, ease: 'power3.out',
                    }, 0.15);
                }

                /* Phase C — Meta */
                if (metas.length) {
                    tl.from(metas, {
                        clipPath: 'inset(100% 0 0 0)', y: 14,
                        duration: 0.38, ease: 'power3.out', stagger: 0.07,
                    }, 0.28);
                }

                /* Phase D — Sentences */
                if (bullets.length) {
                    tl.from(bullets, {
                        y: 16, opacity: 0,
                        duration: 0.38, ease: 'power2.out', stagger: 0.07,
                    }, 0.42);
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [isReducedMotion, isDesktop]);

    return (
        <section
            id="experience"
            ref={sectionRef}
            style={{
                background: 'var(--color-linen-canvas)',
                color: 'var(--color-ink)',
                position: 'relative',
                borderTop: '1px dashed rgba(13,13,13,0.12)',
                borderBottom: '1px dashed rgba(13,13,13,0.12)',
                padding: 'clamp(72px, 9vh, 110px) 0 clamp(72px, 9vh, 100px)',
            }}
        >
            <div style={{
                maxWidth: '1240px',
                margin: '0 auto',
                padding: '0 clamp(24px, 4.5vw, 44px)',
            }}>
                {/* ── Heading ── */}
                <header ref={headingRef} style={{ marginBottom: 'clamp(44px, 6vh, 64px)' }}>
                    <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#8c8887',
                        display: 'block',
                        marginBottom: '16px',
                    }}>
                        05 / Experience
                    </span>

                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: 'clamp(2.8rem, 5.5vw, 4.8rem)',
                        color: '#0d0d0d',
                        lineHeight: 0.95,
                        letterSpacing: '-0.04em',
                        margin: 0,
                    }}>
                        Internships
                    </h2>
                </header>

                {/* ── Editorial entries ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {INTERNSHIPS.map((item, idx) => {
                        const isHovered = hoveredId === item.id;
                        const isLast    = idx === INTERNSHIPS.length - 1;

                        return (
                            <article
                                key={item.id}
                                ref={(el) => { entryRefs.current[idx] = el; }}
                                data-exp-entry
                                onMouseEnter={() => setHoveredId(item.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: isDesktop ? '30% 1fr' : '1fr',
                                    gap: isDesktop ? 'clamp(28px, 3.5vw, 48px)' : '24px',
                                    alignItems: 'start',
                                    padding: 'clamp(32px, 4.5vh, 48px) 0',
                                    borderBottom: !isLast ? '1px dashed rgba(13,13,13,0.10)' : 'none',
                                    /* No hover-dimming: opacity always 1 */
                                }}
                            >
                                {/* ── Left: Logo identity ── */}
                                <div
                                    data-exp-logo
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        minHeight: isDesktop ? '90px' : 'auto',
                                        paddingTop: isDesktop ? '4px' : '0',
                                    }}
                                >
                                    {item.renderLogo(isHovered)}
                                </div>

                                {/* ── Right: Text content ── */}
                                <div style={{ overflow: 'visible' }}>
                                    {/* Accent line */}
                                    <div
                                        data-exp-line
                                        style={{
                                            width: isHovered ? '56px' : '32px',
                                            height: '2px',
                                            background: isHovered ? item.accent : 'rgba(13,13,13,0.12)',
                                            marginBottom: '18px',
                                            transition: 'width 0.35s cubic-bezier(0.16,1,0.3,1), background 0.3s ease',
                                            transformOrigin: 'left center',
                                        }}
                                    />

                                    {/* Title */}
                                    <div data-exp-title style={{ overflow: 'hidden' }}>
                                        <h3 style={{
                                            fontFamily: 'var(--font-display)',
                                            fontWeight: 800,
                                            fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
                                            color: '#0d0d0d',
                                            lineHeight: 1.05,
                                            letterSpacing: '-0.03em',
                                            margin: '0 0 6px',
                                        }}>
                                            {item.title}
                                        </h3>
                                    </div>

                                    {/* Role */}
                                    <div data-exp-meta style={{ overflow: 'hidden' }}>
                                        <h4 style={{
                                            fontFamily: 'var(--font-display)',
                                            fontWeight: 600,
                                            fontSize: 'clamp(1.1rem, 1.5vw, 1.25rem)',
                                            color: '#27272a',
                                            lineHeight: 1.3,
                                            margin: '0 0 10px',
                                            letterSpacing: '-0.01em',
                                        }}>
                                            {item.role}
                                        </h4>
                                    </div>

                                    {/* Metadata row — type + period only */}
                                    <div data-exp-meta style={{ overflow: 'hidden' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            marginBottom: '20px',
                                            flexWrap: 'wrap',
                                        }}>
                                            <span style={{
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                color: '#71717a',
                                                letterSpacing: '0.06em',
                                                textTransform: 'uppercase',
                                            }}>
                                                {item.type}
                                            </span>
                                            <span style={{ width: 1, height: 10, background: 'rgba(13,13,13,0.15)' }} />
                                            <span style={{
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '11px',
                                                color: '#8c8887',
                                                letterSpacing: '0.04em',
                                                textTransform: 'uppercase',
                                            }}>
                                                {item.period}
                                            </span>

                                            {item.isCurrent && (
                                                <span style={{
                                                    fontFamily: 'var(--font-mono)',
                                                    fontSize: '8.5px',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.08em',
                                                    color: '#1a56db',
                                                    background: 'rgba(26,86,219,0.08)',
                                                    border: '1px solid rgba(26,86,219,0.2)',
                                                    padding: '2px 8px',
                                                    borderRadius: '1600px',
                                                    textTransform: 'uppercase',
                                                }}>
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bullet statements */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {item.bullets.map((b, bidx) => (
                                            <div
                                                key={bidx}
                                                data-exp-bullet
                                                style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}
                                            >
                                                <span style={{
                                                    fontFamily: 'var(--font-mono)',
                                                    fontSize: '9px',
                                                    fontWeight: 700,
                                                    color: isHovered ? item.accent : '#a0a0a0',
                                                    flexShrink: 0,
                                                    transition: 'color 0.25s ease',
                                                    letterSpacing: '0.04em',
                                                }}>
                                                    —
                                                </span>
                                                <p style={{
                                                    fontFamily: 'var(--font-body)',
                                                    fontSize: '15.5px',
                                                    lineHeight: 1.65,
                                                    color: '#3f3f46',
                                                    margin: 0,
                                                }}>
                                                    {b}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
