import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCounter } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const ACADEMIC_RECORDS = [
    {
        id: 'btech', index: '01',
        degree: 'Bachelor of Technology',
        specialization: 'Computer Science & Engineering (AI & ML)',
        institution: 'Vikas College of Engineering & Technology',
        affiliation: 'JNTUK · Jawaharlal Nehru Technological University',
        location: 'Vijayawada, Andhra Pradesh',
        period: '2022 — 2026',
        status: 'Graduated',
        score: 7.30, scoreDisplay: '7.30', scoreType: 'CGPA',
        accent: '#6840ff',
        photo: '/vikas_college.jpg',
        highlights: [
            'Core coursework in Machine Learning, Deep Neural Networks, Computer Vision, and Natural Language Processing.',
            'Engineered full-stack capstone ConfidoAI with real-time MediaPipe facial geometry telemetry and OpenCV.',
            'Hands-on laboratory training in distributed database architecture, cloud infrastructure, and OS internals.',
        ],
        modules: [
            'Artificial Intelligence', 'Deep Neural Networks', 'Computer Vision',
            'NLP Pipelines', 'Relational Database Systems', 'Data Structures & Algorithms',
            'Object-Oriented Programming', 'Operating Systems',
        ],
    },
    {
        id: 'intermediate', index: '02',
        degree: 'Intermediate (12th Grade)',
        specialization: 'Mathematics, Physics & Chemistry',
        institution: 'KBN College',
        affiliation: 'BIEAP · Board of Intermediate Education, AP',
        location: 'Vijayawada, Andhra Pradesh',
        period: '2020 — 2022',
        status: 'First Class',
        score: 60, scoreDisplay: '60', scoreType: '% Score',
        accent: '#a1ff62',
        photo: '/kbn_college.jpg',
        highlights: [
            'Rigorous foundations in advanced mathematics, analytical calculus, vector algebra, and physical sciences.',
            'Cultivated analytical problem-solving rigor and mathematical logic foundational to software systems.',
        ],
        modules: ['Advanced Calculus', 'Analytical Algebra', 'Classical Physics', 'Physical Chemistry', 'Logical Analysis'],
    },
    {
        id: 'school', index: '03',
        degree: '10th Class (SSC)',
        specialization: 'General Sciences & Mathematics (SSC)',
        institution: 'ADMC High School',
        affiliation: 'DGE · Directorate of Government Examinations, AP',
        location: 'Vijayawada, Andhra Pradesh',
        period: '2019 — 2020',
        status: 'Distinction',
        score: 90, scoreDisplay: '90', scoreType: '% Score',
        accent: '#febc2e',
        photo: '/admc_school.jpg',
        highlights: [
            'Secured 90% distinction score across Mathematics, General Sciences, and Social Studies.',
            'Sustained top academic rank with early foundational coursework in basic programming concepts.',
        ],
        modules: ['Mathematics', 'Physical Science', 'Biological Science', 'English Communication', 'Social Studies'],
    },
];

/* ── Animated Counter ── */
function AnimatedScore({ target, suffix, accent }) {
    const [ref, display] = useCounter(target, target % 1 !== 0 ? 2 : 0, suffix);
    return (
        <div ref={ref} style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(2.8rem, 4vw, 3.8rem)',
            color: accent, lineHeight: 1, letterSpacing: '-0.05em',
        }}>
            {display || '0'}
        </div>
    );
}

/* ── Education Photo Card ── */
function EduCard({ rec, isSelected, onClick, animClass }) {
    const cardRef = useRef(null);

    const onMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        cardRef.current.style.transform = `perspective(1000px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) scale(1.02)`;
    };
    const onLeave = () => {
        if (cardRef.current) cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    };

    return (
        <div
            ref={cardRef}
            className={`edu-photo-card ${animClass}`}
            onClick={onClick}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{
                height: '320px',
                border: isSelected
                    ? `2px solid ${rec.accent}`
                    : '1.5px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                boxShadow: isSelected
                    ? `0 20px 60px ${rec.accent}25, 0 0 0 1px ${rec.accent}20`
                    : '0 12px 40px rgba(0,0,0,0.6)',
                transition: 'transform 0.15s ease-out, border-color 0.3s ease, box-shadow 0.3s ease',
            }}
        >
            {/* Background photo */}
            <img src={rec.photo} alt={rec.institution} />

            {/* Extra darkening on non-selected */}
            {!isSelected && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1 }} />
            )}

            {/* Content overlay */}
            <div className="card-content">
                {/* Index + status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'auto' }}>
                    <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                        color: rec.accent, letterSpacing: '0.08em',
                        background: `${rec.accent}18`,
                        border: `1px solid ${rec.accent}30`,
                        padding: '3px 10px', borderRadius: '1600px',
                    }}>
                        {rec.status.toUpperCase()}
                    </span>
                    <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '10px',
                        color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em',
                    }}>
                        {rec.period}
                    </span>
                </div>

                {/* Score counter */}
                <div style={{ marginBottom: '14px' }}>
                    <AnimatedScore
                        target={rec.score}
                        suffix={rec.scoreType === 'CGPA' ? '' : '%'}
                        accent={rec.accent}
                    />
                    <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '9.5px',
                        color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em',
                        textTransform: 'uppercase', display: 'block', marginTop: '2px',
                    }}>
                        {rec.scoreType}
                    </span>
                </div>

                {/* Institution */}
                <div>
                    <h3 style={{
                        fontFamily: 'var(--font-display)', fontWeight: 700,
                        fontSize: '16px', color: '#ffffff',
                        lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 4px',
                    }}>
                        {rec.institution}
                    </h3>
                    <p style={{
                        fontFamily: 'var(--font-body)', fontSize: '12.5px',
                        color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.4, fontWeight: 400,
                    }}>
                        {rec.specialization}
                    </p>
                    <p style={{
                        fontFamily: 'var(--font-mono)', fontSize: '10px',
                        color: 'rgba(255,255,255,0.35)', margin: '5px 0 0',
                    }}>
                        {rec.affiliation}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function Education() {
    const [selectedId, setSelectedId] = useState('btech');
    const [activeTab, setActiveTab] = useState('modules');
    const sectionRef = useRef(null);

    const activeRecord = ACADEMIC_RECORDS.find((r) => r.id === selectedId) || ACADEMIC_RECORDS[0];

    // GSAP multi-directional card entrance
    useEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 72%',
                    toggleActions: 'play none none none',
                },
            });

            tl.from('.edu-header-badge', { opacity: 0, y: -20, duration: 0.4 })
                .from('.edu-header-h2', { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out' }, '-=0.2')
                // Cards enter from different directions
                .from('.edu-card-0', { opacity: 0, x: -100, duration: 0.65, ease: 'power2.out' }, '-=0.1')
                .from('.edu-card-1', { opacity: 0, y: 80, duration: 0.65, ease: 'power2.out' }, '-=0.48')
                .from('.edu-card-2', { opacity: 0, x: 100, duration: 0.65, ease: 'power2.out' }, '-=0.48')
                .from('.edu-inspector', { opacity: 0, y: 40, duration: 0.5, ease: 'power2.out' }, '-=0.2');
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="education"
            ref={sectionRef}
            style={{
                background: '#07070f',
                color: '#ffffff',
                padding: '110px 0',
                position: 'relative',
                overflow: 'hidden',
                borderTop: '1px dashed rgba(255,255,255,0.07)',
                borderBottom: '1px dashed rgba(255,255,255,0.07)',
            }}
        >
            {/* Grain */}
            <div className="grain-overlay" style={{ opacity: 0.022 }} />



            {/* Subtle radial glow */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '700px', height: '700px',
                background: 'radial-gradient(circle, rgba(104,64,255,0.04) 0%, transparent 70%)',
                pointerEvents: 'none', zIndex: 0,
            }} />

            <div style={{
                maxWidth: '1240px', margin: '0 auto',
                padding: '0 32px', position: 'relative', zIndex: 2,
            }}>
                {/* Header */}
                <div style={{ marginBottom: '58px' }}>
                    <div className="edu-header-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                        <span className="section-badge" style={{ fontSize: '12px', padding: '6px 20px', fontWeight: 800 }}>Academic Background</span>
                        <span className="section-badge-ghost" style={{ fontSize: '11px' }}>Verified Qualifications</span>
                    </div>

                    <h2
                        className="edu-header-h2"
                        style={{
                            fontFamily: 'var(--font-display)', fontWeight: 800,
                            fontSize: 'clamp(3rem, 6vw, 5.2rem)',
                            color: '#ffffff', lineHeight: 0.95,
                            letterSpacing: '-0.048em', margin: 0,
                        }}
                    >
                        Academic{' '}
                        <span style={{ color: '#6840ff' }}>foundations</span>
                    </h2>
                </div>

                {/* 3 Photo Cards — Multi-Directional Entrance */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px',
                    marginBottom: '32px',
                }}>
                    {ACADEMIC_RECORDS.map((rec, idx) => (
                        <EduCard
                            key={rec.id}
                            rec={rec}
                            isSelected={selectedId === rec.id}
                            onClick={() => setSelectedId(rec.id)}
                            animClass={`edu-card-${idx}`}
                        />
                    ))}
                </div>

                {/* Inspector Panel */}
                <div
                    className="edu-inspector"
                    style={{
                        background: '#0d0d16',
                        border: '1px dashed rgba(255,255,255,0.10)',
                        borderRadius: '10px',
                        padding: '28px 30px',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
                        transition: 'border-color 0.3s ease',
                    }}
                >
                    {/* Inspector header */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', flexWrap: 'wrap', gap: '14px',
                        marginBottom: '22px', paddingBottom: '18px',
                        borderBottom: '1px dashed rgba(255,255,255,0.08)',
                    }}>
                        <div>
                            <span style={{
                                fontFamily: 'var(--font-mono)', fontSize: '10px',
                                color: activeRecord.accent, letterSpacing: '0.08em',
                                textTransform: 'uppercase', fontWeight: 700,
                                display: 'block', marginBottom: '4px',
                            }}>
                                Credential Detail View //
                            </span>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontWeight: 700,
                                fontSize: '17px', color: '#ffffff', margin: 0,
                                letterSpacing: '-0.02em',
                            }}>
                                {activeRecord.degree} — {activeRecord.institution}
                            </h3>
                        </div>

                        {/* Toggle tabs */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {['modules', 'highlights'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700,
                                        padding: '6px 16px', borderRadius: '1600px',
                                        border: `1.5px solid ${activeTab === tab ? activeRecord.accent : 'rgba(255,255,255,0.1)'}`,
                                        background: activeTab === tab ? `${activeRecord.accent}20` : 'rgba(255,255,255,0.04)',
                                        color: activeTab === tab ? activeRecord.accent : 'rgba(255,255,255,0.5)',
                                        cursor: 'pointer', transition: 'all 0.2s ease',
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {tab === 'modules' ? 'Key Modules' : 'Highlights'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'modules' ? (
                            <motion.div
                                key="modules"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.22 }}
                                style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
                            >
                                {activeRecord.modules.map((m) => (
                                    <span key={m} style={{
                                        fontFamily: 'var(--font-body)', fontSize: '13px',
                                        fontWeight: 500, color: 'rgba(255,255,255,0.75)',
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        padding: '6px 16px', borderRadius: '1600px',
                                    }}>
                                        ✓ {m}
                                    </span>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="highlights"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.22 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                            >
                                {activeRecord.highlights.map((h, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                        <span style={{
                                            fontFamily: 'var(--font-mono)', fontSize: '10.5px',
                                            color: activeRecord.accent, fontWeight: 700, paddingTop: '3px', flexShrink: 0,
                                        }}>
                                            0{i + 1} //
                                        </span>
                                        <p style={{
                                            fontFamily: 'var(--font-body)', fontSize: '14.5px',
                                            color: 'rgba(255,255,255,0.7)', margin: 0,
                                            lineHeight: 1.65, fontWeight: 400,
                                        }}>
                                            {h}
                                        </p>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
