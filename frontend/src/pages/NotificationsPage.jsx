import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, Calendar, CheckCircle2, ChevronLeft, Zap, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TasksContext';

const NotificationsPage = () => {
    const navigate = useNavigate();
    const { tasks } = useTasks();

    // Obtener tareas en las próximas 24 horas
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcomingTasks = tasks.filter(task => {
        if (!task.date || task.status === 'done') return false;
        const taskDate = new Date(task.date + 'T' + (task.time || '23:59'));
        return taskDate >= now && taskDate <= tomorrow;
    }).sort((a, b) => {
        const dateA = new Date(a.date + 'T' + (a.time || '23:59'));
        const dateB = new Date(b.date + 'T' + (b.time || '23:59'));
        return dateA - dateB;
    });

    return (
        <div className="page-content" style={{ paddingBottom: '100px' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '10px', color: 'white', cursor: 'pointer' }}
                >
                    <ChevronLeft size={20} />
                </button>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '2px' }}>Notificaciones</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Tareas urgentes (Próximas 24h)</p>
                </div>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '10px', borderRadius: '12px', border: '1px solid var(--primary-glow)' }}>
                    <Bell size={20} color="var(--primary)" />
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {upcomingTasks.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card"
                        style={{ textAlign: 'center', padding: '40px 20px', borderStyle: 'dashed', background: 'rgba(255,255,255,0.02)' }}
                    >
                        <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Todo bajo control</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No tienes tareas pendientes para las próximas 24 horas.</p>
                        <button
                            onClick={() => navigate('/tasks')}
                            className="btn btn-primary"
                            style={{ marginTop: '24px', padding: '10px 24px' }}
                        >
                            Ver toda la Agenda
                        </button>
                    </motion.div>
                ) : (
                    <>
                        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--warning)', padding: '12px 16px', borderRadius: '12px', color: 'var(--warning)', fontSize: '0.8rem', display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                            <Zap size={16} />
                            <span>¡Atención! Tienes {upcomingTasks.length} tareas que vencen pronto.</span>
                        </div>

                        {upcomingTasks.map((task, idx) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="card"
                                style={{ padding: '20px', borderLeft: task.priority === 'Alta' ? '4px solid var(--error)' : '4px solid var(--primary)' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>{task.title}</h4>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{task.subject || 'Tarea General'}</p>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, color: task.priority === 'Alta' ? 'var(--error)' : 'var(--text-muted)' }}>
                                        {task.priority.toUpperCase()}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                                        <Clock size={14} />
                                        {task.time}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        <Calendar size={14} />
                                        Hoy
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </>
                )}
            </div>

            <div className="card" style={{ marginTop: '32px', background: 'rgba(255,255,255,0.02)', padding: '20px' }}>
                <h5 style={{ fontSize: '0.9rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Info size={16} color="var(--primary)" /> Smart Notifications</h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Planit analiza tu agenda académica para mostrarte solo lo más urgente aquí. Mantén activadas las notificaciones del navegador para recibir avisos de entrega.
                </p>
            </div>
        </div>
    );
};

export default NotificationsPage;
