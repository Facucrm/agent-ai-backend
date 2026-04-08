import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, ArrowLeft, Loader2, CheckCircle2, AlertCircle, ExternalLink, Zap, Info, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../context/TasksContext';
import { useUser } from '../context/UserContext';

const SyncPage = () => {
    const navigate = useNavigate();
    const { umaUrl, syncWithUMA } = useTasks(); // Eliminamos importTasks e isSyncing si no se usan aquí directamente
    const { user, setCalendarUrl } = useUser();
    const [apiUrl, setApiUrl] = useState(user?.calendarUrl || '');
    const [status, setStatus] = useState('idle'); // idle | connecting | success | error
    const [error, setError] = useState('');
    const [foundCount, setFoundCount] = useState(0);

    useEffect(() => {
        if (user?.calendarUrl && !apiUrl) {
            setApiUrl(user.calendarUrl);
        }
    }, [user]);

    const handleSync = async (e) => {
        if (e) e.preventDefault();

        const urlToUse = apiUrl.trim();
        if (!urlToUse) {
            setStatus('error');
            setError('Por favor, introduce una URL válida.');
            return;
        }

        setStatus('connecting');
        setError('');

        const result = await syncWithUMA(urlToUse);
        if (result.success) {
            setFoundCount(result.count);
            setStatus('success');
        } else {
            setStatus('error');
            setError(result.error);
        }
    };

    return (
        <div className="page-content" style={{ paddingBottom: '60px' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '10px', color: 'white', cursor: 'pointer' }}>
                    <ArrowLeft size={20} />
                </button>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '2px' }}>Sincronizar Calendario</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Campus Virtual de la UMA</p>
                </div>
                {user?.calendarUrl && (
                    <button
                        onClick={() => handleSync()}
                        disabled={status === 'connecting'}
                        className="btn-icon"
                        style={{ background: 'var(--primary)', color: 'white', width: '40px', height: '40px', borderRadius: '12px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px var(--primary-glow)' }}
                    >
                        <RefreshCw size={20} className={status === 'connecting' ? 'animate-spin' : ''} />
                    </button>
                )}
            </header>

            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div className="card" style={{ padding: '24px', marginBottom: '24px', border: '1px solid rgba(59, 130, 246, 0.3)', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(3, 7, 18, 0.4) 100%)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px' }}>
                            <ExternalLink size={20} color="white" />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1rem', color: 'white' }}>Paso 1: Obtén tu enlace</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Desde el Campus Virtual UMA</p>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
                        Haz clic en el botón de abajo para ir directamente a la sección de exportación de calendario en el Campus Virtual. Elige <span style={{ color: 'white', fontWeight: 700 }}>"Todos los eventos"</span> y <span style={{ color: 'white', fontWeight: 700 }}>"Un año"</span>, luego copia la URL del botón <span style={{ color: 'white', fontWeight: 700 }}>"URL de calendario"</span>.
                    </p>
                    <a
                        href="https://marketinggestion.cv.uma.es/calendar/export.php?"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn"
                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', textDecoration: 'none', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                    >
                        Abrir Campus Virtual <ExternalLink size={16} />
                    </a>
                </div>

                <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                    <form onSubmit={handleSync}>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                <Link2 size={16} color="var(--primary)" /> URL del Calendario (.ics)
                            </label>
                            <input
                                className="form-input"
                                placeholder="https://marketinggestion.cv.uma.es/..."
                                value={apiUrl}
                                onChange={(e) => setApiUrl(e.target.value)}
                                disabled={status === 'connecting'}
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                            />
                        </div>

                        {status === 'error' && (
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', padding: '12px', borderRadius: '10px', color: 'var(--error)', fontSize: '0.75rem', marginBottom: '20px', display: 'flex', gap: '8px' }}>
                                <AlertCircle size={16} /> <span>{error}</span>
                            </div>
                        )}

                        <button type="submit" disabled={status === 'connecting'} className="btn btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '14px', background: 'var(--primary)', boxShadow: '0 8px 20px var(--primary-glow)', pointerEvents: status === 'connecting' ? 'none' : 'auto' }}>
                            {status === 'connecting' ? (
                                <><Loader2 size={18} className="animate-spin" /> Conectando...</>
                            ) : (
                                <><Zap size={18} /> {user?.calendarUrl ? 'Actualizar Calendario' : 'Vincular Campus Virtual'}</>
                            )}
                        </button>
                    </form>
                </div>

                <AnimatePresence>
                    {status === 'success' && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ padding: '24px', border: '1px solid var(--success)', background: 'rgba(16, 185, 129, 0.1)' }}>
                            <div style={{ textAlign: 'center' }}>
                                <CheckCircle2 size={40} color="var(--success)" style={{ marginBottom: '12px' }} />
                                <h4 style={{ color: 'white', marginBottom: '8px' }}>¡Sincronizado!</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Se han añadido {foundCount} tareas a tu agenda.</p>
                                <button onClick={() => navigate('/tasks')} className="btn btn-ghost" style={{ width: '100%' }}>Ir a mi Agenda</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="card" style={{ marginTop: '24px', background: 'rgba(255,255,255,0.02)', padding: '20px' }}>
                    <h5 style={{ fontSize: '0.9rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Info size={16} color="var(--primary)" /> Configurar y olvidar</h5>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        Una vez guardas tu enlace, Planit sincronizará automáticamente tus entregas de los últimos 60 días cada vez que entres a la App.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SyncPage;
