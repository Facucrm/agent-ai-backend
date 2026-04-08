import React from 'react';

const Logo = ({ size = 64, className = "" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Sombras y profundidad del planeta */}
            <circle cx="50" cy="40" r="28" fill="url(#planetGradient)" />

            {/* El anillo del planeta (estilo Saturno) */}
            <ellipse
                cx="50"
                cy="40"
                rx="45"
                ry="12"
                stroke="white"
                strokeWidth="4"
                transform="rotate(-20 50 40)"
                strokeLinecap="round"
                style={{ opacity: 0.9 }}
            />

            {/* El tallo de la "P" */}
            <path
                d="M32 40V85C32 89 35 92 39 92C43 92 46 89 46 85V62"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
            />

            {/* Parte delantera del anillo para efecto 3D (oculta el planeta detrás) */}
            <path
                d="M10 52C15 58 35 60 50 60C65 60 85 58 90 52"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                transform="rotate(-20 50 40)"
                clipPath="url(#frontRingClip)"
            />

            <defs>
                <linearGradient id="planetGradient" x1="50" y1="12" x2="50" y2="68" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="#E2E8F0" />
                </linearGradient>
                <clipPath id="frontRingClip">
                    <rect x="0" y="40" width="100" height="60" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default Logo;
