import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────────────
   EDITORIAL COVER — Independent opening page
   Headline: "IDEAS ARE JUST / THE BEGINNING."
   No name, no portrait, no CTA buttons.
   Scroll-driven clip reveal: cover lifts away to expose Hero below.
   ───────────────────────────────────────────────────────────────────────────── */
export default function Cover() {
    const coverRef   = useRef(null);
    const contentRef = useRef(null);
    const [prefersReduced] = useState(() =>
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    /* ── Scroll-driven curtain reveal ── */
    useEffect(() => {
        if (!coverRef.current) return;
        if (prefersReduced) {
            /* On reduced motion: cover still occupies viewport but content is
               instantly visible; no animation runs. */
            return;
        }

        const ctx = gsap.context(() => {
            /* Cover content translates up + fades as user scrolls */
            gsap.to(contentRef.current, {
                y: -120,
                opacity: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: coverRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.6,
                },
            });
        }, coverRef);

        return () => ctx.revert();
    }, [prefersReduced]);

    /* ── Fragment image sources (authentic portfolio assets only) ── */
    const fragA = '/confido_home.png';
    const fragB = '/confido_results.png';

    return (
        <section
            id="home"
            ref={coverRef}
            style={{
                height: '100vh',
                minHeight: '600px',
                background: '#f4f0ea',
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <div
                ref={contentRef}
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    maxWidth: '1400px',
                    width: '100%',
                    margin: '0 auto',
                    padding: isMobile ? '88px 24px 48px' : '100px 48px 64px',
                    boxSizing: 'border-box',
                    position: 'relative',
                    willChange: 'transform, opacity',
                }}
            >
                {/* ── Editorial label ── */}
                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: isMobile ? '32px' : '48px',
                    }}
                >
                    <span style={{
                        width: 5, height: 5,
                        borderRadius: '50%',
                        background: 'rgba(13,13,13,0.25)',
                        flexShrink: 0,
                    }} />
                    <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'rgba(13,13,13,0.38)',
                    }}>
                        Portfolio — 2026
                    </span>
                </motion.div>

                {/* ── Primary headline composition ── */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    style={{ position: 'relative' }}
                >
                    {/* Line 1: IDEAS ARE JUST */}
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <h1
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontWeight: 800,
                                fontSize: isMobile
                                    ? 'clamp(3.2rem, 14vw, 5.5rem)'
                                    : 'clamp(5rem, 10.5vw, 9.8rem)',
                                color: '#0d0d0d',
                                lineHeight: 0.92,
                                letterSpacing: '-0.045em',
                                margin: 0,
                                display: 'block',
                            }}
                        >
                            IDEAS ARE JUST
                        </h1>

                        {/* Fragment A — embedded in upper-right region of line 1 */}
                        {!isMobile && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.94 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                style={{
                                    position: 'absolute',
                                    right: '-20px',
                                    top: '8%',
                                    width: 'clamp(100px, 9.5vw, 158px)',
                                    height: 'clamp(66px, 6.2vw, 104px)',
                                    borderRadius: '3px',
                                    overflow: 'hidden',
                                    opacity: 0.88,
                                }}
                            >
                                <img
                                    src={fragA}
                                    alt=""
                                    aria-hidden="true"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center top',
                                        display: 'block',
                                        filter: 'grayscale(0.08) contrast(1.04)',
                                    }}
                                />
                            </motion.div>
                        )}
                    </div>

                    {/* Line 2: THE BEGINNING. — indented slightly */}
                    <div
                        style={{
                            position: 'relative',
                            display: 'inline-block',
                            marginTop: isMobile ? '0.04em' : '0.02em',
                        }}
                    >
                        <h1
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontWeight: 800,
                                fontSize: isMobile
                                    ? 'clamp(3.2rem, 14vw, 5.5rem)'
                                    : 'clamp(5rem, 10.5vw, 9.8rem)',
                                color: '#0d0d0d',
                                lineHeight: 0.92,
                                letterSpacing: '-0.045em',
                                margin: 0,
                                paddingLeft: isMobile ? '0' : 'clamp(16px, 2.5vw, 48px)',
                                display: 'block',
                            }}
                        >
                            THE BEGINNING.
                        </h1>

                        {/* Fragment B — sits at the gap between lines */}
                        {!isMobile && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.94 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.68, ease: [0.22, 1, 0.36, 1] }}
                                style={{
                                    position: 'absolute',
                                    left: 'clamp(16px, 2.5vw, 48px)',
                                    bottom: '-clamp(52px, 5vw, 80px)',
                                    bottom: 'calc(-1 * clamp(52px, 5vw, 80px))',
                                    width: 'clamp(80px, 7.5vw, 130px)',
                                    height: 'clamp(52px, 5vw, 86px)',
                                    borderRadius: '3px',
                                    overflow: 'hidden',
                                    opacity: 0.8,
                                }}
                            >
                                <img
                                    src={fragB}
                                    alt=""
                                    aria-hidden="true"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center 30%',
                                        display: 'block',
                                        filter: 'grayscale(0.15) contrast(1.06)',
                                    }}
                                />
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* ── Spacer ── */}
                <div style={{ flex: 1 }} />

                {/* ── Scroll indicator ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.85, ease: 'easeOut' }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        alignSelf: 'flex-start',
                    }}
                >
                    <ScrollArrow />
                    <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9.5px',
                        fontWeight: 600,
                        letterSpacing: '0.13em',
                        textTransform: 'uppercase',
                        color: 'rgba(13,13,13,0.30)',
                    }}>
                        Scroll
                    </span>
                </motion.div>
            </div>
        </section>
    );
}

/* Animated scroll arrow */
function ScrollArrow() {
    return (
        <div style={{ position: 'relative', width: 18, height: 28 }}>
            <div style={{
                width: 16,
                height: 26,
                borderRadius: 8,
                border: '1.5px solid rgba(13,13,13,0.20)',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '5px',
            }}>
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        width: 3,
                        height: 6,
                        borderRadius: 2,
                        background: 'rgba(13,13,13,0.28)',
                    }}
                />
            </div>
        </div>
    );
}
