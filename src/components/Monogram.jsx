import { useState } from 'react';

export default function Monogram({ className = '' }) {
    const [hovered, setHovered] = useState(false);
    return (
        <a
            href="#home"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`inline-flex items-center select-none ${className}`}
            style={{
                textDecoration: 'none',
                transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
            }}
            aria-label="Mohan Reddy Home"
        >
            <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect
                    x="0.75"
                    y="0.75"
                    width="38.5"
                    height="22.5"
                    rx="5.5"
                    fill={hovered ? '#a1ff62' : '#0d0d0d'}
                    stroke={hovered ? '#a1ff62' : 'rgba(13,13,13,0.3)'}
                    strokeWidth="1.5"
                    style={{ transition: 'all 0.25s ease' }}
                />
                <text
                    x="20"
                    y="16"
                    textAnchor="middle"
                    fill={hovered ? '#0d0d0d' : '#ffffff'}
                    fontFamily="'Space Grotesk', sans-serif"
                    fontSize="11.5"
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
