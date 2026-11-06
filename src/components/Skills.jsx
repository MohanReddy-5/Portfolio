import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
    SiPython, SiJavascript, SiHtml5, SiCss, SiReact, SiTailwindcss,
    SiFastapi, SiOpencv, SiScikitlearn,
    SiMysql, SiPostgresql, SiSqlite, SiGit, SiGithub,
    SiSpacy, SiMediapipe, SiSpring, SiSpringboot
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { FiCpu, FiCode, FiDatabase, FiServer, FiBookOpen } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────
   ACCURATE TECHNOLOGY TAXONOMY
   1. Programming Languages: Java, Python, JavaScript
   2. Frontend: React, HTML5, CSS3, Tailwind CSS
   3. Backend: FastAPI (verified), Spring / Spring Boot / JDBC / JSP / REST APIs (learning)
   4. AI & Computer Vision: MediaPipe, face-api.js, spaCy, scikit-learn, OpenCV
   5. Databases: PostgreSQL, MySQL, SQLite
   6. Core Concepts & Developer Tools: DSA, OOP, Git, GitHub
───────────────────────────────────────────────────────── */
const SPECIMEN_AREAS = [
    {
        id: 'languages',
        index: '01',
        label: 'PROGRAMMING LANGUAGES',
        bgWord: 'LANGUAGES',
        direction: 1,
        technologies: [
            { name: 'Java', icon: FaJava, color: '#f89820', offsetY: -5 },
            { name: 'Python', icon: SiPython, color: '#3776ab', offsetY: 5 },
            { name: 'JavaScript', icon: SiJavascript, color: '#f7df1e', offsetY: -2 },
        ],
    },
    {
        id: 'frontend',
        index: '02',
        label: 'FRONTEND',
        bgWord: 'FRONTEND',
        direction: -1,
        technologies: [
            { name: 'React', icon: SiReact, color: '#61dafb', offsetY: -4 },
            { name: 'HTML5', icon: SiHtml5, color: '#e34f26', offsetY: 5 },
            { name: 'CSS3', icon: SiCss, color: '#264de4', offsetY: -2 },
            { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06b6d4', offsetY: 3 },
        ],
    },
    {
        id: 'backend',
        index: '03',
        label: 'BACKEND',
        bgWord: 'BACKEND',
        direction: 1,
        technologies: [
            { name: 'FastAPI', icon: SiFastapi, color: '#009688', offsetY: -5 },
            { name: 'Spring', icon: SiSpring, color: '#6db33f', offsetY: 3, learning: true },
            { name: 'Spring Boot', icon: SiSpringboot, color: '#6db33f', offsetY: -2, learning: true },
            { name: 'JDBC', icon: FiDatabase, color: '#f89820', offsetY: 4, learning: true },
            { name: 'JSP', icon: FiServer, color: '#e76f00', offsetY: -3, learning: true },
            { name: 'REST APIs', icon: FiCode, color: '#61dafb', offsetY: 2 },
        ],
    },
    {
        id: 'intelligence',
        index: '04',
        label: 'AI & COMPUTER VISION',
        bgWord: 'INTELLIGENCE',
        direction: -1,
        technologies: [
            { name: 'MediaPipe', icon: SiMediapipe, color: '#0097a7', offsetY: -5 },
            { name: 'spaCy', icon: SiSpacy, color: '#09a3d5', offsetY: 6 },
            { name: 'scikit-learn', icon: SiScikitlearn, color: '#f7931e', offsetY: -3 },
            { name: 'OpenCV', icon: SiOpencv, color: '#5c3ee8', offsetY: 4 },
            { name: 'face-api.js', icon: FiCpu, color: '#c5b8ff', offsetY: -2 },
        ],
    },
    {
        id: 'databases',
        index: '05',
        label: 'DATABASES',
        bgWord: 'DATABASE',
        direction: 1,
        technologies: [
            { name: 'PostgreSQL', icon: SiPostgresql, color: '#336791', offsetY: -4 },
            { name: 'MySQL', icon: SiMysql, color: '#4479a1', offsetY: 5 },
            { name: 'SQLite', icon: SiSqlite, color: '#003b57', offsetY: -2 },
        ],
    },
    {
        id: 'concepts-tools',
        index: '06',
        label: 'CORE CONCEPTS & DEVELOPER TOOLS',
        bgWord: 'TOOLS',
        direction: -1,
        technologies: [
            { name: 'Data Structures & Algorithms', icon: FiCode, color: '#a1ff62', offsetY: -3 },
            { name: 'Object-Oriented Programming', icon: FiBookOpen, color: '#6840ff', offsetY: 4 },
            { name: 'Git', icon: SiGit, color: '#f05032', offsetY: -2 },
            { name: 'GitHub', icon: SiGithub, color: '#e6edf3', offsetY: 3 },
        ],
    },
];

/* ─────────────────────────────────────────────────────────
   MAGNETIC TECHNOLOGY SPECIMEN ITEM
   - Immediate hover response (~120ms transitions)
   - Authentic brand colors on hover
   - Neighbors dim to reinforce focus
   - "Learning" badge for in-progress technologies
───────────────────────────────────────────────────────── */
function MagneticTechItem({
    tech,
    areaId,
    focusedTech,
    setFocusedTech,
    isMobile,
    prefersReduced,
}) {
    const itemRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { damping: 22, stiffness: 280 });
    const springY = useSpring(y, { damping: 22, stiffness: 280 });

    const isFocused = focusedTech?.name === tech.name;
    const isSameArea = focusedTech?.areaId === areaId;
    const hasFocus = Boolean(focusedTech);

    let opacity = 0.88;
    if (hasFocus) {
        if (isFocused) opacity = 1;
        else if (isSameArea) opacity = 0.45;
        else opacity = 0.28;
    }

    const handleMouseMove = (e) => {
        if (prefersReduced || isMobile || !itemRef.current) return;
        const rect = itemRef.current.getBoundingClientRect();
        const offsetX = (e.clientX - (rect.left + rect.width / 2)) * 0.18;
        const offsetY = (e.clientY - (rect.top + rect.height / 2)) * 0.18;
        x.set(offsetX);
        y.set(offsetY);
    };

    const handleMouseEnter = () => {
        setFocusedTech({ name: tech.name, areaId });
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setFocusedTech(null);
    };

    const TechIcon = tech.icon;

    return (
        <motion.div
            ref={itemRef}
            role="button"
            tabIndex={0}
            aria-label={tech.name}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                position: 'relative',
                cursor: 'pointer',
                userSelect: 'none',
                outline: 'none',
                x: prefersReduced ? 0 : springX,
                y: prefersReduced ? 0 : springY,
                transform: `translateY(${!isMobile ? tech.offsetY : 0}px)`,
                opacity,
                transition: 'opacity 0.14s ease',
                zIndex: isFocused ? 20 : 1,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleMouseEnter}
            onBlur={handleMouseLeave}
            onClick={() => {
                setFocusedTech((prev) =>
                    prev?.name === tech.name ? null : { name: tech.name, areaId }
                );
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setFocusedTech((prev) =>
                        prev?.name === tech.name ? null : { name: tech.name, areaId }
                    );
                }
            }}
        >
            {/* Soft radial brand glow */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '180px',
                    height: '90px',
                    transform: 'translate(-50%, -50%)',
                    background: `radial-gradient(ellipse at center, ${tech.color}35 0%, ${tech.color}14 45%, transparent 72%)`,
                    filter: 'blur(18px)',
                    opacity: isFocused ? 1 : 0,
                    transition: 'opacity 0.14s ease',
                    pointerEvents: 'none',
                    zIndex: -1,
                }}
            />

            {/* Logo icon — immediate brand color on hover */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'transform 0.14s cubic-bezier(0.16,1,0.3,1)',
                    transform: isFocused ? 'scale(1.16)' : 'scale(1)',
                }}
            >
                <TechIcon
                    size={28}
                    style={{
                        color: isFocused ? tech.color : 'rgba(13,13,13,0.55)',
                        filter: isFocused
                            ? `drop-shadow(0 0 10px ${tech.color}70) drop-shadow(0 0 20px ${tech.color}35)`
                            : 'none',
                        transition: 'color 0.14s ease, filter 0.14s ease',
                    }}
                />
            </div>

            {/* Technology name — strong contrast on hover */}
            <span
                style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 'clamp(21px, 2.3vw, 28px)',
                    letterSpacing: '-0.035em',
                    color: isFocused ? '#0d0d0d' : 'rgba(13,13,13,0.72)',
                    textShadow: isFocused
                        ? `0 0 18px ${tech.color}40`
                        : 'none',
                    transition: 'color 0.14s ease, text-shadow 0.14s ease',
                    lineHeight: 1.1,
                    whiteSpace: 'nowrap',
                }}
            >
                {tech.name}
            </span>

            {/* Learning badge */}
            {tech.learning && (
                <span
                    style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '8px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: isFocused ? tech.color : 'rgba(13,13,13,0.35)',
                        background: isFocused ? `${tech.color}18` : 'rgba(13,13,13,0.06)',
                        border: `1px solid ${isFocused ? `${tech.color}40` : 'rgba(13,13,13,0.10)'}`,
                        padding: '2px 7px',
                        borderRadius: '1600px',
                        transition: 'all 0.14s ease',
                        flexShrink: 0,
                    }}
                >
                    Learning
                </span>
            )}

            {/* Focus accent pip */}
            <span
                style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: tech.color,
                    boxShadow: `0 0 10px ${tech.color}`,
                    marginLeft: tech.learning ? '-4px' : '-4px',
                    opacity: isFocused ? 1 : 0,
                    transform: isFocused ? 'scale(1)' : 'scale(0.5)',
                    transition: 'opacity 0.14s ease, transform 0.14s ease',
                }}
            />
        </motion.div>
    );
}

export default function Skills() {
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const areaStreamsRef = useRef([]);
    const bgWordsRef = useRef([]);

    const [focusedTech, setFocusedTech] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [prefersReduced] = useState(() =>
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 820);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (prefersReduced || !sectionRef.current) return;

        const ctx = gsap.context(() => {
            gsap.from(headerRef.current, {
                y: 35,
                opacity: 0,
                duration: 0.7,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: headerRef.current,
                    start: 'top 82%',
                },
            });

            if (!isMobile) {
                areaStreamsRef.current.forEach((streamEl, i) => {
                    if (!streamEl) return;
                    const area = SPECIMEN_AREAS[i];
                    const driftDist = 24 * (area ? area.direction : 1);

                    gsap.fromTo(
                        streamEl,
                        { x: -driftDist * 0.5 },
                        {
                            x: driftDist * 0.5,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: sectionRef.current,
                                start: 'top bottom',
                                end: 'bottom top',
                                scrub: 1.25,
                            },
                        }
                    );
                });

                bgWordsRef.current.forEach((wordEl, i) => {
                    if (!wordEl) return;
                    const area = SPECIMEN_AREAS[i];
                    const driftDist = 28 * (area ? area.direction * -1 : 1);

                    gsap.fromTo(
                        wordEl,
                        { x: -driftDist * 0.5 },
                        {
                            x: driftDist * 0.5,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: sectionRef.current,
                                start: 'top bottom',
                                end: 'bottom top',
                                scrub: 1.5,
                            },
                        }
                    );
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [isMobile, prefersReduced]);


    return (
        <section
            id="skills"
            ref={sectionRef}
            style={{
                background: 'var(--color-linen-canvas)',
                color: '#0d0d0d',
                padding: '110px 0 130px',
                position: 'relative',
                overflow: 'hidden',
                borderTop: '1px dashed rgba(13,13,13,0.10)',
                borderBottom: '1px dashed rgba(13,13,13,0.10)',
            }}
        >
            <div
                style={{
                    maxWidth: '1240px',
                    margin: '0 auto',
                    padding: '0 clamp(20px, 4vw, 44px)',
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                {/* ── Section Header ── */}
                <div ref={headerRef} style={{ marginBottom: '72px' }}>
                    <span
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: 'rgba(13,13,13,0.38)',
                            display: 'block',
                            marginBottom: '20px',
                        }}
                    >
                        03 / Technical Stack
                    </span>

                    <h2
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 800,
                            fontSize: 'clamp(2.8rem, 5.2vw, 4.8rem)',
                            color: '#0d0d0d',
                            lineHeight: 0.95,
                            letterSpacing: '-0.05em',
                            margin: 0,
                            maxWidth: '820px',
                        }}
                    >
                        Tools I build with.<br />
                        <span style={{ color: 'rgba(13,13,13,0.30)' }}>
                            The technologies behind the work.
                        </span>
                    </h2>
                </div>

                {/* ── Editorial Technology Composition ── */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '64px',
                    }}
                >
                    {SPECIMEN_AREAS.map((area, areaIdx) => (
                        <div
                            key={area.id}
                            style={{
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '22px',
                            }}
                        >
                            {/* Giant background word */}
                            <span
                                ref={(el) => {
                                    bgWordsRef.current[areaIdx] = el;
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '-24px',
                                    left: areaIdx % 2 === 0 ? '-2%' : 'auto',
                                    right: areaIdx % 2 === 1 ? '-2%' : 'auto',
                                    fontFamily: 'var(--font-display)',
                                    fontWeight: 900,
                                    fontSize: 'clamp(72px, 14vw, 170px)',
                                    color: 'rgba(13,13,13,0.03)',
                                    lineHeight: 0.85,
                                    letterSpacing: '-0.05em',
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                    zIndex: 0,
                                    whiteSpace: 'nowrap',
                                    willChange: 'transform',
                                }}
                            >
                                {area.bgWord}
                            </span>

                            {/* Category label + hairline */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    justifyContent: 'space-between',
                                    paddingBottom: '14px',
                                    borderBottom: '1px dashed rgba(13,13,13,0.10)',
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        letterSpacing: '0.12em',
                                        textTransform: 'uppercase',
                                        color: 'rgba(13,13,13,0.45)',
                                    }}
                                >
                                    {area.index} / {area.label}
                                </span>


                            </div>

                            {/* Technology items */}
                            <div
                                ref={(el) => {
                                    areaStreamsRef.current[areaIdx] = el;
                                }}
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    gap: isMobile ? '20px 24px' : 'clamp(28px, 4.5vw, 56px)',
                                    padding: '12px 4px 6px',
                                    position: 'relative',
                                    zIndex: 2,
                                    willChange: 'transform',
                                }}
                            >
                                {area.technologies.map((tech) => (
                                    <MagneticTechItem
                                        key={tech.name}
                                        tech={tech}
                                        areaId={area.id}
                                        focusedTech={focusedTech}
                                        setFocusedTech={setFocusedTech}
                                        isMobile={isMobile}
                                        prefersReduced={prefersReduced}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </section>
    );
}
