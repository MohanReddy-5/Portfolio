import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.css';
import Navbar from './components/Navbar';
import Cover from './components/Cover';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Contact from './components/Contact';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/* ── Scroll Progress Bar ── */
function ScrollProgressBar() {
    const [scrollWidth, setScrollWidth] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (totalScroll > 0) setScrollWidth((window.scrollY / totalScroll) * 100);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return <div id="scroll-progress-bar" style={{ width: `${scrollWidth}%` }} />;
}

/* ── Root App ── */
export default function App() {
    return (
        <>
            <ScrollProgressBar />
            <div style={{ opacity: 1, minHeight: '100vh', width: '100%' }}>
                <Navbar />
                <Cover />
                <Hero />
                <About />
                <Projects />
                <Skills />
                <Experience />
                <Contact />
            </div>
        </>
    );
}
