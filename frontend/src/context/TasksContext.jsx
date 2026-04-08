import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

const TasksContext = createContext();

const TODAY = new Date();
const fmt = (d) => d.toISOString().slice(0, 10);
const todayStr = fmt(TODAY);

export const TasksProvider = ({ children }) => {
    const { user, setCalendarUrl } = useUser();
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('planit_tasks');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Migración: añadir 'source' si falta
            const migrated = parsed.map(t => {
                if (t.source) return t;
                if (t.category === 'UMA') {
                    if (t.title.includes('Entrega Práctica 3') || t.title.includes('Cuestionario Tema 4')) return { ...t, source: 'DEFAULT' };
                    return { ...t, source: 'UMA_IMPORT' };
                }
                return { ...t, source: 'USER' };
            });
            return migrated;
        }
        return [
            { id: 1, title: 'Entrega Práctica 3', time: '18:00', priority: 'Alta', status: 'pending', category: 'UMA', source: 'DEFAULT', date: todayStr },
            { id: 2, title: 'Cuestionario Tema 4', time: '10:00', priority: 'Media', status: 'done', category: 'UMA', source: 'DEFAULT', date: todayStr },
        ];
    });

    const [lastSync, setLastSync] = useState(() => localStorage.getItem('planit_last_sync') || null);
    const [isSyncing, setIsSyncing] = useState(false);

    // Persistir tareas localmente para rapidez
    useEffect(() => {
        localStorage.setItem('planit_tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        if (lastSync) localStorage.setItem('planit_last_sync', lastSync);
    }, [lastSync]);

    // Silently Sync on boot if user has a calendarUrl
    useEffect(() => {
        if (user && user.calendarUrl) {
            console.log("🔄 Iniciando sincronización silenciosa...");
            syncWithUMA(user.calendarUrl);
        }
    }, [user?.uid]); // Sólo al cargar el usuario por primera vez tras el login

    const addTask = (task) => {
        setTasks(prev => [...prev, { ...task, id: Date.now(), source: 'USER' }]);
    };

    const importTasks = (newTasks) => {
        // Evitar duplicados basados en título y fecha (simplificado)
        setTasks(prev => {
            const existingKeys = new Set(prev.map(t => `${t.title}-${t.date}`));
            const trulyNew = newTasks.filter(t => !existingKeys.has(`${t.title}-${t.date}`));
            return [...prev, ...trulyNew];
        });
        setLastSync(new Date().toISOString());
    };

    const toggleTask = (id) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t));
    };

    const deleteTask = (id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const clearGenericTasks = () => {
        // Mantener USER y UMA_IMPORT, pero borrar DEFAULT (placeholders)
        setTasks(prev => prev.filter(t => t.source !== 'DEFAULT'));
    };

    const parseICS = (data) => {
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
                        const year = dtPart.slice(0, 4);
                        const month = dtPart.slice(4, 6);
                        const day = dtPart.slice(6, 8);
                        const hour = dtPart.slice(9, 11) || '00';
                        const min = dtPart.slice(11, 13) || '00';
                        currentEvent.date = `${year}-${month}-${day}`;
                        currentEvent.time = `${hour}:${min}`;
                        if (hour === '00' && min === '00') currentEvent.time = '23:59';
                    }
                }
            }
        }
        return events;
    };

    const syncWithUMA = async (url) => {
        if (!url) return { success: false, error: 'No hay URL configurada.' };

        setIsSyncing(true);
        try {
            // Actualizar URL en el perfil si cambió
            if (url !== user?.calendarUrl) {
                setCalendarUrl(url);
            }

            // Usamos el backend propio encargado de parsear el ICS
            const response = await fetch('/api/uma/import-calendar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ icsUrl: url })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Error al importar el calendario.');
            }

            const parsedTasks = result.tasks;
            const sixtyDaysAgo = new Date();
            sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

            // Filtrar por fecha (tareas recientes)
            const newTasks = parsedTasks
                .filter(t => new Date(t.rawDate) >= sixtyDaysAgo)
                .map(t => ({
                    ...t,
                    id: Math.random(), // Generar un ID numérico/random para el frontend
                    category: 'UMA',
                    source: 'UMA_IMPORT',
                    status: 'pending'
                }));

            importTasks(newTasks);
            setIsSyncing(false);
            return { success: true, count: newTasks.length };
        } catch (err) {
            setIsSyncing(false);
            console.error("Sync Error:", err.message);
            return { success: false, error: err.message };
        }
    };

    return (
        <TasksContext.Provider value={{
            tasks, addTask, importTasks, toggleTask, deleteTask,
            clearGenericTasks, umaUrl: user?.calendarUrl,
            syncWithUMA, lastSync, isSyncing
        }}>
            {children}
        </TasksContext.Provider>
    );
};

export const useTasks = () => useContext(TasksContext);
