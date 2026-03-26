import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onFinish }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onFinish) onFinish();
        }, 2500);
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'var(--bg-dark)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                    }}
                >
                    {/* Contenedor del Isotipo */}
                    <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '24px' }}>
                        {/* Fondo Azul Circular */}
                        <div style={{
                            width: '100%',
                            height: '100%',
                            background: '#3b82f6', // Azul UMA / Planit
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* La "P" */}
                            <span style={{
                                color: 'white',
                                fontSize: '4.5rem',
                                fontWeight: 800,
                                fontFamily: 'var(--font-display)',
                                zIndex: 2
                            }}>P</span>
                        </div>

                        {/* Órbita Blanca */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            style={{
                                position: 'absolute',
                                top: '-10%',
                                left: '-10%',
                                width: '120%',
                                height: '120%',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '50%',
                                borderTopColor: 'white',
                                zIndex: 3,
                            }}
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h1 style={{
                            fontSize: '2rem',
                            color: 'white',
                            letterSpacing: '4px',
                            fontFamily: 'var(--font-display)'
                        }}>PLANIT</h1>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;
