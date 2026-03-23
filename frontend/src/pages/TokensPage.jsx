import React, { useState, useEffect } from 'react';
import { Play, TrendingUp, Zap, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TokensPage = () => {
    const [tokens, setTokens] = useState(() => Number(localStorage.getItem('planit_tokens')) || 32);
    const [adsWatchedToday, setAdsWatchedToday] = useState(() => Number(localStorage.getItem('planit_ads_today')) || 0);
    const [isWatching, setIsWatching] = useState(false);
    const [showReward, setShowReward] = useState(false);

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

    return (
        <div className="page-content">
            <div className="section-header" style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Mis Tokens</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Gana acceso premium interactuando con la comunidad</p>
            </div>

            {/* Balance Card */}
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px', marginBottom: '32px', background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 100%)', border: '1px solid var(--primary-glow)' }}>
                <motion.div
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    style={{ fontSize: '4rem', marginBottom: '16px' }}
                >
                    🪙
                </motion.div>
                <h3 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '4px' }}>{tokens}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>Tokens Disponibles</p>
            </div>

            {/* Ad Section */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>Gana Tokens</h3>
                    <span style={{ fontSize: '0.8rem', color: adLimitReached ? 'var(--error)' : 'var(--text-secondary)', fontWeight: 600 }}>
                        {adsWatchedToday}/5 Hoy
                    </span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px', lineHeight: '1.5' }}>
                    Mira un anuncio corto de 30 segundos para ganar 2 tokens. Úsalos para sincronizar tu calendario o generar tareas con IA.
                </p>

                <button
                    className="btn btn-primary"
                    onClick={watchAd}
                    disabled={isWatching || adLimitReached}
                    style={{ width: '100%', padding: '16px', borderRadius: '14px', fontSize: '1rem', background: adLimitReached ? 'var(--glass-bg)' : 'var(--primary)', opacity: adLimitReached ? 0.6 : 1 }}
                >
                    {isWatching ? (
                        <><Loader2 className="animate-spin" size={20} /> Viendo anuncio...</>
                    ) : adLimitReached ? (
                        <><CheckCircle size={20} /> Límite diario alcanzado</>
                    ) : (
                        <><Play size={20} fill="white" /> Ver Anuncio (+2 Tokens)</>
                    )}
                </button>
            </div>

            {/* Premium CTA */}
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', borderColor: 'rgba(139, 92, 246, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ padding: '10px', background: 'var(--secondary)', borderRadius: '10px' }}>
                        <Zap size={20} color="white" fill="white" />
                    </div>
                    <h3 style={{ fontSize: '1.1rem' }}>Sin límites con Premium</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
                    Elimina los anuncios, obtén tokens ilimitados y funciones de IA exclusivas.
                </p>
                <button className="btn btn-ghost" style={{ width: '100%', borderColor: 'var(--secondary)', color: 'white' }}>
                    Upgrade a Premium
                </button>
            </div>

            {/* Reward Toast */}
            <AnimatePresence>
                {showReward && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{ position: 'fixed', bottom: '100px', left: '20px', right: '20px', padding: '16px', background: 'var(--success)', borderRadius: '12px', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)', zIndex: 100 }}
                    >
                        <CheckCircle size={24} />
                        🎉 ¡Has ganado +2 Tokens!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TokensPage;
