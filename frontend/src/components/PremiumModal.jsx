import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Users, Gift, ChevronRight } from 'lucide-react';
import { useUser } from '../context/UserContext';

const PremiumModal = ({ isOpen, onClose }) => {
    const { user } = useUser();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                    style={{ position: 'relative', padding: '0' }}
                >
                    {/* Botón Cerrar */}
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            borderRadius: '50%',
                            padding: '8px',
                            cursor: 'pointer',
                            color: 'white',
                            zIndex: 10
                        }}
                    >
                        <X size={20} />
                    </button>

                    {/* Header con gradiente Premium */}
                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                        padding: '40px 24px',
                        textAlign: 'center',
                        color: 'white'
                    }}>
                        <Crown size={48} style={{ marginBottom: '16px' }} />
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>¡Asegura tu aprobado!</h2>
                        <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>Desbloquea todo el poder de Planit</p>
                    </div>

                    <div style={{ padding: '24px' }}>
                        {/* Opción 1: Pago */}
                        <div
                            className="card premium-btn"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                marginBottom: '16px',
                                cursor: 'pointer',
                                background: 'rgba(59, 130, 246, 0.1)',
                                borderColor: 'var(--primary)'
                            }}
                        >
                            <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px' }}>
                                <Crown size={24} color="white" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '1rem', color: 'white' }}>Planit Premium</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>4,99€ / semestre (Pago único)</p>
                            </div>
                            <ChevronRight size={18} color="var(--primary)" />
                        </div>

                        <div style={{ textAlign: 'center', margin: '12px 0', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>Ó TAMBIÉN</div>

                        {/* Opción 2: Gamificación (Referidos) */}
                        <div
                            className="card premium-btn"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                cursor: 'pointer',
                                background: 'rgba(139, 92, 246, 0.1)',
                                borderColor: 'var(--secondary)'
                            }}
                        >
                            <div style={{ background: 'var(--secondary)', padding: '10px', borderRadius: '12px' }}>
                                <Users size={24} color="white" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '1rem', color: 'white' }}>Invita a 3 amigos</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Desbloquéalo GRATIS para siempre</p>
                            </div>
                            <div style={{
                                background: 'var(--secondary)',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: 800
                            }}>
                                {user.referrals}/3
                            </div>
                        </div>

                        <div style={{ marginTop: '24px' }}>
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '16px', borderRadius: '14px', fontSize: '1rem' }}
                                onClick={() => {
                                    onClose();
                                    // Simulación o navegación a sección de referidos
                                }}
                            >
                                <Gift size={18} /> Invitar ahora
                            </button>
                        </div>

                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '16px' }}>
                            * El desbloqueo por referidos es válido por 30 días.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PremiumModal;
