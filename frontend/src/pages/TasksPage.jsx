import React, { useState, useRef } from 'react';
import { LayoutGrid, Calendar as CalIcon, List, CheckCircle2, Clock, Plus, X, Mic, MicOff, Link2, Loader2, AlertCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Helpers ────────────────────────────────────────────────
const TODAY = new Date();
const fmt = (d) => d.toISOString().slice(0, 10);
const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const DAY_SHORT = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const startOfWeek = (d) => { const r = new Date(d); const day = r.getDay(); r.setDate(r.getDate() - ((day + 6) % 7)); return r; };

const todayStr = fmt(TODAY);
const weekStart = startOfWeek(TODAY);
const weekDates = Array.from({ length: 7 }, (_, i) => fmt(addDays(weekStart, i)));

// ── Component ──────────────────────────────────────────────
const TasksPage = () => {
    const [view, setView] = useState('day');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSyncModal, setShowSyncModal] = useState(false);

    const [tasks, setTasks] = useState([
        { id: 1, title: 'Entrega Práctica 3', time: '18:00', priority: 'Alta', status: 'pending', category: 'UMA', date: todayStr },
        { id: 2, title: 'Cuestionario Tema 4', time: '10:00', priority: 'Media', status: 'done', category: 'UMA', date: todayStr },
        { id: 3, title: 'Estudiar para Examen IA', time: '21:00', priority: 'Alta', status: 'pending', category: 'Personal', date: fmt(addDays(TODAY, 1)) },
        { id: 4, title: 'Revisión bibliográfica', time: '09:00', priority: 'Baja', status: 'pending', category: 'UMA', date: fmt(addDays(TODAY, 2)) },
        { id: 5, title: 'Reunión grupo TFG', time: '16:00', priority: 'Alta', status: 'pending', category: 'UMA', date: fmt(addDays(TODAY, 3)) },
        { id: 6, title: 'Entregar informe lab', time: '23:59', priority: 'Media', status: 'pending', category: 'UMA', date: fmt(addDays(TODAY, 5)) },
    ]);

    // Form state
    const [newTitle, setNewTitle] = useState('');
    const [newTime, setNewTime] = useState('12:00');
    const [newPriority, setNewPriority] = useState('Media');
    const [newDate, setNewDate] = useState(todayStr);

    // Voice state
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    // Sync state
    const [icsUrl, setIcsUrl] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);

    // Toast state
    const [toast, setToast] = useState(null);

    const views = [
        { id: 'day', icon: List, label: 'Día' },
        { id: 'week', icon: LayoutGrid, label: 'Semana' },
        { id: 'month', icon: CalIcon, label: 'Mes' },
    ];

    // ── Token helpers ──────────────────────────────────────
    const getTokens = () => Number(localStorage.getItem('planit_tokens')) || 0;
    const spendTokens = (n) => {
        const current = getTokens();
        if (current < n) return false;
        localStorage.setItem('planit_tokens', current - n);
        return true;
    };

    const showToast = (msg, type = 'error') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    // ── Task logic ─────────────────────────────────────────
    const toggleTask = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t));
    };

    const addTask = (e) => {
        e.preventDefault();
        if (!newTitle) return;
        setTasks([...tasks, { id: Date.now(), title: newTitle, time: newTime, priority: newPriority, status: 'pending', category: 'Personal', date: newDate }]);
        setShowAddModal(false);
        setNewTitle('');
        setNewDate(todayStr);
    };

    // ── Filtered tasks by view ─────────────────────────────
    const todayTasks = tasks.filter(t => t.date === todayStr);
    const weekTasks = tasks.filter(t => weekDates.includes(t.date));
    const visibleTasks = view === 'day' ? todayTasks : view === 'week' ? weekTasks : tasks;

    const completedCount = visibleTasks.filter(t => t.status === 'done').length;
    const progressPercent = visibleTasks.length ? Math.round((completedCount / visibleTasks.length) * 100) : 0;

    // ── Voice recognition ──────────────────────────────────
    const startVoice = () => {
        if (!spendTokens(1)) {
            showToast('Necesitas al menos 1 token. Ve a la pestaña Tokens.', 'error');
            return;
        }
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { showToast('Tu navegador no soporta reconocimiento de voz.'); return; }
        const recognition = new SR();
        recognition.lang = 'es-ES';
        recognition.interimResults = false;
        recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            setNewTitle(prev => prev ? `${prev} ${transcript}` : transcript);
            setIsListening(false);
        };
        recognition.onerror = () => { setIsListening(false); };
        recognition.onend = () => { setIsListening(false); };
        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
        showToast('🎤 Habla ahora... (-1 token)', 'success');
    };

    const stopVoice = () => {
        recognitionRef.current?.stop();
        setIsListening(false);
    };

    // ── UMA Sync ───────────────────────────────────────────
    const syncUMA = async (e) => {
        e.preventDefault();
        if (!icsUrl) return;
        if (!spendTokens(3)) {
            showToast('Necesitas al menos 3 tokens. Ve a la pestaña Tokens.', 'error');
            return;
        }
        setIsSyncing(true);
        try {
            const res = await fetch('/api/uma/import-calendar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ icsUrl })
            });
            const data = await res.json();
            if (data.success && data.tasks) {
                const imported = data.tasks.map(t => ({ ...t, id: Date.now() + Math.random(), status: 'pending', category: 'UMA', date: t.rawDate ? t.rawDate.slice(0, 10) : todayStr }));
                setTasks(prev => [...prev, ...imported]);
                showToast(`✅ ${data.total} tareas importadas (-3 tokens)`, 'success');
                setShowSyncModal(false);
                setIcsUrl('');
            } else {
                showToast(data.error || 'Error al importar');
            }
        } catch (err) {
            showToast('Error de conexión con el servidor');
        }
        setIsSyncing(false);
    };

    // ── Week grouping helper ───────────────────────────────
    const renderWeekView = () => {
        return weekDates.map(dateStr => {
            const d = new Date(dateStr + 'T00:00:00');
            const dayName = DAY_NAMES[d.getDay()];
            const dayNum = d.getDate();
            const isToday = dateStr === todayStr;
            const dayTasks = tasks.filter(t => t.date === dateStr);

            return (
                <div key={dateStr} style={{ marginBottom: '20px' }}>
                    <div className="day-section-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid var(--glass-border)' }}>
                        <span style={{ width: '36px', height: '36px', borderRadius: '10px', background: isToday ? 'var(--primary)' : 'var(--glass-bg)', color: isToday ? 'white' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>{dayNum}</span>
                        <div>
                            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: isToday ? 'var(--primary)' : 'var(--text-primary)' }}>{dayName}</span>
                            {isToday && <span style={{ marginLeft: '8px', fontSize: '0.65rem', padding: '2px 8px', background: 'var(--primary)', color: 'white', borderRadius: '100px', fontWeight: 700 }}>HOY</span>}
                        </div>
                        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{dayTasks.length} tarea{dayTasks.length !== 1 ? 's' : ''}</span>
                    </div>
                    {dayTasks.length === 0 ? (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '46px', fontStyle: 'italic' }}>Sin tareas</p>
                    ) : (
                        dayTasks.map(task => renderTaskCard(task))
                    )}
                </div>
            );
        });
    };

    // ── Month view ─────────────────────────────────────────
    const renderMonthView = () => {
        const year = TODAY.getFullYear();
        const month = TODAY.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0

        const tasksByDay = {};
        tasks.forEach(t => {
            const td = new Date(t.date + 'T00:00:00');
            if (td.getFullYear() === year && td.getMonth() === month) {
                const d = td.getDate();
                tasksByDay[d] = (tasksByDay[d] || 0) + 1;
            }
        });

        const cells = [];
        for (let i = 0; i < firstDayOfWeek; i++) cells.push(<div key={`e${i}`} />);
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === TODAY.getDate();
            const count = tasksByDay[day] || 0;
            cells.push(
                <div key={day} style={{ aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', fontSize: '0.8rem', background: isToday ? 'var(--primary)' : 'transparent', color: isToday ? 'white' : 'var(--text-secondary)', fontWeight: isToday ? 800 : 400, position: 'relative', cursor: count ? 'pointer' : 'default' }}>
                    {day}
                    {count > 0 && !isToday && (
                        <div style={{ position: 'absolute', bottom: '3px', display: 'flex', gap: '2px' }}>
                            {Array.from({ length: Math.min(count, 3) }, (_, i) => (
                                <div key={i} style={{ width: '4px', height: '4px', borderRadius: '2px', background: 'var(--primary)' }} />
                            ))}
                        </div>
                    )}
                    {count > 0 && isToday && (
                        <span style={{ fontSize: '0.55rem', fontWeight: 700 }}>{count}</span>
                    )}
                </div>
            );
        }

        return (
            <div className="card" style={{ padding: '16px' }}>
                <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '1rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
                    {MONTH_NAMES[month]} {year}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '12px' }}>
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                        <span key={d} style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>{d}</span>
                    ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                    {cells}
                </div>
            </div>
        );
    };

    // ── Reusable task card ─────────────────────────────────
    const renderTaskCard = (task) => (
        <motion.div key={task.id} whileTap={{ scale: 0.98 }} onClick={() => toggleTask(task.id)} className="card" style={{ marginBottom: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}>
            <div>{task.status === 'done' ? <CheckCircle2 color="var(--success)" size={22} /> : <div style={{ width: '22px', height: '22px', borderRadius: '11px', border: '2px solid var(--glass-border)' }} />}</div>
            <div style={{ flex: 1 }}>
                <h4 className={task.status === 'done' ? 'task-completed-text' : ''} style={{ fontSize: '0.95rem' }}>{task.title}</h4>
                <div style={{ display: 'flex', gap: '10px', marginTop: '3px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={11} /> {task.time}</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: task.priority === 'Alta' ? 'var(--error)' : task.priority === 'Baja' ? 'var(--success)' : 'var(--primary)', textTransform: 'uppercase' }}>{task.priority}</span>
                    {task.category === 'UMA' && <span className="premium-badge" style={{ fontSize: '0.6rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(139,92,246,0.2)', color: 'var(--secondary)', fontWeight: 700 }}>UMA</span>}
                </div>
            </div>
        </motion.div>
    );

    // ── Date display ───────────────────────────────────────
    const dayName = DAY_NAMES[TODAY.getDay()];
    const dateDisplay = `${dayName}, ${TODAY.getDate()} de ${MONTH_NAMES[TODAY.getMonth()]}`;

    return (
        <div className="page-content" style={{ paddingBottom: '100px' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Mi Agenda</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <span>{dateDisplay}</span>
                    <span style={{ padding: '2px 8px', background: 'var(--glass-bg)', borderRadius: '100px', fontSize: '0.7rem' }}>Hoy</span>
                </div>
            </div>

            {/* View Switcher */}
            <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '4px', borderRadius: '12px', marginBottom: '24px', border: '1px solid var(--glass-border)' }}>
                {views.map(v => {
                    const isActive = view === v.id;
                    return (
                        <button key={v.id} onClick={() => setView(v.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', border: 'none', background: isActive ? 'var(--primary)' : 'transparent', color: isActive ? 'white' : 'var(--text-muted)', borderRadius: '8px', cursor: 'pointer', transition: 'var(--transition)', fontSize: '0.8rem', fontWeight: 600 }}>
                            <v.icon size={16} />{v.label}
                        </button>
                    );
                })}
            </div>

            {/* Progress Card */}
            <div className="card" style={{ marginBottom: '16px', background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(59,130,246,0.1) 100%)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                        PROGRESO {view === 'day' ? 'DIARIO' : view === 'week' ? 'SEMANAL' : 'MENSUAL'}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                        <div>
                            <h3 style={{ fontSize: '1.75rem' }}>{completedCount} de {visibleTasks.length}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>tareas completadas</p>
                        </div>
                        <h3 style={{ fontSize: '1.75rem', color: 'var(--primary)' }}>{progressPercent}%</h3>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} style={{ height: '100%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary-glow)' }} />
                    </div>
                </div>
            </div>

            {/* UMA Sync Button */}
            <button onClick={() => setShowSyncModal(true)} className="premium-btn" style={{ width: '100%', padding: '12px 16px', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.15) 100%)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '14px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-main)', fontSize: '0.85rem', fontWeight: 600 }}>
                <div style={{ padding: '8px', background: 'var(--secondary)', borderRadius: '10px', display: 'flex' }}><Link2 size={18} color="white" /></div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                    <span>Sincronizar Campus Virtual</span>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>Importar tareas de Moodle UMA</span>
                </div>
                <span className="premium-badge" style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(139,92,246,0.25)', color: 'var(--secondary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={10} /> 3 Tokens</span>
            </button>

            {/* ── Task Content ── */}
            <div className="task-section">
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                    {view === 'day' ? 'Tareas de Hoy' : view === 'week' ? 'Esta Semana' : MONTH_NAMES[TODAY.getMonth()] + ' ' + TODAY.getFullYear()}
                </h3>

                {view === 'month' ? renderMonthView() : view === 'week' ? renderWeekView() : (
                    todayTasks.length === 0
                        ? <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0', fontSize: '0.9rem' }}>🎉 No tienes tareas para hoy</p>
                        : todayTasks.map(task => renderTaskCard(task))
                )}
            </div>

            {/* FAB */}
            <div onClick={() => setShowAddModal(true)} style={{ position: 'fixed', bottom: '100px', right: '20px', width: '60px', height: '60px', borderRadius: '30px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px var(--primary-glow)', cursor: 'pointer', zIndex: 100 }}>
                <Plus color="white" size={28} />
            </div>

            {/* ══════ Add Task Modal ══════ */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
                        <motion.div className="modal-content" initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}>
                            {/* Header */}
                            <div style={{ background: '#f8fafc', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #e2e8f0' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '24px', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle2 color="white" size={28} /></div>
                                <div>
                                    <h3 style={{ color: '#0f172a', fontSize: '1.25rem' }}>Nueva Tarea</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Añadir a mi agenda académica</p>
                                </div>
                                <button onClick={() => setShowAddModal(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
                            </div>

                            <div style={{ padding: '24px' }}>
                                <form onSubmit={addTask}>
                                    {/* Title + Voice */}
                                    <div className="form-group">
                                        <label className="form-label">Título de la Tarea</label>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <input className="form-input" placeholder="Ej: Entrega de Proyecto" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} autoFocus style={{ flex: 1 }} />
                                            <button type="button" onClick={isListening ? stopVoice : startVoice} className={`voice-btn ${isListening ? 'voice-active' : ''}`} style={{ width: '48px', minWidth: '48px', height: '48px', borderRadius: '12px', border: '1px solid', borderColor: isListening ? 'var(--error)' : 'rgba(139,92,246,0.4)', background: isListening ? 'rgba(239,68,68,0.15)' : 'rgba(139,92,246,0.1)', color: isListening ? 'var(--error)' : 'var(--secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }}>
                                                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                                            </button>
                                        </div>
                                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={10} /> Dictado por voz: 1 token</p>
                                    </div>

                                    {/* Date */}
                                    <div className="form-group">
                                        <label className="form-label">Fecha</label>
                                        <input type="date" className="form-input" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                                    </div>

                                    {/* Time + Priority */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                        <div className="form-group">
                                            <label className="form-label">Horario</label>
                                            <input type="time" className="form-input" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Prioridad</label>
                                            <select className="form-input" value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
                                                <option>Alta</option>
                                                <option>Media</option>
                                                <option>Baja</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancelar</button>
                                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Añadir Tarea</button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ══════ UMA Sync Modal ══════ */}
            <AnimatePresence>
                {showSyncModal && (
                    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowSyncModal(false)}>
                        <motion.div className="modal-content" initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}>
                            <div style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '24px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Link2 color="white" size={24} /></div>
                                <div>
                                    <h3 style={{ color: 'white', fontSize: '1.15rem' }}>Campus Virtual UMA</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>Sincronizar calendario Moodle</p>
                                </div>
                                <button onClick={() => setShowSyncModal(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <form onSubmit={syncUMA}>
                                    <div className="form-group">
                                        <label className="form-label">URL del Calendario ICS</label>
                                        <input className="form-input" placeholder="https://cv.uma.es/calendar/export.ics?..." value={icsUrl} onChange={(e) => setIcsUrl(e.target.value)} />
                                    </div>
                                    <div style={{ padding: '12px 16px', background: 'rgba(139,92,246,0.1)', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        <AlertCircle size={16} color="var(--secondary)" />
                                        <span>Esta acción consume <strong style={{ color: 'var(--secondary)' }}>3 tokens</strong>. Saldo actual: <strong style={{ color: 'var(--primary)' }}>{getTokens()}</strong></span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button type="button" onClick={() => setShowSyncModal(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancelar</button>
                                        <button type="submit" disabled={isSyncing} className="btn btn-primary" style={{ flex: 1, background: 'var(--secondary)', boxShadow: '0 4px 12px var(--secondary-glow)' }}>
                                            {isSyncing ? <><Loader2 className="animate-spin" size={18} /> Importando...</> : <><Link2 size={18} /> Sincronizar</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ══════ Toast ══════ */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} style={{ position: 'fixed', bottom: '100px', left: '20px', right: '20px', padding: '14px 18px', background: toast.type === 'success' ? 'var(--success)' : 'var(--error)', borderRadius: '12px', color: 'white', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: `0 8px 32px ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`, zIndex: 3000 }}>
                        {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TasksPage;
