import React, { useState } from 'react';
import { Bell, Info, ShieldAlert } from 'lucide-react';

const SurvivalAlerts = () => {
    const [enabled, setEnabled] = useState(true);

    return (
        <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--error)' }}>
                        <ShieldAlert size={24} />
                    </div>
                    <div>
                        <h4 style={{ fontSize: '1rem', color: 'white' }}>Modo Survival</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Notificaciones críticas 24h antes</p>
                    </div>
                </div>

                <div
                    onClick={() => setEnabled(!enabled)}
                    style={{
                        width: '50px',
                        height: '26px',
                        background: enabled ? 'var(--error)' : 'var(--glass-bg)',
                        borderRadius: '13px',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: '3px',
                        left: enabled ? '27px' : '3px',
                        width: '20px',
                        height: '20px',
                        background: 'white',
                        borderRadius: '10px',
                        transition: 'var(--transition)'
                    }} />
                </div>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '12px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'start' }}>
                <Info size={16} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    El sistema detectará automáticamente entregas próximas y te avisará con una notificación de alta prioridad para asegurar que no se te pase nada.
                </p>
            </div>
        </div>
    );
};

export default SurvivalAlerts;
