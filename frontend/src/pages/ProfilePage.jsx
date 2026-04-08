import React, { useState } from 'react';
import { User, Shield, LogOut, ChevronRight, Mail, Bell, Moon, Users, Copy, Check, Gift, QrCode, X, Share2 } from 'lucide-react';
import { useUser, ROLES } from '../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import PremiumFeature from '../components/PremiumFeature';
import SurvivalAlerts from '../components/SurvivalAlerts';

const ProfilePage = () => {
    const { user, addReferral, isPremium, logout } = useUser();
    const [copied, setCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const handleCopy = () => {
        const link = `https://planit.uma.es/join/${user.referralCode}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const settingsGroups = [
        {
            title: 'Datos Personales',
            items: [
                { icon: User, label: 'Nombre de Usuario', value: user.name },
                { icon: Mail, label: 'Correo Electrónico', value: user.email },
            ]
        },
        {
            title: 'Preferencias',
            items: [
                { icon: Bell, label: 'Notificaciones', toggle: true, checked: true },
                { icon: Moon, label: 'Modo Oscuro', toggle: true, checked: true },
            ]
        },
        {
            title: 'Seguridad',
            items: [
                { icon: Shield, label: 'Cambiar Contraseña', action: true },
            ]
        }
    ];

    return (
        <div className="page-content" style={{ paddingBottom: '100px' }}>
            <div className="section-header" style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Mi Perfil</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Gestiona tu seguridad e información de la cuenta</p>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 16px', borderRadius: '50px', overflow: 'hidden', background: isPremium ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' : 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700, boxShadow: isPremium ? '0 8px 32px var(--primary-glow)' : 'none', border: '1px solid var(--glass-border)' }}>
                    {user.photo ? (
                        <img src={user.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        user.name[0]
                    )}
                    <div style={{ position: 'absolute', bottom: '0', right: '0', width: '28px', height: '28px', background: 'var(--bg-dark)', borderRadius: '14px', border: '3px solid var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                        <div style={{ width: '12px', height: '12px', background: 'var(--success)', borderRadius: '6px' }} />
                    </div>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{user.name}</h3>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: isPremium ? 'rgba(59, 130, 246, 0.1)' : 'var(--glass-bg)', padding: '4px 12px', borderRadius: '100px', border: '1px solid var(--glass-border)' }}>
                    <p style={{ color: isPremium ? 'var(--primary)' : 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                        {isPremium ? 'PLAN PREMIUM ACTIVO 🚀' : 'PLAN GRATUITO ACTIVO'}
                    </p>
                </div>
            </div>

            {/* ── Gamificación: Invita a tu clase ── */}
            <div style={{ marginBottom: '32px' }}>
                <h4 style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', marginLeft: '4px' }}>
                    Gamificación
                </h4>
                <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', borderColor: 'var(--secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: 'var(--secondary)', padding: '10px', borderRadius: '12px' }}>
                                <Users size={20} color="white" />
                            </div>
                            <h4 style={{ fontSize: '1rem', color: 'white' }}>Invita a tu clase</h4>
                        </div>
                        <button
                            onClick={() => setShowQR(true)}
                            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
                            title="Mostrar QR para compartir"
                        >
                            <QrCode size={20} />
                        </button>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
                        Invita a 3 amigos a unirse a Planit y desbloquea <span style={{ color: 'white', fontWeight: 700 }}>Premium GRATIS</span> por 30 días.
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} style={{
                                flex: 1,
                                height: '8px',
                                background: (user.referrals || 0) >= i ? 'var(--secondary)' : 'rgba(255,255,255,0.05)',
                                borderRadius: '4px',
                                boxShadow: (user.referrals || 0) >= i ? '0 0 10px var(--secondary-glow)' : 'none',
                                transition: 'var(--transition)'
                            }} />
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div
                            style={{
                                flex: 1,
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                padding: '12px',
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            planit.uma.es/join/{user.referralCode}
                        </div>
                        <button
                            onClick={handleCopy}
                            className="btn"
                            style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '12px' }}
                        >
                            {copied ? <Check size={18} color="var(--success)" /> : <Copy size={18} />}
                        </button>
                    </div>

                    {(user.referrals || 0) < 3 && (
                        <button
                            onClick={addReferral}
                            className="btn btn-ghost"
                            style={{ width: '100%', marginTop: '12px', fontSize: '0.75rem', borderStyle: 'dashed' }}
                        >
                            <User size={14} /> Simular Invitación (+1)
                        </button>
                    )}
                </div>

                {/* Modo Survival movido desde Inicio */}
                <div style={{ marginTop: '20px' }}>
                    <PremiumFeature>
                        <SurvivalAlerts />
                    </PremiumFeature>
                </div>
            </div>

            {settingsGroups.map((group, idx) => (
                <div key={idx} style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', marginLeft: '4px' }}>
                        {group.title}
                    </h4>
                    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        {group.items.map((item, i) => (
                            <div
                                key={i}
                                className="profile-item"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '16px 20px',
                                    borderBottom: i === group.items.length - 1 ? 'none' : '1px solid var(--glass-border)',
                                    cursor: item.action || item.toggle ? 'pointer' : 'default',
                                    transition: 'var(--transition)'
                                }}
                            >
                                <item.icon size={20} color="var(--text-secondary)" />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.85rem', color: 'white', fontWeight: 500 }}>{item.label}</p>
                                    {item.value && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.value}</p>}
                                </div>
                                {item.badge && (
                                    <span style={{ fontSize: '0.65rem', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>{item.badge}</span>
                                )}
                                {item.toggle && (
                                    <div style={{ width: '40px', height: '20px', background: item.checked ? 'var(--primary)' : 'var(--glass-bg)', borderRadius: '10px', position: 'relative', transition: 'var(--transition)' }}>
                                        <div style={{ position: 'absolute', top: '2px', left: item.checked ? '22px' : '2px', width: '16px', height: '16px', background: 'white', borderRadius: '8px', transition: 'var(--transition)' }} />
                                    </div>
                                )}
                                {item.action && <ChevronRight size={18} color="var(--text-muted)" />}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <button
                onClick={logout}
                className="btn btn-ghost"
                style={{ width: '100%', padding: '16px', marginTop: '12px', color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)', gap: '12px' }}
            >
                <LogOut size={20} />
                Cerrar Sesión
            </button>

            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '32px', opacity: 0.5 }}>
                Version 1.0.0 (Alpha Build)
            </p>

            {/* ── QR Share Modal ── */}
            <AnimatePresence>
                {showQR && (
                    <div
                        className="modal-overlay"
                        onClick={() => setShowQR(false)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="card"
                            style={{ width: '100%', maxWidth: '380px', padding: '32px', textAlign: 'center' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Share2 size={18} color="var(--primary)" />
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Compartir Planit</h3>
                                </div>
                                <button onClick={() => setShowQR(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                            </div>

                            <div style={{ width: '200px', height: '200px', background: 'white', margin: '0 auto 24px', padding: '12px', borderRadius: '20px', boxShadow: '0 0 40px var(--primary-glow)' }}>
                                <img
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=176x176&data=https://plannituma.netlify.app/&color=3b82f6"
                                    alt="QR Code"
                                    style={{ width: '100%', height: '100%', borderRadius: '10px' }}
                                />
                            </div>

                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
                                Deja que tus amigos escaneen este código para que prueben la app directamente en sus móviles.
                            </p>

                            <button onClick={() => setShowQR(false)} className="btn btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '12px' }}>
                                Entendido
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfilePage;
