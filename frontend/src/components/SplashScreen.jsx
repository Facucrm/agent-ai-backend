import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const SplashScreen = ({ onFinish }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Reducimos el tiempo de espera para que se sienta más rápido
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onFinish) onFinish();
        }, 1200); // Antes 2500
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: '#030712', // Fondo oscuro premium
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                    }}
                >
                    {/* Contenedor del Isotipo Elevado */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ position: 'relative', marginBottom: '24px' }}
                    >
                        {/* El nuevo isotipo de marca pedido por el usuario */}
                        <div style={{
                            width: '120px',
                            height: '120px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            borderRadius: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 0 50px rgba(59, 130, 246, 0.3)'
                        }}>
                            <Logo size={100} />
                        </div>

                        {/* Anillo de carga sutil */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            style={{
                                position: 'absolute',
                                top: '-10px',
                                left: '-10px',
                                right: '-10px',
                                bottom: '-10px',
                                border: '2px solid transparent',
                                borderTopColor: 'rgba(59, 130, 246, 0.5)',
                                borderRadius: '35px',
                            }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1 style={{
                            fontSize: '1.8rem',
                            fontWeight: 800,
                            color: 'white',
                            letterSpacing: '8px',
                            fontFamily: 'var(--font-display)',
                            margin: 0
                        }}>PLANIT</h1>
                        <div style={{
                            height: '2px',
                            width: '40px',
                            background: 'var(--primary)',
                            margin: '8px auto 0',
                            borderRadius: '2px'
                        }} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;
