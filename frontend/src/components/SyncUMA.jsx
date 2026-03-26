import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, ArrowRight, Building2 } from 'lucide-react';

const SyncUMA = () => {
    return (
        <Link to="/sync" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', border: '1px solid rgba(139, 92, 246, 0.3)', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Building2 size={16} color="var(--primary)" />
                        <h4 style={{ fontSize: '1rem', color: 'white' }}>Campus Virtual UMA</h4>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        Sincroniza tus tareas y fechas de entrega con un enlace de la API.
                    </p>
                </div>

                <div className="btn btn-primary" style={{ padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RefreshCw size={18} /> Configurar <ArrowRight size={16} />
                </div>
            </div>
        </Link>
    );
};

export default SyncUMA;
