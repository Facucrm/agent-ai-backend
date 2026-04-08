import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, LogIn, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

import { useUser } from '../context/UserContext';

const LoginPage = () => {
    const { loginAsDemo } = useUser();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            // El login con Google es la vía rápida solicitada
            await signInWithPopup(auth, googleProvider);
            navigate('/');
        } catch (err) {
            let errorMsg = 'Error al iniciar con Google.';
            if (err.code === 'auth/operation-not-allowed') errorMsg = 'Google Auth no está habilitado en Firebase Console.';
            else if (err.code === 'auth/unauthorized-domain') errorMsg = 'Este dominio no está autorizado en Firebase.';
            else if (err.code === 'auth/popup-blocked') errorMsg = 'El navegador bloqueó la ventana emergente.';
            else errorMsg = `Error: ${err.code || 'Verifica tu configuración'}`;

            setError(errorMsg);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: name });
            }
            navigate('/');
        } catch (err) {
            if (err.code === 'auth/invalid-credential') setError('Credenciales incorrectas.');
            else if (err.code === 'auth/email-already-in-use') setError('El correo ya está registrado.');
            else if (err.code === 'auth/weak-password') setError('La contraseña es muy débil (mín. 6 car.)');
            else setError('Ocurrió un error. Inténtalo de nuevo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: 'radial-gradient(circle at top right, #1e1b4b 0%, #030712 100%)', // Diseño de la Web
            fontFamily: "'Montserrat', sans-serif"
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '40px',
                    background: 'rgba(3, 7, 18, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--glass-border)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '72px',
                        height: '72px',
                        margin: '0 auto 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Logo size={72} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', color: 'white', marginBottom: '8px', fontWeight: 700 }}>{isLogin ? '¡Bienvenido de nuevo!' : 'Crea tu cuenta'}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{isLogin ? 'Tus tareas y metas te esperan.' : 'Comienza tu viaje académico inteligente.'}</p>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', color: 'var(--error)', padding: '12px', borderRadius: '12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <AlertCircle size={16} /> {error}
                    </motion.div>
                )}

                <form onSubmit={handleEmailAuth}>
                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="form-group"
                            >
                                <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px', display: 'block' }}>NOMBRE COMPLETO</label>
                                <div style={{ position: 'relative' }}>
                                    <User style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={18} />
                                    <input className="form-input" style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }} placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} required={!isLogin} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px', display: 'block' }}>CORREO ELECTRÓNICO</label>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={18} />
                            <input type="email" className="form-input" style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }} placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label className="form-label" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px', display: 'block' }}>CONTRASEÑA</label>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={18} />
                            <input type="password" className="form-input" style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--primary)', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
                        {!loading && <ChevronRight size={18} />}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: '16px' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>O CONTINÚA CON</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="btn btn-ghost"
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        fontSize: '0.9rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--glass-border)',
                        color: 'white',
                        cursor: 'pointer',
                        marginBottom: '16px'
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
                    Google
                </button>

                <div
                    onClick={loginAsDemo}
                    style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', opacity: 0.8, textDecoration: 'underline' }}
                >
                    Entrar en modo Demo (sin configuración)
                </div>

                <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'} {' '}
                    <span onClick={() => setIsLogin(!isLogin)} style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>
                        {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
                    </span>
                </p>

                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', marginTop: '24px', lineHeight: 1.4, textAlign: 'center' }}>
                    Al entrar, aceptas los términos de uso de Planit para estudiantes de la UMA.
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
