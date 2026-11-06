import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import MolecularNetwork from './MolecularNetwork';
import FlipWords from './FlipWords';

/* ─────────────────────────────────────────────────────────────────────────────
   HERO — Three-part composition
   LEFT:   Personal introduction (greeting / name / tagline / CTAs)
   CENTER: Portrait photograph
   RIGHT:  Molecular network animation
   ───────────────────────────────────────────────────────────────────────────── */
export default function Hero() {
    const sectionRef = useRef(null);

    const fadeUp = (delay = 0) => ({
        initial: { opacity: 0, y: 22 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
    });

    return (
        <section id="home" ref={sectionRef} className="hero3-section">
            {/* Grain overlay */}
            <div className="grain-overlay" style={{ zIndex: 2 }} />

            <div className="hero3-grid">

                {/* ═══ LEFT — Introduction ═══ */}
                <div className="hero3-zone-intro">
                    {/* Availability badge */}
                    <motion.div {...fadeUp(0.05)} className="hero3-availability">
                        <span className="hero3-dot" />
                        <span className="hero3-avail-text">Open for Opportunities</span>
                    </motion.div>

                    {/* Greeting */}
                    <motion.p {...fadeUp(0.12)} className="hero3-greeting">
                        Hello there,
                    </motion.p>

                    {/* Name */}
                    <motion.div {...fadeUp(0.2)}>
                        <h1 className="hero3-name">
                            Mohan<br />Reddy
                        </h1>
                    </motion.div>

                    {/* Tagline */}
                    <motion.p {...fadeUp(0.3)} className="hero3-tagline">
                        Turning ideas into{' '}
                        <FlipWords />
                    </motion.p>

                    {/* CTAs */}
                    <motion.div {...fadeUp(0.4)} className="hero3-ctas">
                        <a
                            href="#projects"
                            className="btn-volt"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                        >
                            View My Work <FiArrowRight size={14} />
                        </a>
                        <a
                            href="/resume.pdf"
                            download="Mohan_Reddy_Resume.pdf"
                            className="btn-outline"
                            style={{ textDecoration: 'none' }}
                        >
                            Download Resume
                        </a>
                    </motion.div>
                </div>

                {/* ═══ CENTER — Portrait ═══ */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="hero3-zone-portrait"
                >
                    <div className="hero3-portrait-frame">
                        <img
                            src="/profile.jpg"
                            alt="Mohan Reddy"
                            className="hero3-portrait-photo"
                        />
                    </div>
                </motion.div>

                {/* ═══ RIGHT — Molecular Network ═══ */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="hero3-zone-network"
                >
                    <div className="hero3-network-area">
                        <MolecularNetwork />
                    </div>
                </motion.div>
            </div>

            {/* ── Scoped Styles ── */}
            <style>{`
                .hero3-section {
                    background: #f4f0ea;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: clamp(56px, 8vh, 96px) 0 clamp(52px, 7vh, 88px);
                    overflow: hidden;
                }

                .hero3-grid {
                    width: 100%;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 clamp(20px, 3.5vw, 48px);
                    display: grid;
                    grid-template-columns: 34% 28% 1fr;
                    gap: clamp(20px, 2.8vw, 40px);
                    align-items: center;
                    position: relative;
                    z-index: 5;
                }

                /* ── Intro ── */
                .hero3-zone-intro {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                }

                .hero3-availability {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 18px;
                }

                .hero3-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #a1ff62;
                    flex-shrink: 0;
                    box-shadow: 0 0 0 0 rgba(161,255,98,0.5);
                    animation: hero3-pulse 2.2s ease-in-out infinite;
                }

                @keyframes hero3-pulse {
                    0%,100% { box-shadow: 0 0 0 0 rgba(161,255,98,0.45); }
                    50%      { box-shadow: 0 0 0 5px rgba(161,255,98,0); }
                }

                .hero3-avail-text {
                    font-family: var(--font-mono);
                    font-size: 10.5px;
                    font-weight: 700;
                    letter-spacing: 0.11em;
                    text-transform: uppercase;
                    color: rgba(13,13,13,0.52);
                }

                .hero3-greeting {
                    font-family: var(--font-display);
                    font-size: clamp(1rem, 1.3vw, 1.25rem);
                    font-weight: 500;
                    color: #5a5551;
                    margin: 0 0 6px;
                    letter-spacing: -0.005em;
                }

                .hero3-name {
                    font-family: var(--font-display);
                    font-weight: 800;
                    font-size: clamp(2.8rem, 5.2vw, 5.2rem);
                    color: #0d0d0d;
                    line-height: 0.92;
                    letter-spacing: -0.04em;
                    margin: 0 0 20px;
                }

                .hero3-tagline {
                    font-family: var(--font-display);
                    font-size: clamp(0.95rem, 1.2vw, 1.12rem);
                    font-weight: 500;
                    color: #4a4544;
                    margin: 0 0 28px;
                    letter-spacing: -0.01em;
                    line-height: 1.5;
                }

                .hero3-ctas {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                /* ── Portrait ── */
                .hero3-zone-portrait {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .hero3-portrait-frame {
                    width: clamp(220px, 22vw, 340px);
                    height: clamp(290px, 28vw, 440px);
                    border-radius: 12px;
                    overflow: hidden;
                    background: #e8e4de;
                    border: 1px solid rgba(32,29,29,0.07);
                    box-shadow:
                        0 24px 52px -14px rgba(28,25,23,0.14),
                        0 6px 16px -6px rgba(28,25,23,0.05);
                    transition:
                        transform 0.4s cubic-bezier(0.22,1,0.36,1),
                        box-shadow 0.4s ease;
                }

                .hero3-portrait-frame:hover {
                    transform: translateY(-5px) scale(1.012);
                    box-shadow:
                        0 32px 64px -14px rgba(28,25,23,0.20),
                        0 10px 24px -6px rgba(28,25,23,0.08);
                }

                .hero3-portrait-photo {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: top center;
                    display: block;
                }

                /* ── Network ── */
                .hero3-zone-network {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .hero3-network-area {
                    width: 100%;
                    height: clamp(340px, 34vw, 500px);
                    position: relative;
                    overflow: hidden;
                }

                /* ── 900px: tighter three-col ── */
                @media (max-width: 1020px) {
                    .hero3-grid {
                        grid-template-columns: 36% 26% 1fr;
                        gap: 20px;
                    }
                    .hero3-name { font-size: clamp(2.2rem, 5vw, 3.6rem); }
                }

                /* ── 768px: portrait + network two-col, intro above ── */
                @media (max-width: 768px) {
                    .hero3-grid {
                        grid-template-columns: 1fr 1fr;
                        grid-template-rows: auto auto;
                        gap: 24px;
                        padding: 0 20px;
                    }
                    .hero3-zone-intro {
                        grid-column: 1 / -1;
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .hero3-name { font-size: clamp(2.6rem, 9vw, 4rem); }
                    .hero3-portrait-frame {
                        width: clamp(180px, 38vw, 260px);
                        height: clamp(230px, 48vw, 330px);
                    }
                    .hero3-network-area {
                        height: clamp(220px, 44vw, 320px);
                    }
                }

                /* ── 480px: single column ── */
                @media (max-width: 480px) {
                    .hero3-section { padding: 36px 0 28px; }
                    .hero3-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    .hero3-zone-portrait { justify-content: flex-start; }
                    .hero3-portrait-frame {
                        width: 190px;
                        height: 250px;
                    }
                    .hero3-network-area { height: 260px; }
                }
            `}</style>
        </section>
    );
}
