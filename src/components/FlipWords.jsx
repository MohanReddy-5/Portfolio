import { useState, useEffect } from 'react';

const WORDS = ['experiences', 'products', 'software', 'reality'];

export default function FlipWords() {
    const [index, setIndex] = useState(0);
    const [cls, setCls] = useState('flip-in');
    useEffect(() => {
        const t = setInterval(() => {
            setCls('flip-out');
            setTimeout(() => { setIndex(i => (i + 1) % WORDS.length); setCls('flip-in'); }, 350);
        }, 2600);
        return () => clearInterval(t);
    }, []);
    return (
        <span className={cls} style={{ display: 'inline-block', color: '#6840ff', minWidth: '10rem' }}>
            {WORDS[index]}
        </span>
    );
}
