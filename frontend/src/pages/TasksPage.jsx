import React, { useState, useRef, useEffect } from 'react';
import { LayoutGrid, Calendar as CalIcon, List, CheckCircle2, Clock, Plus, X, Mic, MicOff, Link2, Loader2, AlertCircle, Zap, Search, MoreVertical, Trash2, RefreshCw, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TasksContext';
import { useUser } from '../context/UserContext';

// ── Helpers ────────────────────────────────────────────────
const TODAY = new Date();
const fmt = (d) => {
    const offset = d.getTimezoneOffset();
    const adjustedDate = new Date(d.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().split('T')[0];
};
const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const startOfWeek = (d) => { const r = new Date(d); const day = r.getDay(); r.setDate(r.getDate() - ((day + 6) % 7)); return r; };

const TasksPage = () => {
    const navigate = useNavigate();
    const { tasks, addTask, toggleTask, deleteTask, clearGenericTasks, lastSync, umaUrl, syncWithUMA, isSyncing } = useTasks();
    const { user } = useUser();

    const [view, setView] = useState('day');
    const [viewDate, setViewDate] = useState(new Date());
    const [showAddModal, setShowAddModal] = useState(false);
    const [toast, setToast] = useState(null);

    const todayStr = fmt(TODAY);
    const viewDateStr = fmt(viewDate);

    const currentWeekStart = startOfWeek(viewDate);
    const currentWeekDates = Array.from({ length: 7 }, (_, i) => fmt(addDays(currentWeekStart, i)));

    const navigateView = (direction) => {
        if (view === 'day') {
            setViewDate(prev => addDays(prev, direction));
        } else if (view === 'week') {
            setViewDate(prev => addDays(prev, direction * 7));
        } else if (view === 'month') {
            setViewDate(prev => {
                const next = new Date(prev);
                next.setMonth(next.getMonth() + direction);
                return next;
            });
        }
    };

    const handleManualRefresh = async () => {
        if (!umaUrl) {
            navigate('/sync');
            return;
        }
        const res = await syncWithUMA(umaUrl);
        if (res.success) showToast('Calendario actualizado', 'success');
        else showToast(`Error: ${res.error}`, 'error');
    };

    const showToast = (msg, type = 'info') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Form state
    const [newTitle, setNewTitle] = useState('');
    const [newTime, setNewTime] = useState('12:00');
    const [newPriority, setNewPriority] = useState('Media');
    const [newDate, setNewDate] = useState(todayStr);

    // Voice state
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    const toggleVoice = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return showToast('Navegador no soportado', 'error');
        if (isListening) { recognitionRef.current.stop(); return; }
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (e) => setNewTitle(e.results[0][0].transcript);
        recognition.start();
        recognitionRef.current = recognition;
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        addTask({ title: newTitle, time: newTime, priority: newPriority, category: 'Personal', date: newDate, status: 'pending' });
        setNewTitle('');
        setShowAddModal(false);
        showToast('Tarea añadida');
    };

    const viewOptions = [
        { id: 'day', label: 'Día', icon: Clock },
        { id: 'week', label: 'Semana', icon: LayoutGrid },
        { id: 'month', label: 'Mes', icon: CalIcon },
    ];

    const renderTaskItem = (task) => (
        <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`card task-item ${task.status === 'done' ? 'completed' : ''}`}
            style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                opacity: task.status === 'done' ? 0.6 : 1,
                background: task.status === 'done' ? 'rgba(255,255,255,0.02)' : 'var(--bg-card)'
            }}
        >
            <button
                onClick={() => toggleTask(task.id)}
                style={{
                    width: '24px', height: '24px', borderRadius: '8px',
                    border: task.status === 'done' ? 'none' : '2px solid var(--glass-border)',
                    background: task.status === 'done' ? 'var(--success)' : 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                {task.status === 'done' && <Check size={14} color="white" />}
            </button>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{
                        fontSize: '0.95rem', color: 'white', fontWeight: 600,
                        textDecoration: task.status === 'done' ? 'line-through' : 'none'
                    }}>{task.title}</h4>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {task.time}</span>
                    {task.subject && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CalIcon size={12} /> {task.subject}</span>}
                </div>
            </div>
            {task.status !== 'done' && (
                <div style={{ background: task.priority === 'Alta' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)', color: task.priority === 'Alta' ? 'var(--error)' : 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 800, padding: '4px 10px', borderRadius: '8px' }}>
                    {task.priority.toUpperCase()}
                </div>
            )}
            {task.status === 'done' && (
                <button onClick={() => deleteTask(task.id)} style={{ background: 'transparent', border: 'none', color: 'var(--error)', opacity: 0.4, cursor: 'pointer' }}><Trash2 size={16} /></button>
            )}
        </motion.div>
    );

    const renderGroupedTasks = (dateList) => {
        return dateList.map(dateStr => {
            const dayTasks = tasks.filter(t => t.date === dateStr);
            if (dayTasks.length === 0 && view !== 'day') return null;

            const [y, m, d] = dateStr.split('-');
            const dateObj = new Date(y, m - 1, d);
            const isToday = dateStr === todayStr;

            return (
                <div key={dateStr} style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                            padding: '6px 14px',
                            background: isToday ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            borderRadius: '10px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            color: 'white',
                            border: isToday ? 'none' : '1px solid var(--glass-border)',
                            boxShadow: isToday ? '0 4px 12px var(--primary-glow)' : 'none'
                        }}>
                            {DAY_NAMES[dateObj.getDay()].toUpperCase()} {d} {MONTH_NAMES[dateObj.getMonth()].slice(0, 3)}
                        </div>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)', opacity: 0.3 }} />
                    </div>
                    {dayTasks.length === 0 ? (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>Sin tareas para hoy</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {dayTasks.map(task => renderTaskItem(task))}
                        </div>
                    )}
                </div>
            );
        });
    };

    const renderMonthGrid = () => {
        const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
        const lastDay = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);

        let startWeekday = firstDay.getDay();
        startWeekday = startWeekday === 0 ? 6 : startWeekday - 1;

        const days = [];
        for (let i = 0; i < startWeekday; i++) days.push(null);
        for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), d));

        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(h => (
                        <div key={h} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '12px' }}>{h}</div>
                    ))}
                    {days.map((date, idx) => {
                        if (!date) return <div key={`empty-${idx}`} />;
                        const dStr = fmt(date);
                        const dayTasks = tasks.filter(t => t.date === dStr);
                        const isToday = dStr === todayStr;

                        return (
                            <div
                                key={dStr}
                                onClick={() => { setViewDate(date); setView('day'); }}
                                style={{
                                    aspectRatio: '1/1', background: isToday ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                                    borderRadius: '12px', display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                    border: isToday ? 'none' : '1px solid var(--glass-border)',
                                    transition: '0.2s', position: 'relative',
                                    boxShadow: isToday ? '0 0 15px var(--primary-glow)' : 'none'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = isToday ? 'var(--primary)' : 'rgba(255,255,255,0.1)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = isToday ? 'var(--primary)' : 'rgba(255,255,255,0.03)'; }}
                            >
                                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'white' }}>{date.getDate()}</span>
                                {dayTasks.length > 0 && (
                                    <div style={{ display: 'flex', gap: '3px', marginTop: '4px' }}>
                                        {dayTasks.slice(0, 3).map((t, i) => (
                                            <div key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', background: t.priority === 'Alta' ? 'var(--error)' : 'white' }} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        );
    };

    return (
        <div className="page-content" style={{ paddingBottom: '100px' }}>
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px' }}>Agenda</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Gestión académica inteligente</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {umaUrl && (
                        <button onClick={handleManualRefresh} className={`btn-icon ${isSyncing ? 'animate-spin' : ''}`} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '14px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSyncing ? 'var(--primary)' : 'white' }}>
                            <RefreshCw size={20} />
                        </button>
                    )}
                    <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ padding: '0 20px', borderRadius: '14px', height: '44px', fontWeight: 700 }}>
                        <Plus size={18} /> Nueva
                    </button>
                </div>
            </header>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
                <button onClick={() => navigateView(-1)} className="nav-arrow"><ChevronLeft size={20} /></button>
                <div style={{ background: 'var(--glass-bg)', padding: '8px 20px', borderRadius: '100px', border: '1px solid var(--glass-border)', minWidth: '240px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'white' }}>
                        {view === 'day' ? `${DAY_NAMES[viewDate.getDay()]}, ${viewDate.getDate()} de ${MONTH_NAMES[viewDate.getMonth()]}` : view === 'week' ? `Semana ${viewDate.getDate()} - ${addDays(currentWeekStart, 6).getDate()} de ${MONTH_NAMES[viewDate.getMonth()]}` : `${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`}
                    </span>
                </div>
                <button onClick={() => navigateView(1)} className="nav-arrow"><ChevronRight size={20} /></button>
            </div>

            {/* Switcher */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '14px', marginBottom: '32px', border: '1px solid var(--glass-border)' }}>
                {viewOptions.map(v => (
                    <button key={v.id} onClick={() => setView(v.id)} style={{ flex: 1, padding: '12px', border: 'none', background: view === v.id ? 'var(--primary)' : 'transparent', color: view === v.id ? 'white' : 'var(--text-muted)', borderRadius: '12px', cursor: 'pointer', transition: '0.3s', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: view === v.id ? '0 4px 15px var(--primary-glow)' : 'none' }}>
                        <v.icon size={16} /> {v.label}
                    </button>
                ))}
            </div>

            {/* List or Grid */}
            <div className="tasks-display">
                <AnimatePresence mode="popLayout">
                    {view === 'day' ? renderGroupedTasks([viewDateStr]) : view === 'week' ? renderGroupedTasks(currentWeekDates) : renderMonthGrid()}
                </AnimatePresence>
            </div>

            {/* Add Modal & Toast */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="modal-overlay" onClick={() => setShowAddModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()} className="card" style={{ width: '100%', maxWidth: '440px', padding: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Nueva Tarea</h3>
                                <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                            </div>
                            <form onSubmit={handleAddTask}>
                                <div className="form-group" style={{ marginBottom: '20px' }}>
                                    <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px', display: 'block' }}>DESCRIPCIÓN</label>
                                    <div style={{ position: 'relative' }}>
                                        <input className="form-input" style={{ width: '100%', padding: '14px 45px 14px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }} placeholder="¿Qué toca hoy?" value={newTitle} onChange={e => setNewTitle(e.target.value)} autoFocus />
                                        <button type="button" onClick={toggleVoice} style={{ position: 'absolute', right: '10px', top: '10px', background: isListening ? 'var(--error)' : 'transparent', border: 'none', color: 'white', borderRadius: '8px', padding: '5px' }}>{isListening ? <MicOff size={20} /> : <Mic size={20} />}</button>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                                    <div>
                                        <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: '8px', display: 'block' }}>FECHA</label>
                                        <input type="date" className="form-input" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }} value={newDate} onChange={e => setNewDate(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: '8px', display: 'block' }}>HORA</label>
                                        <input type="time" className="form-input" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }} value={newTime} onChange={e => setNewTime(e.target.value)} />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '14px', fontWeight: 800, boxShadow: '0 8px 24px var(--primary-glow)' }}>GUARDAR TAREA</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {toast && (
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} style={{ position: 'fixed', bottom: '110px', left: '20px', right: '20px', zIndex: 2000 }}>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '14px 24px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', maxWidth: '400px', margin: '0 auto' }}>
                        <Zap size={18} /> <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{toast.msg}</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default TasksPage;
