import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Signature MR monogram ── */
function MonogramTag({ onClick }) {
    const [hovered, setHovered] = useState(false);
    return (
        <a
            href="#home"
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
            }}
            aria-label="Mohan Reddy — Home"
        >
            <svg width="38" height="22" viewBox="0 0 38 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect
                    x="0.75" y="0.75" width="36.5" height="20.5" rx="5.5"
                    fill={hovered ? '#a1ff62' : 'rgba(255,255,255,0.07)'}
                    stroke={hovered ? '#a1ff62' : 'rgba(255,255,255,0.18)'}
                    strokeWidth="1.5"
                    style={{ transition: 'all 0.25s ease' }}
                />
                <text
                    x="19" y="15"
                    textAnchor="middle"
                    fill={hovered ? '#201d1d' : '#ffffff'}
                    fontFamily="'Space Grotesk', sans-serif"
                    fontSize="11"
                    fontWeight="800"
                    letterSpacing="-0.03em"
                    style={{ transition: 'fill 0.25s ease' }}
                >
                    MR
                </text>
            </svg>
        </a>
    );
}

const NAV_LINKS = [
    { label: 'About',      href: '#about',      id: 'about' },
    { label: 'Skills',     href: '#skills',     id: 'skills' },
    { label: 'Projects',   href: '#projects',   id: 'projects' },
    { label: 'Experience', href: '#experience', id: 'experience' },
];

/* ── Hamburger icon ── */
function HamburgerIcon({ open }) {
    return (
        <div style={{ width: 20, height: 14, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <span style={{
                display: 'block', height: '1.5px', background: '#ffffff', borderRadius: '2px',
                transformOrigin: 'left center',
                transform: open ? 'rotate(45deg) translate(1px, -1px)' : 'none',
                transition: 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
                width: open ? '141%' : '100%',
            }} />
            <span style={{
                display: 'block', height: '1.5px', background: '#ffffff', borderRadius: '2px',
                opacity: open ? 0 : 1,
                transform: open ? 'scaleX(0)' : 'scaleX(1)',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
            }} />
            <span style={{
                display: 'block', height: '1.5px', background: '#ffffff', borderRadius: '2px',
                transformOrigin: 'left center',
                transform: open ? 'rotate(-45deg) translate(1px, 1px)' : 'none',
                transition: 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
                width: open ? '141%' : '100%',
            }} />
        </div>
    );
}

export default function Navbar() {
    const [scrolled, setScrolled]           = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [mobileOpen, setMobileOpen]       = useState(false);
    const mobileMenuRef                     = useRef(null);

    /* Close mobile menu on outside click */
    useEffect(() => {
        if (!mobileOpen) return;
        const handler = (e) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
                setMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [mobileOpen]);

    /* Lock body scroll when mobile menu is open */
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    /* Scroll detection */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* Active section tracking */
    useEffect(() => {
        const sectionIds = ['home', 'about', 'projects', 'skills', 'education', 'experience', 'contact'];
        const elements   = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
        const observer   = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { threshold: 0.25 }
        );
        elements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const handleNavClick = () => setMobileOpen(false);

    /* Shared nav link renderer */
    const NavLink = ({ link, mobile = false }) => {
        const isActive = activeSection === link.id;
        return (
            <a
                href={link.href}
                onClick={handleNavClick}
                style={mobile ? {
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '18px',
                    color: isActive ? '#a1ff62' : 'rgba(255,255,255,0.80)',
                    textDecoration: 'none',
                    padding: '14px 0',
                    borderBottom: '1px dashed rgba(255,255,255,0.08)',
                    display: 'block',
                    letterSpacing: '-0.02em',
                    transition: 'color 0.2s ease',
                } : {
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '13px',
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)',
                    textDecoration: 'none',
                    padding: '5px 11px',
                    borderRadius: '1600px',
                    background: isActive ? 'rgba(161,255,98,0.14)' : 'transparent',
                    border: isActive ? '1px solid rgba(161,255,98,0.25)' : '1px solid transparent',
                    transition: 'color 0.2s ease, background 0.2s ease, border-color 0.2s ease',
                    letterSpacing: '-0.02em',
                }}
                onMouseEnter={!mobile ? (e) => {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                } : undefined}
                onMouseLeave={!mobile ? (e) => {
                    e.currentTarget.style.color = isActive ? '#ffffff' : 'rgba(255,255,255,0.6)';
                    e.currentTarget.style.background = isActive ? 'rgba(161,255,98,0.14)' : 'transparent';
                } : undefined}
            >
                {link.label}
            </a>
        );
    };

    const glassStyle = {
        background: scrolled ? 'rgba(8,7,12,0.92)' : 'rgba(10,8,16,0.84)',
        backdropFilter: 'blur(20px) saturate(1.8) brightness(1.05)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.8) brightness(1.05)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: scrolled
            ? 'rgba(0,0,0,0.5) 0px 16px 40px 0px, rgba(0,0,0,0.12) 0px 0px 12px 0px inset'
            : 'rgba(0,0,0,0.35) 0px 8px 24px 0px, rgba(0,0,0,0.08) 0px 0px 10px 0px inset',
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
    };

    return (
        <>
            {/* ── Desktop / Tablet Capsule Nav ── */}
            <nav
                className="nav-desktop"
                style={{
                    position: 'fixed',
                    top: '14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    padding: '5px 12px',
                    borderRadius: '1600px',
                    whiteSpace: 'nowrap',
                    maxWidth: '92vw',
                    ...glassStyle,
                }}
            >
                <MonogramTag />
                <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.12)', margin: '0 4px' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                    {NAV_LINKS.map(link => (
                        <NavLink key={link.id} link={link} />
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '5px' }}>
                    <a
                        href="/resume.pdf"
                        download="Mohan_Reddy_Resume.pdf"
                        style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 400, fontSize: '12.5px',
                            color: 'rgba(255,255,255,0.65)', textDecoration: 'none',
                            padding: '5px 11px', borderRadius: '1600px',
                            transition: 'color 0.2s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                    >
                        Resume
                    </a>
                    <a
                        href="#contact"
                        style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 700, fontSize: '12.5px',
                            color: '#201d1d', background: '#a1ff62',
                            padding: '5px 15px', borderRadius: '1600px',
                            border: '1px solid #a1ff62', textDecoration: 'none',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            boxShadow: '0 2px 8px rgba(161,255,98,0.28)',
                            letterSpacing: '-0.01em',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)';
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(161,255,98,0.5)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(161,255,98,0.28)';
                        }}
                    >
                        Contact
                    </a>
                </div>
            </nav>

            {/* ── Mobile Compact Bar ── */}
            <div
                ref={mobileMenuRef}
                className="nav-mobile"
                style={{ position: 'fixed', top: '12px', left: '50%', transform: 'translateX(-50%)', zIndex: 200, width: 'calc(100vw - 32px)', maxWidth: '440px' }}
            >
                {/* Mobile header bar */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 14px', borderRadius: '1600px',
                    ...glassStyle,
                }}>
                    <MonogramTag onClick={handleNavClick} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <a
                            href="#contact"
                            onClick={handleNavClick}
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: 700, fontSize: '12px',
                                color: '#201d1d', background: '#a1ff62',
                                padding: '5px 13px', borderRadius: '1600px',
                                border: '1px solid #a1ff62', textDecoration: 'none',
                                letterSpacing: '-0.01em',
                            }}
                        >
                            Contact
                        </a>
                        <button
                            onClick={() => setMobileOpen(o => !o)}
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={mobileOpen}
                            style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.14)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', flexShrink: 0, padding: 0,
                                transition: 'background 0.2s ease',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                        >
                            <HamburgerIcon open={mobileOpen} />
                        </button>
                    </div>
                </div>

                {/* Mobile slide-down menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.97 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            style={{
                                marginTop: '8px',
                                borderRadius: '18px',
                                padding: '8px 20px 20px',
                                ...glassStyle,
                                backdropFilter: 'blur(24px) saturate(2) brightness(1.05)',
                                WebkitBackdropFilter: 'blur(24px) saturate(2) brightness(1.05)',
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {NAV_LINKS.map(link => (
                                    <NavLink key={link.id} link={link} mobile />
                                ))}
                            </div>
                            <a
                                href="/resume.pdf"
                                download="Mohan_Reddy_Resume.pdf"
                                onClick={handleNavClick}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    marginTop: '18px',
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: 600, fontSize: '13px',
                                    color: 'rgba(255,255,255,0.65)',
                                    textDecoration: 'none', letterSpacing: '-0.01em',
                                    padding: '10px 0',
                                    transition: 'color 0.2s ease',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                            >
                                ↓ Download Resume
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Responsive: hide desktop on mobile, hide mobile on desktop ── */}
            <style>{`
                .nav-desktop { display: flex !important; }
                .nav-mobile  { display: none  !important; }
                @media (max-width: 768px) {
                    .nav-desktop { display: none  !important; }
                    .nav-mobile  { display: block !important; }
                }
            `}</style>
        </>
    );
}
