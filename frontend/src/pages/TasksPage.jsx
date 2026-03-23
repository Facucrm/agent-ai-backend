import React, { useState } from 'react';
import { LayoutGrid, Calendar as CalIcon, List, CheckCircle2, Clock, Plus, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TasksPage = () => {
    const [view, setView] = useState('day'); // 'day' | 'week' | 'month'
    const [showAddModal, setShowAddModal] = useState(false);
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Entrega Práctica 3', time: '18:00', priority: 'Alta', status: 'pending', category: 'UMA' },
        { id: 2, title: 'Cuestionario Tema 4', time: 'Mañana', priority: 'Media', status: 'done', category: 'UMA' },
        { id: 3, title: 'Estudiar para Examen IA', time: '21:00', priority: 'Alta', status: 'pending', category: 'Personal' },
    ]);

    // Form State
    const [newTitle, setNewTitle] = useState('');
    const [newTime, setNewTime] = useState('12:00');
    const [newPriority, setNewPriority] = useState('Media');

    const views = [
        { id: 'day', icon: List, label: 'Día' },
        { id: 'week', icon: LayoutGrid, label: 'Semana' },
        { id: 'month', icon: CalIcon, label: 'Mes' },
    ];

    const toggleTask = (id) => {
        setTasks(tasks.map(t =>
            t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t
        ));
    };

    const addTask = (e) => {
        e.preventDefault();
        if (!newTitle) return;
        const newTask = {
            id: Date.now(),
            title: newTitle,
            time: newTime,
            priority: newPriority,
            status: 'pending',
            category: 'UMA'
        };
        setTasks([...tasks, newTask]);
        setShowAddModal(false);
        setNewTitle('');
    };

    const completedCount = tasks.filter(t => t.status === 'done').length;
    const progressPercent = Math.round((completedCount / tasks.length) * 100) || 0;

    return (
        <div className="page-content" style={{ paddingBottom: '100px' }}>
            <div className="section-header" style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Mi Agenda</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <span>Lunes, 23 de Marzo</span>
                    <span style={{ padding: '2px 8px', background: 'var(--glass-bg)', borderRadius: '100px', fontSize: '0.7rem' }}>Hoy</span>
                </div>
            </div>

            {/* View Switcher */}
            <div className="switcher" style={{ display: 'flex', background: 'var(--bg-card)', padding: '4px', borderRadius: '12px', marginBottom: '24px', border: '1px solid var(--glass-border)' }}>
                {views.map((v) => {
                    const isActive = view === v.id;
                    return (
                        <button
                            key={v.id}
                            onClick={() => setView(v.id)}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', border: 'none', background: isActive ? 'var(--primary)' : 'transparent', color: isActive ? 'white' : 'var(--text-muted)', borderRadius: '8px', cursor: 'pointer', transition: 'var(--transition)', fontSize: '0.8rem', fontWeight: 600 }}
                        >
                            <v.icon size={16} />
                            {v.label}
                        </button>
                    );
                })}
            </div>

            {/* Progress Card */}
            <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(59, 130, 246, 0.1) 100%)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                        PROGRESO {view === 'day' ? 'DIARIO' : view === 'week' ? 'SEMANAL' : 'MENSUAL'}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                        <div>
                            <h3 style={{ fontSize: '1.75rem' }}>{completedCount} de {tasks.length}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>tareas completadas</p>
                        </div>
                        <h3 style={{ fontSize: '1.75rem', color: 'var(--primary)' }}>{progressPercent}%</h3>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} style={{ height: '100%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary-glow)' }} />
                    </div>
                </div>
            </div>

            {/* Task List or Calendar Grid */}
            <div className="task-section">
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                    {view === 'month' ? 'Marzo 2026' : 'Próximas'}
                </h3>

                {view === 'month' ? (
                    <div className="card" style={{ padding: '16px' }}>
                        {/* Calendar Header */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '12px' }}>
                            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                                <span key={d} style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>{d}</span>
                            ))}
                        </div>
                        {/* Calendar Body */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                            {Array.from({ length: 31 }, (_, i) => {
                                const day = i + 1;
                                const isToday = day === 23;
                                const hasTask = [12, 18, 23, 24, 28].includes(day);
                                return (
                                    <div
                                        key={day}
                                        style={{
                                            aspectRatio: '1',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '8px',
                                            fontSize: '0.8rem',
                                            background: isToday ? 'var(--primary)' : 'transparent',
                                            color: isToday ? 'white' : 'var(--text-secondary)',
                                            fontWeight: isToday ? 800 : 400,
                                            position: 'relative'
                                        }}
                                    >
                                        {day}
                                        {hasTask && !isToday && (
                                            <div style={{ position: 'absolute', bottom: '4px', width: '4px', height: '4px', borderRadius: '2px', background: 'var(--primary)' }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <motion.div
                            key={task.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleTask(task.id)}
                            className="card"
                            style={{ marginBottom: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
                        >
                            <div>
                                {task.status === 'done' ? <CheckCircle2 color="var(--success)" size={24} /> : <div style={{ width: '24px', height: '24px', borderRadius: '12px', border: '2px solid var(--glass-border)' }} />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 className={task.status === 'done' ? 'task-completed-text' : ''} style={{ fontSize: '1rem' }}>{task.title}</h4>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={12} /> {task.time}
                                    </span>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: task.priority === 'Alta' ? 'var(--error)' : 'var(--primary)', textTransform: 'uppercase' }}>{task.priority}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Floating Action Button */}
            <div
                className="fab"
                onClick={() => setShowAddModal(true)}
                style={{ position: 'fixed', bottom: '100px', right: '20px', width: '60px', height: '60px', borderRadius: '30px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px var(--primary-glow)', cursor: 'pointer', zIndex: 100 }}
            >
                <Plus color="white" size={28} />
            </div>

            {/* Add Task Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="modal-overlay">
                        <motion.div
                            className="modal-content"
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        >
                            {/* UMA-style header */}
                            <div style={{ background: '#f8fafc', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #e2e8f0' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '24px', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircle2 color="white" size={28} />
                                </div>
                                <div>
                                    <h3 style={{ color: '#0f172a', fontSize: '1.25rem' }}>Nueva Tarea</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Añadir a mi agenda académica</p>
                                </div>
                                <button onClick={() => setShowAddModal(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div style={{ padding: '24px' }}>
                                <form onSubmit={addTask}>
                                    <div className="form-group">
                                        <label className="form-label">Título de la Tarea</label>
                                        <input
                                            className="form-input"
                                            placeholder="Ej: Entrega de Proyecto"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                        <div className="form-group">
                                            <label className="form-label">Horario</label>
                                            <input
                                                type="time"
                                                className="form-input"
                                                value={newTime}
                                                onChange={(e) => setNewTime(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Prioridad</label>
                                            <select
                                                className="form-input"
                                                value={newPriority}
                                                onChange={(e) => setNewPriority(e.target.value)}
                                            >
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
        </div>
    );
};

export default TasksPage;
