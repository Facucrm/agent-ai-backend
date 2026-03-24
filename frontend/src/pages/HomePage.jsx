import React, { useState } from 'react';
import { TrendingUp, Zap, Check, Crown, Sparkles, Star, ArrowRight, Shield, X, CreditCard, Building2, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

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
            name: 'Gratuito',
            price: '0€',
            period: 'para siempre',
            description: 'Perfecto para empezar a organizar tus tareas',
            color: 'var(--text-secondary)',
            gradient: 'rgba(100,116,139,0.08)',
            border: 'var(--glass-border)',
            features: [
                'Gestión manual de tareas',
                'Vista diaria, semanal y mensual',
                'Progreso académico básico',
                '5 anuncios al día (2 tokens c/u)',
            ],
            cta: 'Plan Actual',
            disabled: true,
        },
        {
            id: 'pro',
            name: 'Pro',
            price: '2,99€',
            period: '/mes',
            description: 'Desbloquea la productividad con IA y voz',
            color: 'var(--primary)',
            gradient: 'rgba(59,130,246,0.12)',
            border: 'rgba(59,130,246,0.4)',
            popular: true,
            billingOptions: [
                { label: 'Mensual', price: '2,99€', period: '/mes', value: 2.99, savings: null },
                { label: 'Trimestral', price: '7€', period: '/trimestre', value: 7, savings: 'Ahorra 22%' },
                { label: 'Anual', price: '19,99€', period: '/año', value: 19.99, savings: 'Ahorra 44%' },
            ],
            features: [
                'Todo del plan Gratuito',
                '🎤 Tareas por voz ilimitadas',
                '🔗 Sincronización Campus Virtual',
                '50 tokens mensuales incluidos',
                'Sin anuncios',
                'Soporte prioritario',
            ],
            cta: 'Empezar Pro',
            disabled: false,
        },
        {
            id: 'institution',
            name: 'Instituciones',
            price: 'Personalizado',
            period: '',
            description: 'Para academias, universidades y centros educativos',
            color: 'var(--secondary)',
            gradient: 'rgba(139,92,246,0.12)',
            border: 'rgba(139,92,246,0.4)',
            features: [
                'Todo del plan Pro',
                '🏫 Multi-usuario para alumnos',
                '📊 Panel de administración',
                '🤖 Planificación IA automática',
                'Tokens ilimitados para el centro',
                'Soporte dedicado 24/7',
                'Precio por volumen de alumnos',
            ],
            cta: 'Contáctanos',
            disabled: false,
            isInstitution: true,
        },
    ];

    // ── Payment handlers ───────────────────────────────────
    const openCheckout = (plan, billing) => {
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
        setTimeout(() => setPaymentStep('success'), 2500);
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

    // ── Contact handler ────────────────────────────────────
    const handleContact = (e) => {
        e.preventDefault();
        setContactSent(true);
        setTimeout(() => { setShowContact(false); setContactSent(false); setContactName(''); setContactEmail(''); setContactInstitution(''); setContactStudents(''); setContactMessage(''); }, 3000);
    };

    return (
        <div className="page-content" style={{ paddingBottom: '100px' }}>
            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>¡Hola! 👋</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Tu resumen académico de un vistazo</p>
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

            {/* ── Subscription Plans ── */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <Crown size={20} color="var(--secondary)" />
                    <h3 style={{ fontSize: '1.2rem' }}>Planes de Suscripción</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Elige el plan que mejor se adapte a ti</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {plans.map((plan, i) => (
                    <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.12 }} className="card" style={{ padding: '24px 20px', background: plan.gradient, borderColor: plan.border, position: 'relative', overflow: 'hidden' }}>
                        {plan.popular && (
                            <div style={{ position: 'absolute', top: '12px', right: '12px', background: plan.color, color: 'white', padding: '3px 10px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><Sparkles size={10} /> MÁS POPULAR</div>
                        )}

                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                {plan.isInstitution && <Building2 size={20} color={plan.color} />}
                                <h4 style={{ fontSize: '1.1rem', color: plan.color }}>{plan.name}</h4>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                                <span style={{ fontSize: plan.isInstitution ? '1.5rem' : '2rem', fontWeight: 800 }}>{plan.price}</span>
                                {plan.period && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{plan.period}</span>}
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{plan.description}</p>
                        </div>

                        {/* Billing options for Pro */}
                        {plan.billingOptions && (
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                {plan.billingOptions.map((b) => (
                                    <button key={b.label} onClick={() => openCheckout(plan, b)} style={{ flex: 1, minWidth: '90px', padding: '10px 6px', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.08)', cursor: 'pointer', textAlign: 'center', fontFamily: 'var(--font-main)', transition: 'var(--transition)' }}>
                                        <span style={{ display: 'block', fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary)' }}>{b.price}</span>
                                        <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)' }}>{b.label}</span>
                                        {b.savings && <span style={{ display: 'block', fontSize: '0.55rem', color: 'var(--success)', fontWeight: 700, marginTop: '2px' }}>{b.savings}</span>}
                                    </button>
                                ))}
                            </div>
                        )}

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
                                if (plan.isInstitution) { setShowContact(true); return; }
                                if (plan.billingOptions) { openCheckout(plan, plan.billingOptions[0]); return; }
                            }}
                            disabled={plan.disabled}
                            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: plan.disabled ? '1px solid var(--glass-border)' : 'none', background: plan.disabled ? 'transparent' : plan.color, color: plan.disabled ? 'var(--text-muted)' : 'white', fontWeight: 700, fontSize: '0.9rem', cursor: plan.disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'var(--font-main)', transition: 'var(--transition)', opacity: plan.disabled ? 0.5 : 1 }}
                        >
                            {plan.isInstitution ? <><Send size={16} /> {plan.cta}</> : <>{plan.cta} {!plan.disabled && <ArrowRight size={16} />}</>}
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
                                    <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>¡Bienvenido a Pro! 🎉</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>Tu suscripción está activa. Disfruta de todas las funciones premium.</p>
                                    <button onClick={() => setShowCheckout(false)} className="btn btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '14px' }}>Empezar a usar Planit Pro</button>
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
                                                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>Plan Pro — {checkoutPlan.selectedBilling.label}</span>
                                                <p style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>{checkoutPlan.selectedBilling.price}<span style={{ fontSize: '0.75rem', fontWeight: 400 }}>{checkoutPlan.selectedBilling.period}</span></p>
                                            </div>
                                            {checkoutPlan.selectedBilling.savings && <span style={{ background: 'rgba(16,185,129,0.3)', color: '#6ee7b7', padding: '4px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700 }}>{checkoutPlan.selectedBilling.savings}</span>}
                                        </div>
                                    </div>

                                    {/* Payment Form */}
                                    <div style={{ padding: '24px' }}>
                                        {paymentStep === 'processing' ? (
                                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                                <Loader2 className="animate-spin" size={40} color="var(--primary)" style={{ marginBottom: '16px' }} />
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Procesando pago...</p>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>No cierres esta ventana</p>
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
                                                    <CreditCard size={18} /> Pagar {checkoutPlan.selectedBilling.price}
                                                </button>
                                                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                                                    {['🔒 SSL 256-bit', '💳 Visa / Mastercard'].map(t => (
                                                        <span key={t} style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t}</span>
                                                    ))}
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ══════ Institution Contact Modal ══════ */}
            <AnimatePresence>
                {showContact && (
                    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowContact(false)}>
                        <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} style={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '28px', width: '100%', maxWidth: '420px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)' }}>

                            {contactSent ? (
                                <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                                        <Send size={48} color="var(--secondary)" style={{ marginBottom: '20px' }} />
                                    </motion.div>
                                    <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>¡Mensaje enviado! ✉️</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Nuestro equipo se pondrá en contacto contigo en menos de 24 horas.</p>
                                </div>
                            ) : (
                                <>
                                    <div style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', padding: '24px', borderRadius: '28px 28px 0 0', position: 'relative' }}>
                                        <button onClick={() => setShowContact(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} color="white" /></button>
                                        <Building2 size={28} color="white" style={{ marginBottom: '8px' }} />
                                        <h3 style={{ color: 'white', fontSize: '1.2rem' }}>Plan Instituciones</h3>
                                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>Cuéntanos sobre tu centro y te prepararemos una propuesta a medida</p>
                                    </div>

                                    <div style={{ padding: '24px' }}>
                                        <form onSubmit={handleContact}>
                                            <div className="form-group">
                                                <label className="form-label">Nombre de contacto</label>
                                                <input className="form-input" placeholder="María García" value={contactName} onChange={(e) => setContactName(e.target.value)} required />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Email institucional</label>
                                                <input className="form-input" type="email" placeholder="maria@universidad.es" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Nombre de la institución</label>
                                                <input className="form-input" placeholder="Universidad de Málaga" value={contactInstitution} onChange={(e) => setContactInstitution(e.target.value)} required />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Número aproximado de alumnos</label>
                                                <select className="form-input" value={contactStudents} onChange={(e) => setContactStudents(e.target.value)} required>
                                                    <option value="">Selecciona un rango</option>
                                                    <option>1 – 50 alumnos</option>
                                                    <option>51 – 200 alumnos</option>
                                                    <option>201 – 500 alumnos</option>
                                                    <option>501 – 1.000 alumnos</option>
                                                    <option>Más de 1.000 alumnos</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Mensaje (opcional)</label>
                                                <textarea className="form-input" placeholder="Cuéntanos qué necesitas..." value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} rows={3} style={{ resize: 'none' }} />
                                            </div>
                                            <button type="submit" className="btn" style={{ width: '100%', padding: '16px', borderRadius: '14px', fontSize: '1rem', background: 'var(--secondary)', color: 'white', boxShadow: '0 4px 12px var(--secondary-glow)' }}>
                                                <Send size={18} /> Enviar solicitud
                                            </button>
                                        </form>
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
