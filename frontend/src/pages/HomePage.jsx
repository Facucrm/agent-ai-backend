import React, { useState } from 'react';
import { TrendingUp, Zap, Check, Crown, Sparkles, Star, ArrowRight, Shield, X, CreditCard, Building2, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser, ROLES } from '../context/UserContext';
import PremiumFeature from '../components/PremiumFeature';
import SyncUMA from '../components/SyncUMA';
import SurvivalAlerts from '../components/SurvivalAlerts';
import ExamMode from '../components/ExamMode';

const HomePage = () => {
    const navigate = useNavigate();
    const { user, isPremium, upgradeToPremium } = useUser();

    // ── Payment modal state ────────────────────────────────
    const [showCheckout, setShowCheckout] = useState(false);
    const [checkoutPlan, setCheckoutPlan] = useState(null);
    const [paymentStep, setPaymentStep] = useState('form'); // 'form' | 'processing' | 'success'
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVC, setCardCVC] = useState('');
    const [cardName, setCardName] = useState('');

    // ── Contact modal state ────────────────────────────────
    const [showContact, setShowContact] = useState(false);
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactInstitution, setContactInstitution] = useState('');
    const [contactStudents, setContactStudents] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const [contactSent, setContactSent] = useState(false);

    // ── Progress data ──────────────────────────────────────
    const progress = {
        day: { done: 1, total: 2, percent: 50 },
        week: { done: 3, total: 6, percent: 50 },
        month: { done: 8, total: 14, percent: 57 },
    };

    const progressCards = [
        { key: 'day', label: 'Hoy', emoji: '📅', color: 'var(--primary)', glow: 'var(--primary-glow)' },
        { key: 'week', label: 'Semana', emoji: '📊', color: 'var(--success)', glow: 'rgba(16,185,129,0.4)' },
        { key: 'month', label: 'Mes', emoji: '🗓️', color: 'var(--secondary)', glow: 'var(--secondary-glow)' },
    ];

    // ── Plans ──────────────────────────────────────────────
    const plans = [
        {
            id: 'free',
            name: 'Plan Gratuito',
            price: '0€',
            period: 'siempre',
            description: 'Organización académica básica',
            color: 'var(--text-secondary)',
            gradient: 'rgba(100,116,139,0.08)',
            border: 'var(--glass-border)',
            features: [
                'Calendario mensual',
                'Lista de tareas manual',
                'Configuración básica',
            ],
            cta: user.role === ROLES.FREE ? 'Plan Actual' : 'Básico',
            disabled: user.role === ROLES.FREE,
        },
        {
            id: 'premium',
            name: 'Planit Premium',
            price: '4,99€',
            period: '/semestre',
            description: '¡Asegura tu aprobado con IA!',
            color: 'var(--primary)',
            gradient: 'rgba(59,130,246,0.12)',
            border: 'rgba(59,130,246,0.4)',
            popular: true,
            features: [
                'Todo lo anterior',
                '🔗 Sync Automática UMA',
                '🚨 Smart Alertas "Survival"',
                '⏲️ Modo Examen (Pomodoro)',
                'Sin anuncios',
            ],
            cta: isPremium ? 'Premium Activo' : 'Mejorar ahora',
            disabled: isPremium,
        },
    ];

    // ── Payment handlers ───────────────────────────────────
    const openCheckout = (plan, billing = { label: 'Semestral', price: '4,99€', period: '/semestre' }) => {
        setCheckoutPlan({ ...plan, selectedBilling: billing });
        setPaymentStep('form');
        setCardNumber('');
        setCardExpiry('');
        setCardCVC('');
        setCardName('');
        setShowCheckout(true);
    };

    const handlePayment = (e) => {
        e.preventDefault();
        setPaymentStep('processing');

        // Simular procesamiento bancario
        setTimeout(() => {
            upgradeToPremium(180); // 1 semestre = ~180 días
            setPaymentStep('success');
        }, 2000);
    };

    const formatCardNumber = (v) => {
        const nums = v.replace(/\D/g, '').slice(0, 16);
        return nums.replace(/(.{4})/g, '$1 ').trim();
    };

    const formatExpiry = (v) => {
        const nums = v.replace(/\D/g, '').slice(0, 4);
        if (nums.length >= 3) return nums.slice(0, 2) + '/' + nums.slice(2);
        return nums;
    };

    return (
        <div className="page-content" style={{ paddingBottom: '100px' }}>
            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '8px', fontWeight: 800 }}>¡Hola, {user?.name.split(' ')[0]}! 👋</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>¿Qué tenemos hoy en el Campus?</p>
            </div>

            {/* ── Progress Overview ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
                {progressCards.map((card, i) => {
                    const p = progress[card.key];
                    return (
                        <motion.div key={card.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="card" onClick={() => navigate('/tasks')} style={{ cursor: 'pointer', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: card.gradient || 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{card.emoji}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{card.label}</span>
                                    <span style={{ fontWeight: 800, fontSize: '1rem', color: card.color }}>{p.percent}%</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${p.percent}%` }} transition={{ delay: i * 0.15 + 0.2, duration: 0.6 }} style={{ height: '100%', borderRadius: '3px', background: card.color, boxShadow: `0 0 8px ${card.glow}` }} />
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{p.done} de {p.total} tareas completadas</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ── Premium Features Showcase ── */}
            <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <Crown size={20} color="var(--primary)" />
                    <h3 style={{ fontSize: '1.2rem' }}>Funciones Premium</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <PremiumFeature>
                        <SyncUMA />
                    </PremiumFeature>

                    <PremiumFeature>
                        <SurvivalAlerts />
                    </PremiumFeature>

                    <PremiumFeature>
                        <ExamMode />
                    </PremiumFeature>
                </div>
            </div>

            {/* ── Subscription Plans ── */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <Crown size={20} color="var(--secondary)" />
                    <h3 style={{ fontSize: '1.2rem' }}>Planes de Suscripción</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Mejora tu plan o invita a amigos para desbloquear gratis</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {plans.map((plan, i) => (
                    <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.12 }} className="card" style={{ padding: '24px 20px', background: plan.gradient, borderColor: plan.border, position: 'relative', overflow: 'hidden' }}>
                        {plan.popular && (
                            <div style={{ position: 'absolute', top: '12px', right: '12px', background: plan.color, color: 'white', padding: '3px 10px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><Sparkles size={10} /> MÁS POPULAR</div>
                        )}

                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <h4 style={{ fontSize: '1.1rem', color: plan.color }}>{plan.name}</h4>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                                <span style={{ fontSize: '2rem', fontWeight: 800 }}>{plan.price}</span>
                                {plan.period && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{plan.period}</span>}
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{plan.description}</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                            {plan.features.map((f, j) => (
                                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                    <Check size={14} color={plan.color} strokeWidth={3} />
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                if (plan.disabled) return;
                                if (plan.id === 'premium') { openCheckout(plan); return; }
                            }}
                            disabled={plan.disabled}
                            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: plan.disabled ? '1px solid var(--glass-border)' : 'none', background: plan.disabled ? 'transparent' : plan.color, color: plan.disabled ? 'var(--text-muted)' : 'white', fontWeight: 700, fontSize: '0.9rem', cursor: plan.disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'var(--font-main)', transition: 'var(--transition)', opacity: plan.disabled ? 0.5 : 1 }}
                        >
                            {plan.cta} {!plan.disabled && <ArrowRight size={16} />}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Trust badges */}
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                {['Pago seguro SSL', 'Cancela cuando quieras', 'RGPD'].map(badge => (
                    <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}><Shield size={12} /> {badge}</div>
                ))}
            </div>

            {/* ══════ Payment Checkout Modal ══════ */}
            <AnimatePresence>
                {showCheckout && checkoutPlan && (
                    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && paymentStep !== 'processing' && setShowCheckout(false)}>
                        <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} style={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '28px', width: '100%', maxWidth: '420px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)' }}>

                            {paymentStep === 'success' ? (
                                <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                                        <CheckCircle2 size={64} color="var(--success)" style={{ marginBottom: '20px' }} />
                                    </motion.div>
                                    <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>¡Bienvenido a Premium! 🎉</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>Tu suscripción está activa. Disfruta de todas las funciones de Planit.</p>
                                    <button onClick={() => setShowCheckout(false)} className="btn btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '14px' }}>Empezar</button>
                                </div>
                            ) : (
                                <>
                                    {/* Header */}
                                    <div style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', padding: '24px', borderRadius: '28px 28px 0 0', position: 'relative' }}>
                                        <button onClick={() => setShowCheckout(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} color="white" /></button>
                                        <CreditCard size={28} color="white" style={{ marginBottom: '8px' }} />
                                        <h3 style={{ color: 'white', fontSize: '1.2rem' }}>Checkout Seguro</h3>
                                        <div style={{ marginTop: '12px', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>Planit Premium</span>
                                                <p style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>4,99€<span style={{ fontSize: '0.75rem', fontWeight: 400 }}>/semestre</span></p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Form */}
                                    <div style={{ padding: '24px' }}>
                                        {paymentStep === 'processing' ? (
                                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                                <Loader2 className="animate-spin" size={40} color="var(--primary)" style={{ marginBottom: '16px' }} />
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Procesando pago...</p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handlePayment}>
                                                <div className="form-group">
                                                    <label className="form-label">Nombre en la tarjeta</label>
                                                    <input className="form-input" placeholder="Juan Pérez" value={cardName} onChange={(e) => setCardName(e.target.value)} required />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Número de tarjeta</label>
                                                    <input className="form-input" placeholder="4242 4242 4242 4242" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} required style={{ letterSpacing: '2px' }} />
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                                    <div className="form-group">
                                                        <label className="form-label">Caducidad</label>
                                                        <input className="form-input" placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(formatExpiry(e.target.value))} required />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">CVC</label>
                                                        <input className="form-input" placeholder="123" value={cardCVC} onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, '').slice(0, 3))} required type="password" />
                                                    </div>
                                                </div>
                                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '14px', fontSize: '1rem' }}>
                                                    <CreditCard size={18} /> Pagar 4,99€
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HomePage;
