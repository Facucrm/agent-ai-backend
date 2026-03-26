import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { useUser } from '../context/UserContext';
import PremiumModal from './PremiumModal';

const PremiumFeature = ({ children, fallback }) => {
    const { isPremium } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isPremium) {
        return children;
    }

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsModalOpen(true);
    };

    return (
        <>
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleClick}>
                {/* Overlay de bloqueo */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(3, 7, 18, 0.4)',
                    backdropFilter: 'blur(2px)',
                    zIndex: 10,
                    borderRadius: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--glass-border)',
                        padding: '8px',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        color: 'var(--warning)'
                    }}>
                        <Lock size={18} />
                    </div>
                </div>

                {/* Contenido difuminado o desactivado */}
                <div style={{ opacity: 0.6, pointerEvents: 'none' }}>
                    {children}
                </div>
            </div>

            <PremiumModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default PremiumFeature;
