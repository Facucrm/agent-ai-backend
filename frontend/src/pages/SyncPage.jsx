import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, ArrowLeft, Loader2, CheckCircle2, AlertCircle, Building2, ExternalLink, Zap, Info, FileText, ClipboardList, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../context/TasksContext';
import { useUser } from '../context/UserContext';

const SyncPage = () => {
    const navigate = useNavigate();
    const { importTasks, umaUrl, syncWithUMA, isSyncing } = useTasks();
    const { user, setCalendarUrl } = useUser();
    const [apiUrl, setApiUrl] = useState(user?.calendarUrl || '');
    const [status, setStatus] = useState('idle'); // idle | connecting | success | error
    const [error, setError] = useState('');
    const [foundCount, setFoundCount] = useState(0);
    const [syncMode, setSyncMode] = useState('link'); // 'link' | 'paste'
    const [pastedIcs, setPastedIcs] = useState('');

    useEffect(() => {
        if (user?.calendarUrl && !apiUrl) {
            setApiUrl(user.calendarUrl);
        }
    }, [user]);

    const handleSync = async (e) => {
        if (e) e.preventDefault();
        setStatus('connecting');
        setError('');

        if (syncMode === 'link') {
            const urlToUse = apiUrl.trim();
            if (!urlToUse) {
                setStatus('error');
                setError('Por favor, introduce una URL válida.');
                return;
            }

            const result = await syncWithUMA(urlToUse);
            if (result.success) {
                setFoundCount(result.count);
                setStatus('success');
            } else {
                setStatus('error');
                setError(result.error);
            }
        } else {
            try {
                if (!pastedIcs.includes('BEGIN:VCALENDAR')) {
                    throw new Error('El contenido pegado no parece un formato de ICS válido.');
                }

                // Logic already in context parser (hidden helper) or we use local
                const parsed = parseICSLocally(pastedIcs);
                const newTasks = parsed.map(evt => ({
                    id: Math.random(),
                    title: evt.title,
                    time: evt.time,
                    priority: evt.title.toLowerCase().includes('entrega') || evt.title.toLowerCase().includes('examen') ? 'Alta' : 'Media',
                    category: 'UMA',
                    source: 'UMA_IMPORT',
                    subject: evt.subject,
                    date: evt.date,
                    status: 'pending'
                }));

                importTasks(newTasks);
                setFoundCount(newTasks.length);
                setStatus('success');
            } catch (err) {
                setStatus('error');
                setError(err.message);
            }
        }
    };

    const parseICSLocally = (data) => {
        const events = [];
        const normalizedData = data.replace(/\r?\n\s/g, '');
        const lines = normalizedData.split(/\r?\n/);
        let currentEvent = null;
        for (let line of lines) {
            const cleanLine = line.trim();
            if (cleanLine === 'BEGIN:VEVENT') {
                currentEvent = { priority: 'Media', category: 'UMA' };
            } else if (cleanLine === 'END:VEVENT') {
                if (currentEvent && currentEvent.title) events.push(currentEvent);
                currentEvent = null;
            } else if (currentEvent) {
                if (cleanLine.startsWith('SUMMARY:')) {
                    currentEvent.title = cleanLine.replace('SUMMARY:', '').trim();
                } else if (cleanLine.startsWith('DESCRIPTION:')) {
                    const desc = cleanLine.replace('DESCRIPTION:', '').trim();
                    const subjectMatch = desc.match(/\[(.*?)\]/) || desc.match(/Asignatura:\s*(.*)/i);
                    currentEvent.subject = subjectMatch ? subjectMatch[1] : 'UMA';
                } else if (cleanLine.startsWith('DTSTART')) {
                    const dtPart = cleanLine.split(':')[1];
                    if (dtPart) {
                        currentEvent.date = `${dtPart.slice(0, 4)}-${dtPart.slice(4, 6)}-${dtPart.slice(6, 8)}`;
                        const t = dtPart.split('T')[1];
                        currentEvent.time = t ? `${t.slice(0, 2)}:${t.slice(2, 4)}` : '23:59';
                    }
                }
            }
        }
        return events;
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
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'var(--glass-bg)', padding: '4px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    <button onClick={() => setSyncMode('link')} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: syncMode === 'link' ? 'var(--primary)' : 'transparent', color: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Link2 size={16} /> Enlace Campus
                    </button>
                    <button onClick={() => setSyncMode('paste')} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: syncMode === 'paste' ? 'var(--primary)' : 'transparent', color: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <ClipboardList size={16} /> Pegado Manual
                    </button>
                </div>

                <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                    <form onSubmit={handleSync}>
                        {syncMode === 'link' ? (
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label className="form-label">URL del Calendario (.ics)</label>
                                <input
                                    className="form-input"
                                    placeholder="https://marketinggestion.cv.uma.es/..."
                                    value={apiUrl}
                                    onChange={(e) => setApiUrl(e.target.value)}
                                    disabled={status === 'connecting'}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                                />
                            </div>
                        ) : (
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label className="form-label">Contenido ICS</label>
                                <textarea
                                    className="form-input"
                                    placeholder="BEGIN:VCALENDAR..."
                                    value={pastedIcs}
                                    onChange={(e) => setPastedIcs(e.target.value)}
                                    disabled={status === 'connecting'}
                                    style={{ minHeight: '120px', fontSize: '0.7rem', fontFamily: 'monospace', width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                                />
                            </div>
                        )}

                        {status === 'error' && (
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', padding: '12px', borderRadius: '10px', color: 'var(--error)', fontSize: '0.75rem', marginBottom: '20px', display: 'flex', gap: '8px' }}>
                                <AlertCircle size={16} /> <span>{error}</span>
                            </div>
                        )}

                        <button type="submit" disabled={status === 'connecting'} className="btn btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '14px', background: 'var(--primary)', boxShadow: '0 8px 20px var(--primary-glow)' }}>
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
