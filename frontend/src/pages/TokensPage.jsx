import React, { useState, useEffect } from 'react';
import { Play, Zap, CheckCircle, Loader2, X, Check, Crown, Sparkles, ArrowRight, Shield, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TokensPage = () => {
    const [tokens, setTokens] = useState(() => Number(localStorage.getItem('planit_tokens')) || 32);
    const [adsWatchedToday, setAdsWatchedToday] = useState(() => Number(localStorage.getItem('planit_ads_today')) || 0);
    const [isWatching, setIsWatching] = useState(false);
    const [showReward, setShowReward] = useState(false);
    const [showPremium, setShowPremium] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        localStorage.setItem('planit_tokens', tokens);
        localStorage.setItem('planit_ads_today', adsWatchedToday);
    }, [tokens, adsWatchedToday]);

    const watchAd = () => {
        if (adsWatchedToday >= 5) return;
        setIsWatching(true);
        setTimeout(() => {
            setIsWatching(false);
            setTokens(prev => prev + 2);
            setAdsWatchedToday(prev => prev + 1);
            setShowReward(true);
            setTimeout(() => setShowReward(false), 3000);
        }, 3000);
    };

    const adLimitReached = adsWatchedToday >= 5;

    const premiumBenefits = [
        { emoji: '🎤', title: 'Tareas por Voz ilimitadas', desc: 'Dicta tareas sin gastar tokens' },
        { emoji: '🔗', title: 'Sincronización Campus Virtual', desc: 'Importa tu calendario Moodle sin límite' },
        { emoji: '🚫', title: 'Sin Anuncios', desc: 'Experiencia limpia y sin interrupciones' },
        { emoji: '♾️', title: 'Tokens Ilimitados', desc: 'Usa todas las funciones sin restricciones' },
        { emoji: '🤖', title: 'Planificación con IA', desc: 'Organización automática de tu semana' },
        { emoji: '📊', title: 'Analíticas avanzadas', desc: 'Métricas detalladas de tu rendimiento' },
        { emoji: '⚡', title: 'Soporte Prioritario', desc: 'Respuesta en menos de 24 horas' },
        { emoji: '🔮', title: 'Acceso anticipado', desc: 'Prueba nuevas funciones antes que nadie' },
    ];

    const premiumPlans = [
        { id: 'monthly', name: 'Mensual', price: '2,99€', period: '/mes', savings: null, color: 'var(--primary)' },
        { id: 'quarterly', name: 'Trimestral', price: '7€', period: '/trimestre', savings: 'Ahorra 22%', color: 'var(--secondary)', popular: true },
        { id: 'annual', name: 'Anual', price: '19,99€', period: '/año', savings: 'Ahorra 44%', color: 'var(--success)' },
    ];

    const handlePurchase = (plan) => {
        setSelectedPlan(plan.id);
        setTimeout(() => {
            setSelectedPlan(null);
            alert(`¡Gracias por elegir el plan ${plan.name}! En producción, aquí se integraría Stripe u otra pasarela de pago.`);
        }, 2000);
    };

    return (
        <div className="page-content" style={{ paddingBottom: '100px' }}>
            <div className="section-header" style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Mis Tokens</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Gana acceso premium interactuando con la comunidad</p>
            </div>

            {/* Balance Card */}
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px', marginBottom: '32px', background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 100%)', border: '1px solid var(--primary-glow)' }}>
                <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ fontSize: '4rem', marginBottom: '16px' }}>🪙</motion.div>
                <h3 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '4px' }}>{tokens}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>Tokens Disponibles</p>
            </div>

            {/* Ad Section */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>Gana Tokens</h3>
                    <span style={{ fontSize: '0.8rem', color: adLimitReached ? 'var(--error)' : 'var(--text-secondary)', fontWeight: 600 }}>{adsWatchedToday}/5 Hoy</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px', lineHeight: '1.5' }}>
                    Mira un anuncio corto de 30 segundos para ganar 2 tokens.
                </p>
                <button className="btn btn-primary" onClick={watchAd} disabled={isWatching || adLimitReached} style={{ width: '100%', padding: '16px', borderRadius: '14px', fontSize: '1rem', background: adLimitReached ? 'var(--glass-bg)' : 'var(--primary)', opacity: adLimitReached ? 0.6 : 1 }}>
                    {isWatching ? (<><Loader2 className="animate-spin" size={20} /> Viendo anuncio...</>) : adLimitReached ? (<><CheckCircle size={20} /> Límite diario alcanzado</>) : (<><Play size={20} fill="white" /> Ver Anuncio (+2 Tokens)</>)}
                </button>
            </div>

            {/* Premium Features Info */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Funciones Premium</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--glass-bg)', borderRadius: '12px' }}>
                        <span style={{ fontSize: '1.5rem' }}>🎤</span>
                        <div style={{ flex: 1 }}><p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Tarea por Voz</p><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dicta una tarea con el micrófono</p></div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)', background: 'rgba(139,92,246,0.15)', padding: '4px 10px', borderRadius: '8px' }}>1 Token</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--glass-bg)', borderRadius: '12px' }}>
                        <span style={{ fontSize: '1.5rem' }}>🔗</span>
                        <div style={{ flex: 1 }}><p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sincronizar UMA</p><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Importar calendario de Moodle</p></div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)', background: 'rgba(139,92,246,0.15)', padding: '4px 10px', borderRadius: '8px' }}>3 Tokens</span>
                    </div>
                </div>
            </div>

            {/* Premium CTA */}
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', borderColor: 'rgba(139, 92, 246, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ padding: '10px', background: 'var(--secondary)', borderRadius: '10px' }}><Zap size={20} color="white" fill="white" /></div>
                    <h3 style={{ fontSize: '1.1rem' }}>Sin límites con Premium</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
                    Elimina los anuncios, obtén tokens ilimitados y funciones de IA exclusivas.
                </p>
                <button onClick={() => setShowPremium(true)} className="btn btn-ghost" style={{ width: '100%', borderColor: 'var(--secondary)', color: 'white' }}>
                    Upgrade a Premium
                </button>
            </div>

            {/* ══════ Premium Upgrade Modal ══════ */}
            <AnimatePresence>
                {showPremium && (
                    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowPremium(false)}>
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            style={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '28px', width: '100%', maxWidth: '420px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)' }}
                        >
                            {/* Header */}
                            <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 50%, #06b6d4 100%)', padding: '32px 24px', textAlign: 'center', borderRadius: '28px 28px 0 0', position: 'relative' }}>
                                <button onClick={() => setShowPremium(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} color="white" /></button>
                                <Crown size={40} color="white" style={{ marginBottom: '12px' }} />
                                <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '4px' }}>Planit Premium</h3>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Lleva tu productividad al siguiente nivel</p>
                            </div>

                            <div style={{ padding: '24px' }}>
                                {/* Benefits */}
                                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Todo lo que incluye</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '28px' }}>
                                    {premiumBenefits.map((b, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                                            <span style={{ fontSize: '1.3rem' }}>{b.emoji}</span>
                                            <p style={{ fontSize: '0.78rem', fontWeight: 700, marginTop: '6px' }}>{b.title}</p>
                                            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>{b.desc}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Plans */}
                                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Elige tu plan</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                                    {premiumPlans.map((plan) => (
                                        <button
                                            key={plan.id}
                                            onClick={() => handlePurchase(plan)}
                                            disabled={selectedPlan === plan.id}
                                            style={{
                                                width: '100%', padding: '16px 18px', borderRadius: '14px',
                                                border: plan.popular ? `2px solid ${plan.color}` : '1px solid var(--glass-border)',
                                                background: plan.popular ? 'rgba(139,92,246,0.1)' : 'var(--bg-card)',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px',
                                                fontFamily: 'var(--font-main)', transition: 'var(--transition)', position: 'relative'
                                            }}
                                        >
                                            {plan.popular && (
                                                <span style={{ position: 'absolute', top: '-10px', right: '14px', background: plan.color, color: 'white', padding: '2px 10px', borderRadius: '100px', fontSize: '0.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}><Sparkles size={10} /> MEJOR VALOR</span>
                                            )}
                                            <div style={{ flex: 1, textAlign: 'left' }}>
                                                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{plan.name}</span>
                                                {plan.savings && <span style={{ marginLeft: '8px', fontSize: '0.65rem', color: 'var(--success)', fontWeight: 700, background: 'rgba(16,185,129,0.15)', padding: '2px 6px', borderRadius: '4px' }}>{plan.savings}</span>}
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: plan.color }}>{plan.price}</span>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{plan.period}</span>
                                            </div>
                                            {selectedPlan === plan.id && <Loader2 className="animate-spin" size={18} color={plan.color} />}
                                        </button>
                                    ))}
                                </div>

                                {/* Trust */}
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                                    {['Pago seguro SSL', 'Cancela cuando quieras'].map(t => (
                                        <span key={t} style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><Shield size={10} /> {t}</span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Reward Toast */}
            <AnimatePresence>
                {showReward && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} style={{ position: 'fixed', bottom: '100px', left: '20px', right: '20px', padding: '16px', background: 'var(--success)', borderRadius: '12px', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)', zIndex: 100 }}>
                        <CheckCircle size={24} />
                        🎉 ¡Has ganado +2 Tokens!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TokensPage;
