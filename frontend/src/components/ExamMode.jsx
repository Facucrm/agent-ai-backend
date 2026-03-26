import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Music, CheckCircle2, ChevronUp, ChevronDown, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExamMode = () => {
    const [durationMins, setDurationMins] = useState(25);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showDone, setShowDone] = useState(false);

    const studyAudioRef = useRef(null);
    const alarmAudioRef = useRef(null);

    // Inicializar audios
    useEffect(() => {
        // Sonido de olas de mar relajantes
        studyAudioRef.current = new Audio('https://ia801402.us.archive.org/32/items/ocean-waves-ambient/ocean-waves.mp3');
        studyAudioRef.current.loop = true;
        studyAudioRef.current.volume = 0.4;

        alarmAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1070/1070-preview.mp3'); // Timbre final
        alarmAudioRef.current.volume = 0.6;

        return () => {
            if (studyAudioRef.current) {
                studyAudioRef.current.pause();
                studyAudioRef.current = null;
            }
            if (alarmAudioRef.current) {
                alarmAudioRef.current.pause();
                alarmAudioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            setShowDone(true);
            if (studyAudioRef.current) studyAudioRef.current.pause();
            if (soundEnabled) alarmAudioRef.current.play();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, soundEnabled]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const resetTimer = () => {
        if (alarmAudioRef.current) {
            alarmAudioRef.current.pause();
            alarmAudioRef.current.currentTime = 0;
        }
        if (studyAudioRef.current) {
            studyAudioRef.current.pause();
        }
        setTimeLeft(durationMins * 60);
        setIsActive(false);
        setShowDone(false);
    };

    const handlePlayPause = () => {
        if (!isActive) {
            if (showDone) resetTimer();
            setIsActive(true);
            if (soundEnabled && studyAudioRef.current) {
                studyAudioRef.current.play().catch(err => console.error('Audio play error:', err));
            }
        } else {
            setIsActive(false);
            if (studyAudioRef.current) {
                studyAudioRef.current.pause();
            }
        }
    };

    const adjustTime = (delta) => {
        if (isActive) return;
        const newMins = Math.max(1, durationMins + delta);
        setDurationMins(newMins);
        setTimeLeft(newMins * 60);
    };

    return (
        <div className="card" style={{ padding: '24px', textAlign: 'center', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px', color: 'var(--secondary)' }}>
                <Music size={20} />
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, letterSpacing: '0.05rem' }}>MODO ESTUDIO</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
                {!isActive && !showDone && (
                    <button onClick={() => adjustTime(5)} className="btn btn-ghost" style={{ padding: '2px', opacity: 0.6, marginBottom: '-10px', zIndex: 1 }}>
                        <ChevronUp size={20} />
                    </button>
                )}

                <div style={{
                    fontSize: '4.5rem',
                    fontWeight: 900,
                    fontFamily: 'var(--font-display)',
                    color: 'white',
                    lineHeight: 1,
                    textShadow: isActive ? '0 0 30px var(--secondary-glow)' : 'none',
                    transition: 'var(--transition)'
                }}>
                    {formatTime(timeLeft)}
                </div>

                {!isActive && !showDone && (
                    <button onClick={() => adjustTime(-5)} className="btn btn-ghost" style={{ padding: '2px', opacity: 0.6, marginTop: '-10px', zIndex: 1 }}>
                        <ChevronDown size={20} />
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
                <button
                    onClick={handlePlayPause}
                    className="btn btn-primary"
                    style={{
                        width: '64px', height: '64px', borderRadius: '32px',
                        background: 'var(--secondary)',
                        boxShadow: isActive ? '0 0 25px var(--secondary-glow)' : '0 10px 20px rgba(0,0,0,0.2)',
                        border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    {isActive ? <Pause size={30} fill="white" /> : <Play size={30} style={{ marginLeft: '4px' }} fill="white" />}
                </button>
                <button
                    onClick={resetTimer}
                    className="btn btn-ghost"
                    style={{ width: '64px', height: '64px', borderRadius: '32px', border: '1px solid var(--glass-border)' }}
                >
                    <RotateCcw size={24} />
                </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
                <div
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                        padding: '8px 12px', borderRadius: '12px', background: soundEnabled ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                        color: soundEnabled ? 'var(--secondary)' : 'var(--text-muted)',
                        transition: 'var(--transition)'
                    }}
                >
                    <Volume2 size={18} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{soundEnabled ? 'Sonido ON' : 'Silencio'}</span>
                </div>
            </div>

            {/* Mensaje de finalización */}
            <AnimatePresence>
                {showDone && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(3, 7, 18, 0.95)', backdropFilter: 'blur(10px)',
                            borderRadius: 'inherit', zIndex: 10, display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', padding: '20px'
                        }}
                    >
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <Bell size={48} color="var(--secondary)" style={{ marginBottom: '16px' }} />
                        </motion.div>
                        <h4 style={{ fontSize: '1.4rem', color: 'white', marginBottom: '8px' }}>¡Tiempo cumplido! ☕</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Has completado tu sesión. Es hora de un pequeño descanso.</p>
                        <button onClick={resetTimer} className="btn btn-primary" style={{ background: 'var(--secondary)', padding: '12px 24px', borderRadius: '12px' }}>
                            Reiniciar
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '20px', lineHeight: 1.4 }}>
                {isActive ? 'Concentración profunda con el sonido de las olas...' : 'Configura tu sesión de estudio con sonidos de la naturaleza.'}
            </p>
        </div>
    );
};

export default ExamMode;
